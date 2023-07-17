// import {
//   UploadTaskSnapshot,
//   getDownloadURL,
//   ref,
//   uploadBytesResumable,
// } from 'firebase/storage';
// import Image from 'next/image';
// import { useState } from 'react';
// import ImageUploadInput from '../../components/form-components/ImageUploadInput';
// import UploadButton from '../../components/form-components/UploadButton';
// import ProtectedRoute from '../../components/protected-route';
// import { FIREBASE_STORAGE } from '../../lib/Firebase';
// import { showToast } from '../../utils/toast';

// const ImageUploader = () => {
//   const allInputs = { imgUrl: '' };
//   const [imageAsFile, setImageAsFile] = useState<File | string>('');
//   const [imageAsUrl, setImageAsUrl] = useState(allInputs);

//   const handleImageAsFile = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       const image = event.target.files[0];
//       setImageAsFile(image);
//     }
//   };

//   const handleFireBaseUpload = async (
//     event: React.FormEvent<HTMLFormElement>,
//   ) => {
//     event.preventDefault();
//     console.log('start of upload');

//     if (typeof imageAsFile === 'string') {
//       showToast('Please select an image', false);
//       return;
//     }

//     const allowedFileTypes = ['.png', '.jpg', '.jpeg', '.svg'];
//     const fileExtension = imageAsFile.name.substring(
//       imageAsFile.name.lastIndexOf('.'),
//     );

//     if (!allowedFileTypes.includes(fileExtension.toLowerCase())) {
//       const allowedFileTypesString = allowedFileTypes.join(', ');
//       showToast(
//         `Please select a valid image file type: ${allowedFileTypesString}`,
//         false,
//       );
//       return;
//     }

//     try {
//       const fileName = imageAsFile instanceof File ? imageAsFile.name : '';
//       const storageRef = ref(FIREBASE_STORAGE, `/images/${fileName}`);
//       const uploadTask = uploadBytesResumable(storageRef, imageAsFile);
//       console.log('Upload started');

//       uploadTask.on(
//         'state_changed',
//         (snapshot: UploadTaskSnapshot) => {
//           const progress =
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           showToast(`Upload progress: ${progress}%`);
//         },
//         (error) => {
//           showToast(
//             'There was an error during upload, please contact developer',
//           );
//         },
//         () => {
//           showToast('Image upload successful!');

//           getDownloadURL(storageRef)
//             .then((fireBaseUrl) => {
//               setImageAsUrl((prevObject) => ({
//                 ...prevObject,
//                 imgUrl: fireBaseUrl,
//               }));
//             })
//             .catch((error) => {
//               showToast(
//                 'There was an error retrieving the URL, please contact developer',
//               );
//             });
//         },
//       );
//     } catch (error) {
//       showToast(
//         'There was an error uploading the file, please contact developer',
//       );
//     }
//   };

//   return (
//     <ProtectedRoute>
//       <div className='admin-panel flex flex-col justify-center items-center'>
//         <div className='p-10 container flex flex-col justify-center items-center mx-auto w-96 border-2 bg-gray-400 border-gray-400 rounded-md'>
//           <ImageUploadInput onChange={handleImageAsFile} width={'200px'} />
//           {imageAsUrl.imgUrl && (
//             <div className='mt-3 pt-8'>
//               <Image
//                 src={imageAsUrl.imgUrl}
//                 alt='image tag'
//                 width={200}
//                 height={200}
//               />
//             </div>
//           )}
//           <UploadButton
//             message='Upload'
//             onClick={handleFireBaseUpload}
//             width={'200px'}
//           />
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default ImageUploader;

import Image from 'next/image';
import { useState } from 'react';
import UploadButton from '../../components/form-components/UploadButton';
import { showToast } from '../../utils/toast';

const ImageUploader = () => {
  const allInputs = { imgUrl: '' };
  const [imageAsFile, setImageAsFile] = useState<File | string>('');
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);

  const handleImageAsFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const image = event.target.files[0];
      setImageAsFile(image);
    }
  };

  const handleFireBaseUpload = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (typeof imageAsFile === 'string') {
      showToast('Please select an image', false);
      return;
    }

    const formData = new FormData();
    formData.append('image', imageAsFile);
    console.log('formData', formData);

    try {
      const response = await fetch('../api/image-conversion', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        showToast('Image conversion failed', false);
        return;
      }

      const data = await response.json();
      console.log('data', data);
      const convertedImageUrl = data.downloadURL; // Access the downloadURL property

      console.log('convertedImageUrl', convertedImageUrl);
      setImageAsUrl((prevObject) => ({
        ...prevObject,
        imgUrl: convertedImageUrl,
      }));
      showToast('Image conversion successful!');
    } catch (error) {
      console.error('Error during image upload:', error);
      showToast(
        'There was an error uploading the image, please try again later.',
        false,
      );
    }
  };

  return (
    <div>
      <form id='image-upload-form' onSubmit={handleFireBaseUpload}>
        <input type='file' onChange={handleImageAsFile} />
        <UploadButton
          form='image-upload-form'
          type='submit'
          message='Upload'
          width={'200px'}
        />
      </form>
      {imageAsUrl.imgUrl && (
        <Image
          src={imageAsUrl.imgUrl}
          alt='image tag'
          width={200}
          height={200}
        />
      )}
    </div>
  );
};

export default ImageUploader;

// import Image from 'next/image';
// import { useState } from 'react';
// import UploadButton from '../../components/form-components/UploadButton';
// import { showToast } from '../../utils/toast';

// const ImageUploader = () => {
//   const allInputs = { imgUrl: '' };
//   const [imageAsFile, setImageAsFile] = useState<File | string>('');
//   const [imageAsUrl, setImageAsUrl] = useState(allInputs);

//   const handleImageAsFile = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       const image = event.target.files[0];
//       setImageAsFile(image);
//     }
//   };

//   const handleFireBaseUpload = async (
//     event: React.FormEvent<HTMLFormElement>,
//   ) => {
//     event.preventDefault();
//     if (typeof imageAsFile === 'string') {
//       showToast('Please select an image', false);
//       return;
//     }

//     const formData = new FormData();
//     formData.append('image', imageAsFile);

//     try {
//       const response = await fetch('/api/image-conversion', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         showToast('Image conversion failed', false);
//         return;
//       }

//       const data = await response.json();
//       const convertedImageUrl = data.convertedImageUrl;

//       setImageAsUrl((prevObject) => ({
//         ...prevObject,
//         imgUrl: convertedImageUrl,
//       }));
//       showToast('Image conversion successful!');
//     } catch (error) {
//       console.error('Error during image upload:', error);
//       showToast(
//         'There was an error uploading the image, please try again later.',
//         false,
//       );
//     }
//   };

//   return (
//     <div>
//       <form id='image-upload-form' onSubmit={handleFireBaseUpload}>
//         <input type='file' onChange={handleImageAsFile} />
//         <UploadButton
//           form='image-upload-form'
//           type='submit'
//           message='Upload'
//           width={'200px'}
//         />
//       </form>
//       {imageAsUrl.imgUrl && <Image src={imageAsUrl.imgUrl} alt='image tag' />}
//     </div>
//   );
// };

// export default ImageUploader;
