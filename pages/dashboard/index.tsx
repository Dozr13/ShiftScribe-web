import { useRouter } from 'next/router';
import SubmitButton from '../../components/form-components/SubmitButton';
import ProtectedRoute from '../../components/protected-route';
import { useAuth } from '../../context/AuthContext';
import { PermissionLevel } from '../../lib';
import { RECORDS } from '../../utils/constants/routes.constants';

const DashboardPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const onClick = () => {
    router.push(RECORDS);
  };

  return (
    <ProtectedRoute>
      <div className='flex py-2 container mx-auto'>
        <div className='text-gray-600 px-12 py-24 mt-24 overflow-y-hidden mx-auto'>
          <h2 className='text-2xl font-semibold'>You are logged in!</h2>

          {user.permissionLevel >= PermissionLevel.MANAGER && (
            <SubmitButton
              message={'Click Here To View Records'}
              onClick={onClick}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
