/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import * as pdfjs from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url"; // Import worker

import { FiUpload, FiDownload, FiTrash2 } from "react-icons/fi";

// ✅ Correct way to load the PDF.js worker in Vite
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const PdfToImg = () => {
  const [pdfPages, setPdfPages] = useState([]);
  const [pdfName, setPdfName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    if (!file) {
      console.log("No file selected!");
      return;
    }

    setPdfName(file.name);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async (event) => {
      const pdfData = new Uint8Array(event.target.result);
      const pdf = await pdfjs.getDocument({ data: pdfData }).promise;

      const images = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 2;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        images.push(canvas.toDataURL("image/png"));
      }

      setPdfPages(images);
      setLoading(false);
    };
  };

  const downloadImage = (src, index) => {
    const link = document.createElement("a");
    link.href = src;
    link.download = `${pdfName.replace(".pdf", "")}_page_${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = () => {
    pdfPages.forEach((src, index) => {
      setTimeout(() => downloadImage(src, index), index * 500);
    });
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Convert PDF to Images</h2>

      <div className="flex justify-center items-center">
        {pdfPages.length === 0 ? (
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-90 h-60 border-2 border-dashed border-gray-300 rounded-xl shadow-lg cursor-pointer hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center p-5">
              <FiUpload className="text-5xl text-blue-500 mb-3" />
              <span className="text-gray-600 text-lg font-semibold">
                Upload PDF
              </span>
              <span className="text-gray-400 text-sm mt-1">
                or, drag and drop a PDF here
              </span>
            </div>
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {/* page loader in background blur */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center  bg-opacity-50 z-50 ">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-white mt-4 font-medium">
                    Upload Pdf...
                    <br />
                    Please Waite
                  </span>
                </div>
              </div>
            )}
          </label>
        ) : (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">File: {pdfName}</h3>
            <p className="text-gray-600 mb-4">Total Pages: {pdfPages.length}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={downloadAllImages}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 hover:bg-blue-700"
              >
                <FiDownload />
                Download All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {pdfPages.map((src, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img
                    src={src}
                    alt={`Page ${index + 1}`}
                    className="w-70 h-auto rounded shadow-md"
                  />
                  <button
                    onClick={() => downloadImage(src, index)}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded flex items-center gap-2 hover:bg-green-700"
                  >
                    <FiDownload />
                    Download Page {index + 1}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={downloadAllImages}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 hover:bg-blue-700"
              >
                <FiDownload />
                Download All
              </button>
              <button
                onClick={() => setPdfPages([])}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded flex items-center gap-2 hover:bg-red-700"
              >
                <FiTrash2 />
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfToImg;
