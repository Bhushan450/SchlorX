import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { Button } from '../../components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function VerifyEmailPage() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const verificationStarted = useRef(false);

  useEffect(() => {
    if (!token || verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    async function verify() {
      try {
        const res = await authService.verifyEmail(token);

        setStatus('success');
        setMessage(
          res?.message || 'Your email address has been verified.'
        );
      } catch (err) {
        console.error('Email verification error:', err);

        setStatus('error');
        setMessage(
          err?.message || 'Email verification link is invalid or expired.'
        );
      }
    }

    verify();
  }, [token]);

  return (
    <div className="text-center space-y-4 py-4">
      {status === 'verifying' && (
        <div className="space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <h2 className="text-lg font-bold text-foreground">Verifying Email...</h2>
          <p className="text-xs text-muted-foreground">Please wait while we validate your token.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Verification Complete</h2>
          <p className="text-xs text-muted-foreground">{message}</p>
          <Link to="/login">
            <Button className="w-full mt-2">Proceed to Login</Button>
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 mx-auto">
            <XCircle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Verification Failed</h2>
          <p className="text-xs text-muted-foreground">{message}</p>
          <Link to="/login">
            <Button variant="outline" className="w-full mt-2">Back to Login</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
