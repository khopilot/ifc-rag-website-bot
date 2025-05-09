'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { register, type RegisterActionState } from '../actions';
import { toast } from '@/components/toast';
import { useSession } from 'next-auth/react';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: 'idle',
    },
  );

  const { update: updateSession } = useSession();

  useEffect(() => {
    if (state.status === 'user_exists') {
      toast({ type: 'error', description: 'Account already exists!' });
    } else if (state.status === 'failed') {
      toast({ type: 'error', description: 'Failed to create account!' });
    } else if (state.status === 'invalid_data') {
      toast({
        type: 'error',
        description: 'Failed validating your submission!',
      });
    } else if (state.status === 'success') {
      toast({ type: 'success', description: 'Account created successfully!' });

      setIsSuccessful(true);
      updateSession();
      router.refresh();
    }
  }, [state]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 -z-10" />

      <div className="w-full max-w-5xl md:flex rounded-xl shadow-2xl overflow-hidden bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg">
        {/* Auth section */}
        <div className="w-full md:w-1/2 flex flex-col gap-10 p-8 sm:p-12">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <Image
              src="/images/logo-ifc.png"
              alt="Logo Institut français du Cambodge"
              width={64}
              height={64}
              priority
              className="mb-2"
            />
            <h3 className="text-2xl font-semibold text-blue-800 dark:text-zinc-100">Création de compte</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 max-w-sm">
              Inscrivez-vous pour rejoindre la communauté de l&rsquo;IFC et profiter pleinement des services de Sreyka.
            </p>
          </div>
          <AuthForm action={handleSubmit} defaultEmail={email}>
            <SubmitButton isSuccessful={isSuccessful}>S&rsquo;inscrire</SubmitButton>
            <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
              Vous avez déjà un compte ?{' '}
              <Link
                href="/login"
                className="font-semibold text-blue-800 hover:underline dark:text-blue-300"
              >
                Connectez-vous
              </Link>
            </p>

            <p className="text-center text-xs text-gray-500 mt-2 dark:text-zinc-500">
              Sreyka&nbsp;– IFC&nbsp;AI Concierge&nbsp;· Powered by Angkor&nbsp;Intelligence
            </p>
          </AuthForm>
        </div>

        {/* Media section */}
        <div className="hidden md:block md:w-1/2 relative bg-zinc-800/80">
          <Image src="/images/mouth of the seine, monet.jpg" fill priority alt="IFC" className="object-cover" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-4 left-4 right-4 flex gap-3">
            {[
              '/images/photo-1531538512164-e6c51ea63d20.jpeg',
              '/images/mouth of the seine, monet.jpg',
              '/images/DELF-icon_600x450a.jpg',
            ].map((src) => (
              <Image key={src} src={src} alt="thumb" width={80} height={60} className="object-cover rounded-md border" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
