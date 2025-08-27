import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure the recovery code in URL is exchanged for a session (handled in /auth/callback)
    // If user navigates directly here without a session, try to exchange
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        await supabase.auth.exchangeCodeForSession(window.location.href).catch(()=>{});
      }
    })();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirm) return setError('Passwords do not match');

    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else {
      setMessage('Password updated. Redirecting...');
      setTimeout(() => navigate('/login'), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-6 w-full max-w-md space-y-4">
        <h1 className="text-xl font-semibold">Set a new password</h1>
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        {message && <div className="text-sm text-green-600">{message}</div>}
        <Button type="submit" className="w-full rounded-full">Update password</Button>
      </form>
    </div>
  );
}