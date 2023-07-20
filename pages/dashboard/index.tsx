import { useRouter } from 'next/router';
import SubmitButton from '../../components/form-components/SubmitButton';
import ProtectedRoute from '../../components/protected-route';
import { useAuth } from '../../context/AuthContext';
import { PermissionLevel } from '../../lib';
import {
  EMPLOYEE_LIST,
  JOB_LIST,
  LOGIN,
  RECORDS,
  REQUESTS,
} from '../../utils/constants/routes.constants';
import { showToast } from '../../utils/toast';

const DashboardPage = () => {
  const auth = useAuth();
  const router = useRouter();

  const onClickManageRecords = () => {
    router.push(RECORDS);
  };

  const onClickViewRequests = () => {
    router.push(REQUESTS);
  };

  const onClickJobInformation = () => {
    router.push(JOB_LIST);
  };

  const onClickEmployeeInformation = () => {
    router.push(EMPLOYEE_LIST);
  };

  const handleLogout = async () => {
    showToast('Logging out...');
    try {
      await auth.signOut();
      showToast('You are now logged out');
      router.push(LOGIN);
    } catch (error: any) {
      showToast(error.message, false);
    }
  };

  return (
    <ProtectedRoute>
      <div className='flex py-2 container mx-auto'>
        <div className='text-gray-600 flex flex-col justify-center items-center px-12 py-24 mx-auto'>
          <p className='text-5xl h-20 absolute top-[30vh] text-white font-semibold border-double border-b-4 bor'>{`Welcome ${auth.user?.displayName}`}</p>

          {auth.permissionLevel >= PermissionLevel.MANAGER ? (
            <div className='grid grid-cols-2 gap-y-4 gap-x-10'>
              <div className='mb-4'>
                <SubmitButton
                  message={'Manage Records'}
                  onClick={onClickManageRecords}
                />
              </div>
              <div className='mb-4'>
                <SubmitButton
                  message={'View Requests'}
                  onClick={onClickViewRequests}
                />
              </div>
              <div className='mb-4'>
                <SubmitButton
                  message={'Edit Jobs'}
                  onClick={onClickJobInformation}
                />
              </div>
              <div className='mb-4'>
                <SubmitButton
                  message={'View Employees'}
                  onClick={onClickEmployeeInformation}
                />
              </div>
            </div>
          ) : (
            <>
              <p className='text-2xl text-white font-semibold'>
                Unable to access this page without proper permissions
              </p>
              <SubmitButton
                message={'Click Here To Logout'}
                onClick={handleLogout}
              />
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
