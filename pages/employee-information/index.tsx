import { useCallback, useEffect, useRef, useState } from 'react';
import EmployeeListItem, { Employee } from '../../components/employee-list';
import AccessLevelKey from '../../components/information-keys/AccessLevelKey';
import ProtectedRoute from '../../components/protected-route';
import { useAuth } from '../../context/AuthContext';
import { useFirebase } from '../../context/FirebaseContext';
import { RequestThrottle } from '../../lib';
import LoadingScreen from '../loading';

const throttle = new RequestThrottle(3, 10);

const EmployeeInformationPage = () => {
  const auth = useAuth();
  const db = useFirebase();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAccessKey, setShowAccessKey] = useState(false);

  const questionButtonRef = useRef<HTMLButtonElement | null>(null);

  const accessKeyRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        showAccessKey &&
        accessKeyRef.current &&
        !accessKeyRef.current.contains(event.target as Node) &&
        questionButtonRef.current !== event.target
      ) {
        setShowAccessKey(false);
      }
    },
    [showAccessKey],
  );

  useEffect(() => {
    if (showAccessKey) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showAccessKey, handleClickOutside]);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!auth.orgId) return;

      setLoading(true);

      const snapshot = await db.read(`orgs/${auth.orgId}/members`);
      // console.log('SNAPSHOT', snapshot);
      if (snapshot.exists()) {
        const membersData = snapshot.val();
        const memberIds = Object.keys(membersData);

        const employeesArray = await Promise.all(
          memberIds.map(async (memberId) => {
            const memberData = membersData[memberId];
            const userSnapshot = await db.read(`users/${memberId}`);
            const userData = userSnapshot.val();

            return {
              id: memberId,
              ...memberData,
              userData,
            };
          }),
        );

        setEmployees(employeesArray);
      }

      setLoading(false);
    };

    fetchEmployees();
  }, [auth.orgId, db]);

  const handleDelete = async (id: string) => {
    await db.update(`orgs/${auth.orgId}/members`, {
      [id]: null,
    });
  };

  return (
    <ProtectedRoute>
      {loading && <LoadingScreen />}
      <div className='employee-information relative'>
        <div className='flex flex-col items-center'>
          <div className='text-3xl text-gray-300 font-extrabold p-10'>
            Employee Information
          </div>
          <div className='p-5 container border-2 bg-gray-400 border-gray-400 rounded-md overflow-y-scroll overflow-x-hidden h-[50vh] w-[70vw]'>
            <div className='flex justify-evenly mb-2'>
              <div className='w-[20%] text-gray-800 font-bold text-xl p-5'>
                Name
              </div>
              <div className='w-[20%] text-gray-800 font-bold text-xl p-5'>
                Email
              </div>
              <div className='w-[20%] text-gray-800 font-bold text-xl p-5'>
                Organization
              </div>
              <div className='relative flex flex-row w-[20%] text-gray-800 font-bold text-xl p-5'>
                Access Level
                <button
                  className='ml-2 w-6 h-6 bg-gray-300 rounded-full text-gray-700 font-bold flex items-center justify-center'
                  onClick={() => setShowAccessKey(!showAccessKey)}
                  ref={questionButtonRef}
                >
                  ?
                </button>
              </div>
              <div className='w-[20%]'></div>
            </div>
            {employees.map((employee) => (
              <EmployeeListItem
                key={employee.id}
                employee={employee}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>
      {showAccessKey && (
        <div
          className='absolute top-20 left-0 w-[100%]'
          ref={accessKeyRef}
          onClick={() => setShowAccessKey(false)}
        >
          <AccessLevelKey />
        </div>
      )}
    </ProtectedRoute>
  );
};

export default EmployeeInformationPage;
