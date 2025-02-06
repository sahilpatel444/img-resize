/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { FiUpload } from "react-icons/fi";
// import { Prompt } from "react-router-dom";

const ImgToPdf = () => {
  const [files, setFiles] = useState([]);

  const [filePreviews, setFilePreviews] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setFilePreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
    setFilePreviews(droppedFiles.map((file) => URL.createObjectURL(file)));
  };

  const generatePDF = () => {
    if (files.length === 0) return;
    const pdf = new jsPDF();

    files.forEach((file, index) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        let imgWidth = img.width;
        let imgHeight = img.height;

        // Scale image to fit within the PDF while maintaining aspect ratio
        const scaleFactor = Math.min(
          pdfWidth / imgWidth,
          pdfHeight / imgHeight
        );
        imgWidth *= scaleFactor;
        imgHeight *= scaleFactor;

        if (index > 0) pdf.addPage();
        pdf.addImage(
          img,
          "JPEG",
          (pdfWidth - imgWidth) / 2,
          (pdfHeight - imgHeight) / 2,
          imgWidth,
          imgHeight
        );

        if (index === files.length - 1) {
          pdf.save("converted.pdf");
        }
      };
    });
  };
  const clearStorage = () => {
    localStorage.removeItem("uploadedFiles");
    setFiles([]);
    setFilePreviews([]);
  };

  console.log(files, "upload file");

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Convert Images to PDF</h2>
      <p>Support All Images & Multiple Img </p>
      <div className="flex justify-center items-center">
        {files.length === 0 ? (
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-90 h-60 border-2 border-dashed border-gray-300 rounded-xl shadow-lg cursor-pointer hover:bg-gray-100"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center p-5">
              <FiUpload className="text-5xl text-blue-500 mb-3" />
              <span className="text-gray-600 text-lg font-semibold">
                Upload Images
              </span>
              <span className="text-gray-400 text-sm mt-1">
                or, drag and drop images here
              </span>
            </div>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="text-center">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {filePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt="Preview"
                  className="w-32 h-auto rounded"
                />
              ))}
            </div>
            <button
              onClick={generatePDF}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Download PDF
            </button>
            <button
              onClick={clearStorage}
              className="mt-4 ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            >
              Clear Storage
            </button>
            {/* Prevent navigation when a file is uploaded */}
            {/* <Prompt
              when={files}
              message="You have unsaved changes. Are you sure you want to leave?"
            />

            <button onClick={() => setFiles(false)}>Reset Upload</button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImgToPdf;
