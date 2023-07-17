'use-client';

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import { FIREBASE_STORAGE } from '../../lib/Firebase';

export default async function imageConversionHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    // Read the uploaded image file from the request body
    const imageBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on('data', (chunk: Buffer) => chunks.push(chunk));
      req.on('end', () => {
        const imageBuffer = Buffer.concat(chunks);
        console.log('Received image buffer:', imageBuffer);
        resolve(imageBuffer);
      });
      req.on('error', (error) => {
        console.error('Error reading image buffer:', error);
        reject(error);
      });
    });

    // Perform the image conversion using sharp
    console.log('Starting image conversion...');
    const convertedImageBuffer = await sharp(imageBuffer)
      .resize(500) // Example transformation: Resize the image to a width of 500 pixels
      .toBuffer();

    console.log('Image conversion completed.');

    // Save the converted image to Firebase Storage
    const storageRef = ref(FIREBASE_STORAGE, '/images/converted-image.jpg');
    await uploadBytes(storageRef, convertedImageBuffer);

    // Generate a unique URL for the converted image
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Download URL:', downloadURL); // Log the download URL

    // Store the URL in your Firebase Realtime Database or send it back to the client
    // For demonstration purposes, we'll send the URL back to the client
    res.status(200).json({ downloadURL });
  } catch (error) {
    console.error('Error during image conversion:', error);
    res.status(500).json({ message: 'Image conversion failed' });
  }
}
