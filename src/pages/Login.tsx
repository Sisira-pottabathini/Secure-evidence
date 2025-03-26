
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const { login, user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleLogin = async (data: any) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <AuthForm type="login" onSubmit={handleLogin} />
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p className="mb-2">Test Accounts:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="rounded-md bg-secondary/50 p-2">
              <p className="font-semibold">Manager</p>
              <p>manager@example.com</p>
              <p>password</p>
            </div>
            <div className="rounded-md bg-secondary/50 p-2">
              <p className="font-semibold">Staff</p>
              <p>staff@example.com</p>
              <p>password</p>
            </div>
            <div className="rounded-md bg-secondary/50 p-2">
              <p className="font-semibold">User</p>
              <p>user@example.com</p>
              <p>password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
