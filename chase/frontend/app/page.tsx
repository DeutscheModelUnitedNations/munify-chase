'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { useBackend } from '@/contexts/backend';
import { useAuth } from 'oidc-react';
import dynamic from 'next/dynamic';

export default function Home() {
  const router = useRouter();
  const auth = useAuth();
  const backend = useBackend();

  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (typeof window === 'undefined') return;
        await backend.getApiAuthStatus();
        setAuthenticated(true);
        console.log('success');
      } catch (error) {
        setAuthenticated(false);
        console.log('fail');
      }
    })();
  }, []);

  return (
    <>
      <div className="flex align-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/logo/png/chase_logo_blue_text.png"
            alt="Logo"
            width={700}
            height={128}
            className="mb-10"
          />
          <div className="p-buttonset mb-2">
            <Button
              label="Teilnehmenden-Login"
              icon="pi pi-link"
              onClick={() => router.push('/login/participant')}
            />
            <Button
              label="Vorsitz-Login"
              icon="pi pi-link"
              onClick={() => router.push('/login/chair')}
            />
          </div>
          <span>
            Authenticated:
            {authenticated && ' Logged in'}
            {!authenticated && ' Logged out'}
          </span>
          <div className="p-buttonset">
            <Button label="Keycloak login" icon="pi pi-link" onClick={() => auth.signIn()} />
            <Button label="Keycloak logout" icon="pi pi-link" onClick={() => auth.signOut()} />
          </div>
        </div>
      </div>
    </>
  );
}
