// import { ChangeEvent } from 'react';
// import { StringUtils } from '../../lib';
// import { EventObject } from '../../types/data';

// interface CheckboxProps {
//   label: string;
//   checked: boolean;
//   jobs?: EventObject[];
//   dateRequest: number;
//   inRequest: number;
//   outRequest: number;
//   onChange: (checked: boolean) => void;
// }

// const Checkbox = ({
//   label,
//   checked,
//   jobs,
//   dateRequest,
//   inRequest,
//   outRequest,
//   onChange,
// }: CheckboxProps) => {
//   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
//     event.stopPropagation();
//     onChange(event.target.checked);
//   };

//   const uniqueJobs = new Set(jobs?.map((j) => j.job));

//   return (
//     <div className='border-b-2'>
//       <div className='grid grid-cols-5 my-4'>
//         <div className='flex items-center'>
//           <input
//             type='checkbox'
//             checked={checked ?? false}
//             onChange={handleChange}
//             className='form-checkbox h-6 w-6 text-red-600 rounded-full focus:ring-0 focus:outline-none mx-auto my-auto'
//           />
//         </div>
//         <div className='col-span-1 flex flex-col justify-center'>
//           <span className='m-2 text-gray-800'>{label}</span>
//         </div>
//         <div className='col-span-2 flex flex-col justify-center'>
//           <div className='text-gray-600'>
//             Date: {StringUtils.timestampToMMDDYYYY(dateRequest)}
//           </div>
//           {jobs && jobs.length > 0 && (
//             <div className='col-span-2 flex flex-col justify-center group relative'>
//               <div className='text-gray-600'>
//                 Job:{' '}
//                 {[...uniqueJobs].length > 1
//                   ? [...uniqueJobs][0] + ' ...'
//                   : [...uniqueJobs][0]}
//               </div>

//               <div className='absolute left-0 mt-2 w-56 invisible group-hover:visible'>
//                 <div className='bg-white border border-gray-300 rounded shadow-md p-4'>
//                   {[...uniqueJobs].map((jobName, index) => (
//                     <div key={index}>{jobName}</div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//         <div className='col-span-1 flex flex-col w-40'>
//           <div className='text-gray-600'>
//             In: {StringUtils.timestampToHHMM(inRequest)}
//           </div>
//           <div className='text-gray-600'>
//             Out: {StringUtils.timestampToHHMM(outRequest)}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkbox;
