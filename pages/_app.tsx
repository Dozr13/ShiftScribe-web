import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import toast, { Toaster, useToasterStore } from 'react-hot-toast';
import Header from '../components/header';
import { AuthContextProvider } from '../context/AuthContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const { toasts } = useToasterStore();
  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= 1) // Is toast index over limit
      .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) removal without animation
  }, [toasts]);
  return (
    <>
      <Toaster position='bottom-right' reverseOrder={false} />
      <AuthContextProvider>
        <Header>
          <div
            className='h-screen w-screen'
            style={{ backgroundColor: '#262626' }}
          >
            <Component {...pageProps} />
          </div>
        </Header>
      </AuthContextProvider>
    </>
  );
}

export default MyApp;
