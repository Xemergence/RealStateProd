import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../../supabase/supabase';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Finishing sign in...');

  useEffect(() => {
    const run = async () => {
      try {
        // Exchange the code in the URL for a session
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) throw error;

        const type = searchParams.get('type');
        if (type === 'recovery') {
          // Go to reset password page
          navigate('/reset-password');
          return;
        }

        // Navigate by role after signup/confirm
        const { data: userData } = await supabase.auth.getUser();
        const id = userData.user?.id;
        if (id) {
          const { data } = await supabase.from('users').select('role').eq('id', id).single();
          const role = data?.role as 'tenant' | 'property_owner' | undefined;
          if (role === 'tenant') navigate('/tenant-dashboard');
          else navigate('/dashboard');
        } else {
          navigate('/dashboard');
        }
      } catch (e: any) {
        setMessage(e?.message || 'Could not complete sign in. Please try again.');
      }
    };
    run();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-gray-800">{message}</div>
    </div>
  );
}