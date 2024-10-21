"use client";

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { saveAs } from 'file-saver';

const Home = () => {
  const [uploadedImageURL, setUploadedImageURL] = useState<string>(''); // To display uploaded image immediately
  const [bgRemovedURL, setBgRemovedURL] = useState<string>(''); // Background removed image
  const canvasRefUploaded = useRef<HTMLCanvasElement | any>(null);
  const canvasRefBgRemoved = useRef<HTMLCanvasElement | any>(null);

  // Function to handle image upload and immediate preview
  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];

    if (!file) return;

    // Create a temporary URL to show the image immediately
    const localImageURL = URL.createObjectURL(file);
    setUploadedImageURL(localImageURL);

    const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME || "";
    const cloudUploadPreset = process.env.NEXT_PUBLIC_CLOUD_UPLOAD_PRESET || "";

    // Create form data for Cloudinary upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudUploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data?.error) return alert(data.error.message);

      const bgRemovedImageURL = `https://res.cloudinary.com/daadydi5p/image/upload/e_bgremoval,c_scale/${data.public_id}.${data.format}`;

      setBgRemovedURL(bgRemovedImageURL);

    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  // Drawing the uploaded image onto the canvas
  useEffect(() => {
    if (uploadedImageURL && canvasRefUploaded.current) {
      const img = new Image();
      img.src = uploadedImageURL;
      img.onload = function () {
        const canvas = canvasRefUploaded.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) {
          // Get canvas dimensions
          const canvasWidth = 288; // Adjust width for preview (18rem)
          const canvasHeight = 240; // Adjust height for preview (15rem)

          // Set canvas dimensions
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;

          // Get image dimensions and calculate the aspect ratio
          const imgAspectRatio = img.width / img.height;
          const canvasAspectRatio = canvasWidth / canvasHeight;

          let drawWidth, drawHeight;
          let offsetX = 0, offsetY = 0;

          // Determine the size of the image to draw on the canvas
          if (imgAspectRatio > canvasAspectRatio) {
            drawWidth = canvasWidth;
            drawHeight = canvasWidth / imgAspectRatio;
            offsetY = (canvasHeight - drawHeight) / 2;
          } else {
            drawHeight = canvasHeight;
            drawWidth = canvasHeight * imgAspectRatio;
            offsetX = (canvasWidth - drawWidth) / 2;
          }

          // Clear the canvas and draw the image
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
      };
    }
  }, [uploadedImageURL]);

  // Drawing the background removed image onto the canvas
  useEffect(() => {
    if (bgRemovedURL && canvasRefBgRemoved.current) {
      const img = new Image();
      img.src = bgRemovedURL;
      img.onload = function () {
        const canvas = canvasRefBgRemoved.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) {
          // Set canvas dimensions same as the uploaded canvas
          const canvasWidth = 288; 
          const canvasHeight = 240; 
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;

          // Get image dimensions and calculate aspect ratio
          const imgAspectRatio = img.width / img.height;
          const canvasAspectRatio = canvasWidth / canvasHeight;

          let drawWidth, drawHeight;
          let offsetX = 0, offsetY = 0;

          if (imgAspectRatio > canvasAspectRatio) {
            drawWidth = canvasWidth;
            drawHeight = canvasWidth / imgAspectRatio;
            offsetY = (canvasHeight - drawHeight) / 2;
          } else {
            drawHeight = canvasHeight;
            drawWidth = canvasHeight * imgAspectRatio;
            offsetX = (canvasWidth - drawWidth) / 2;
          }

          // Clear and draw image on canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
      };
    }
  }, [bgRemovedURL]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Image Background Remover</h1>

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-6 p-3 w-full text-sm text-gray-700 border border-gray-300 rounded-lg"
        />

        {uploadedImageURL && (
          <div className="flex justify-between mt-6 gap-10">
            {/* Uploaded Image Preview */}
            <div className="flex flex-col items-center w-full">
              <h2 className="text-lg font-semibold mb-2 text-gray-700">Uploaded Image</h2>
              <div className="w-72 h-60 border-2 border-blue-300 rounded-lg shadow overflow-hidden">
                <canvas ref={canvasRefUploaded} className="object-contain" onContextMenu={(e) => e.preventDefault()} />
              </div>
            </div>

            {/* Background Removed Image Preview */}
            <div className="flex flex-col items-center w-full">
              <h2 className="text-lg font-semibold mb-2 text-gray-700">Background Removed</h2>
              <div className="w-72 h-60 border-2 border-green-300 rounded-lg shadow overflow-hidden">
                <canvas ref={canvasRefBgRemoved} className="object-contain" onContextMenu={(e) => e.preventDefault()} />
              </div>

              {bgRemovedURL && (
                <>
                <p>{canvasRefBgRemoved.current.height}×{canvasRefBgRemoved.current.width}</p>
                <button
                  onClick={() => saveAs(bgRemovedURL, 'bg-removed-image.png')}
                  className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                  Download BG Removed Image
                </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;