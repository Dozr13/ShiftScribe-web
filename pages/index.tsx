import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { DASHBOARD, LOGIN } from '../utils/constants/routes.constants';

const Home: NextPage = () => {
  const auth = useAuth();

  return (
    <div className='flex flex-col py-24 container mx-auto text-gray-600 border border-gray-400 justify-center items-center rounded-md px-12'>
      <Image
        className='h-3/6 w-3/6 rounded-md'
        src={require('../assets/images/Logo-Official.png')}
        alt='Example'
      />
      <Link href={auth.user ? DASHBOARD : LOGIN}>
        <button
          type='button'
          className='bg-blue-800 hover:bg-blue-700 hover:shadow-lg transition h-fit text-white  px-8 py-4 rounded-md mt-20'
        >
          {auth.user ? 'Go to Dashboard' : 'Go to Login'}
        </button>
      </Link>
    </div>
  );
};

export default Home;
