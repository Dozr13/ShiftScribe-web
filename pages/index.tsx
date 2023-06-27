import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { DASHBOARD } from '../utils/constants/routes.constants';

const Home: NextPage = () => {
  return (
    <div className='bg-slate-800 flex py-2 container mx-auto'>
      <div className='text-gray-600 border border-gray-400 rounded-md px-12 py-24 mt-24 overflow-y-hidden mx-auto'>
        <div className='flex justify-center pt-12 pb-0'>
          <Image
            className='h-3/6 w-3/6 mt-20'
            src={require('../assets/images/Logo-Full-Transparent.png')}
            alt='Example'
          />
          <Link href={DASHBOARD}>
            <button
              type='button'
              className='bg-blue-800 hover:bg-blue-700 hover:shadow-lg transition text-white px-4 py-2 rounded-md mx-auto'
            >
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
