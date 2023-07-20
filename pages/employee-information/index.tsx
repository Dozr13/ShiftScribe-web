import { useEffect, useState } from 'react';
import EmployeeListItem, { Employee } from '../../components/employee-list';
import ProtectedRoute from '../../components/protected-route';
import { useAuth } from '../../context/AuthContext';
import { useFirebase } from '../../context/FirebaseContext';
import { RequestThrottle } from '../../lib';

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/g;
const throttle = new RequestThrottle(3, 10);

const EmployeeInformationPage = () => {
  const auth = useAuth();
  const db = useFirebase();
  // const [isValidEmail, setIsValidEmail] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  // const [employeeName, setEmployeeName] = useState('');
  // const [employeeEmail, setEmployeeEmail] = useState('');
  // const [employeeOrg, setEmployeeOrg] = useState(auth.orgId);
  // const [employeeAccessLevel, setEmployeeAccessLevel] = useState<string>('1');

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!auth.orgId) return;

      setLoading(true);

      const snapshot = await db.read(`orgs/${auth.orgId}/members`);
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
  }, [auth.orgId, db, employees]);

  // useEffect(() => {
  //   setIsValidEmail(
  //     employeeEmail.trim() === ''
  //       ? true
  //       : employeeEmail.match(emailRegex) !== null,
  //   );
  // }, [employeeEmail]);

  // useEffect(() => {
  //   if (!/^[1-4]$/.test(employeeAccessLevel)) {
  //     showToast(
  //       'Invalid Access Level. Please enter a number between 1 and 4.',
  //       false,
  //     );
  //   }
  // }, [employeeAccessLevel]);

  // TODO: Figure out if this is possible
  // async function attemptSubmit() {
  //   if (!auth.orgId) return;

  //   const tempPass = '123456';

  //   if (employeeName.trim() === '')
  //     return showToast('Employee name must not be empty', false);
  //   if (employeeEmail.trim() === '')
  //     return showToast('Employee email must not be empty', false);

  //   await throttle
  //     .tryAsync(async () => {
  //       setLoading(true);

  //       const pack = [employeeOrg, employeeName, employeeEmail, tempPass];
  //       const keys = ['Organization', 'Username', 'Email', 'Password'];

  //       // Ensure that all fields are populated.
  //       for (let i = 0; i < pack.length; i++) {
  //         if (pack[i].trim() === '') {
  //           showToast(`Issue ${keys[i]} Cannot be Empty.`);
  //           return;
  //         }
  //       }

  //       // Validate Email
  //       if (employeeEmail.match(emailRegex) === null)
  //         return showToast('Invalid Email, Please Enter a valid Email.', false);

  //       // Attempt signup and provide helpful errors.
  //       const res = await auth.createuser(
  //         employeeName,
  //         employeeEmail,
  //         tempPass,
  //         employeeOrg,
  //       );

  //       if (res.success) {
  //         // User created successfully, show success toast or any additional actions needed.
  //         showToast('User created successfully.', true);
  //       } else {
  //         // Error occurred during user creation, show appropriate error toast.
  //         switch (res.error) {
  //           case 'EmailInUse':
  //           case 'UserExists':
  //             showToast(
  //               'User Already Exists, a user with this email already exists. Please log in instead.',
  //               false,
  //             );
  //             break;

  //           case 'OrgNotValid':
  //             showToast(
  //               'Invalid Organization, please enter a valid organization.',
  //               false,
  //             );
  //             break;

  //           case 'PermissionDenied':
  //             showToast(
  //               'Permission Denied, you do not have permission to create a user.',
  //               false,
  //             );
  //             break;

  //           default:
  //             showToast(
  //               'Internal Issue, an issue occurred when creating your account.',
  //               false,
  //             );
  //         }
  //       }
  //     })
  //     .then(() => setLoading(false))
  //     .catch(console.warn);

  //   setEmployeeName('');
  //   setEmployeeEmail('');
  //   setEmployeeOrg(auth.orgId);
  //   setEmployeeAccessLevel('1');
  //   setLoading(false);
  // }

  const handleDelete = async (id: string) => {
    await db.update(`orgs/${auth.orgId}/members`, {
      [id]: null,
    });
  };

  return (
    <ProtectedRoute>
      <div className='employee-information'>
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
              <div className='w-[20%] text-gray-800 font-bold text-xl p-5'>
                Access Level
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
          {/* <div className='p-8 container border-2 bg-gray-400 border-gray-400 rounded-md mt-4'>
            <div className='flex justify-around items-start'>
              <StyledInput
                label='Employee Name: '
                type='text'
                value={employeeName}
                onChange={setEmployeeName}
                flex
              />
              <StyledInput
                label='Employee Email: '
                type='text'
                value={employeeEmail}
                onChange={setEmployeeEmail}
                flex
              />
              <StyledInput
                label='Employee Organization: '
                type='text'
                value={employeeOrg}
                onChange={setEmployeeOrg}
                disabled={true}
                flex
              />
              <StyledInput
                label='Employee Access Level: '
                type='text'
                value={employeeAccessLevel}
                onChange={setEmployeeAccessLevel}
                flex
              />
            </div>
          </div>
          <SubmitButton message={'Add Employee'} onClick={attemptSubmit} /> */}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EmployeeInformationPage;
