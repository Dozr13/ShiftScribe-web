import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { LOGIN } from '../utils/constants/routes.constants';

const Home: NextPage = () => {
  return (
    <div className='flex py-2 container mx-auto'>
      <div className='text-gray-600 border border-gray-400 flex justify-center items-center rounded-md px-12 py-24 mt-24 overflow-y-hidden'>
        <div className='flex flex-col justify-center items-center pb-0'>
          <Image
            className='h-3/6 w-3/6 rounded-md'
            src={require('../assets/images/Logo-Official.png')}
            alt='Example'
          />
          <Link href={LOGIN}>
            <button
              type='button'
              className='bg-blue-800 hover:bg-blue-700 hover:shadow-lg transition h-fit text-white  px-8 py-4 rounded-md mt-5'
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
