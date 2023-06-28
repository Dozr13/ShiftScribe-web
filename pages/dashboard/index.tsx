import { useRouter } from 'next/router';
import SubmitButton from '../../components/form-components/SubmitButton';
import ProtectedRoute from '../../components/protected-route';
import { useAuth } from '../../context/AuthContext';
import { PermissionLevel } from '../../lib';
import { RECORDS } from '../../utils/constants/routes.constants';

const DashboardPage = () => {
  const auth = useAuth();
  const router = useRouter();

  const onClick = () => {
    router.push(RECORDS);
  };

  return (
    <ProtectedRoute>
      <div className='flex py-2 container mx-auto'>
        <div className='text-gray-600 flex flex-col justify-center items-center px-12 py-24 mx-auto'>
          <p className='text-2xl text-white font-semibold'>{`Welcome ${auth.user?.displayName}`}</p>

          {auth.permissionLevel >= PermissionLevel.MANAGER && (
            <SubmitButton
              message={'Click Here To Manage Records'}
              onClick={onClick}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
