import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { FiUpload } from "react-icons/fi";
import { Slider } from "@mui/material";

const CropImg = () => {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [originalSize, setOriginalSize] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const inputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setOriginalSize((selectedFile.size / 1024).toFixed(2)); // Convert bytes to KB
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  // Crop area change
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Function to crop the image
  const getCroppedImg = (imageSrc, croppedAreaPixels) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          resolve(URL.createObjectURL(blob));
        }, "image/png");
      };
      image.onerror = (error) => reject(error);
    });
  };

  // Generate cropped image
  const generateCroppedImage = async () => {
    if (!filePreview || !croppedAreaPixels) return;
    try {
      const croppedImg = await getCroppedImg(filePreview, croppedAreaPixels);
      setCroppedImage(croppedImg);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  // Download cropped image
  const handleDownload = () => {
    if (!croppedImage) return;
    const link = document.createElement("a");
    link.href = croppedImage;
    link.download = "cropped_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-lg mx-auto p-4 font-sans">
      <h2 className="text-xl font-bold mb-4 text-center">Crop Image</h2>

      {/* File Upload */}
      <div className="flex justify-center items-center">
        {!file ? (
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full sm:w-90 h-60 border-2 border-dashed border-gray-300 rounded-xl shadow-lg cursor-pointer hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center p-5">
              <FiUpload className="text-5xl text-blue-500 mb-3" />
              <span className="text-gray-600 text-lg font-semibold">
                Upload Image
              </span>
              <span className="text-gray-400 text-sm mt-1">
                Drag and drop an image here
              </span>
            </div>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              ref={inputRef}
            />
          </label>
        ) : (
          <div className="w-full">
            <div className="relative w-full h-[60vw] max-h-80 bg-gray-200 rounded-md">
              <Cropper
                image={filePreview}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Zoom Slider */}
            <div className="w-full mt-4 px-4">
              <p className="text-center text-sm text-gray-600">Zoom</p>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e, newValue) => setZoom(newValue)}
                aria-labelledby="zoom-slider"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow w-full sm:w-auto"
                onClick={generateCroppedImage}
              >
                Crop Image
              </button>
              <button
                className={`bg-green-500 text-white px-4 py-2 rounded-lg shadow w-full sm:w-auto ${
                  !croppedImage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleDownload}
                disabled={!croppedImage}
              >
                Download
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Display Original Size */}
      {originalSize && (
        <p className="mt-4 text-center text-gray-600">
          Original Size: <strong>{originalSize}</strong> KB
        </p>
      )}

      {/* Display Cropped Image */}
      {croppedImage && (
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold">Cropped Image:</h3>
          <img
            src={croppedImage}
            alt="Cropped Preview"
            className="mt-2 w-48 h-auto rounded-lg shadow-md mx-auto"
          />
        </div>
      )}
    </div>
  );
};

export default CropImg;
