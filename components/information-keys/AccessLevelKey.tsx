const AccessLevelKey = () => (
  <div
    className='bg-gradient-to-r from-blue-500 to-purple-600 p-5 rounded-xl shadow-lg flex flex-col items-start justify-end w-1/4'
    onClick={(e) => e.stopPropagation()}
  >
    <h3 className='text-2xl font-extrabold mb-4 text-white'>
      Access Level Key:
    </h3>
    <ul className='list-none'>
      <li className='mb-2 text-white'>
        <strong>0:</strong> <strong className='underline'>Unverified</strong> -
        Pending verification or onboarding
      </li>
      <li className='mb-2 text-white'>
        <strong>1:</strong> <strong className='underline'>User</strong> - Basic
        access to view data
      </li>
      <li className='mb-2 text-white'>
        <strong>2:</strong> <strong className='underline'>Manager</strong> - Can
        view, modify, and possibly add data
      </li>
      <li className='mb-2 text-white'>
        <strong>3:</strong> <strong className='underline'>Admin</strong> -
        Higher privileges, may manage certain users or modules
      </li>
      <li className='text-white'>
        <strong>4:</strong> <strong className='underline'>Superuser</strong> -
        Highest level, full control over the system including user management,
        as well as web access
      </li>
    </ul>
  </div>
);

export default AccessLevelKey;
