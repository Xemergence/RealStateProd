-- Complete authentication setup with user roles
-- Drop existing tables and start fresh
DROP TABLE IF EXISTS public.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_user_update() CASCADE;

-- Create users table with role support
CREATE TABLE public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL,
    full_name text,
    role text NOT NULL CHECK (role IN ('tenant', 'property_owner')),
    avatar_url text,
    phone text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    address text NOT NULL,
    description text,
    rent_amount decimal(10,2),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create tenancies table (relationship between tenants and properties)
CREATE TABLE IF NOT EXISTS public.tenancies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
    tenant_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    start_date date NOT NULL,
    end_date date,
    rent_amount decimal(10,2) NOT NULL,
    status text DEFAULT 'active' CHECK (status IN ('active', 'ended', 'pending')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenancies ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Properties policies
DROP POLICY IF EXISTS "Property owners can view their properties" ON public.properties;
CREATE POLICY "Property owners can view their properties" ON public.properties
    FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Property owners can manage their properties" ON public.properties;
CREATE POLICY "Property owners can manage their properties" ON public.properties
    FOR ALL USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Tenants can view their rented properties" ON public.properties;
CREATE POLICY "Tenants can view their rented properties" ON public.properties
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tenancies 
            WHERE tenancies.property_id = properties.id 
            AND tenancies.tenant_id = auth.uid()
            AND tenancies.status = 'active'
        )
    );

-- Tenancies policies
DROP POLICY IF EXISTS "Users can view their tenancies" ON public.tenancies;
CREATE POLICY "Users can view their tenancies" ON public.tenancies
    FOR SELECT USING (
        auth.uid() = tenant_id OR 
        auth.uid() IN (SELECT owner_id FROM public.properties WHERE id = property_id)
    );

DROP POLICY IF EXISTS "Property owners can manage tenancies" ON public.tenancies;
CREATE POLICY "Property owners can manage tenancies" ON public.tenancies
    FOR ALL USING (
        auth.uid() IN (SELECT owner_id FROM public.properties WHERE id = property_id)
    );

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, avatar_url, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'tenant'),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle user updates
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET
    email = NEW.email,
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', full_name),
    role = COALESCE(NEW.raw_user_meta_data->>'role', role),
    avatar_url = NEW.raw_user_meta_data->>'avatar_url',
    phone = NEW.raw_user_meta_data->>'phone',
    updated_at = timezone('utc'::text, now())
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tenancies;