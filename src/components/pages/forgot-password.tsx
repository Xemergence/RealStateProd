import { useState } from 'react';
import { useAuth } from '../../../supabase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) setError(error.message);
    else setMessage('Check your email for a reset link.');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-6 w-full max-w-md space-y-4">
        <h1 className="text-xl font-semibold">Reset your password</h1>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        {message && <div className="text-sm text-green-600">{message}</div>}
        <Button type="submit" disabled={loading} className="w-full rounded-full">{loading ? 'Sending...' : 'Send reset link'}</Button>
      </form>
    </div>
  );
}