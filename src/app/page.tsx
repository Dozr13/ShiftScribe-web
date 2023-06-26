'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import RootLayout from './layout';

export default function Home() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className='bg-slate-800 flex min-h-screen flex-col items-center justify-center p-24'>
      <div className='bg-slate-400 h-80 w-80 flex flex-col justify-end rounded-md'>
        <h3 className='self-center text-3xl m-5 text-black'>Welcome Admin</h3>
        <input
          className='m-5 p-3 h-10 rounded-md'
          placeholder='Email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className='m-5 p-3 h-10 rounded-md'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type='password'
        />
        <button
          className='bg-sky-500 m-5 h-10 rounded-md'
          onClick={() => signIn(email, password)}
        >
          Sign In
        </button>
      </div>
      <Image
        className='h-2/6 w-2/6 mt-20'
        src={require('../assets/images/Logo-Full-Transparent.png')}
        alt='Example'
      />
    </main>
  );
}

Home.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};
