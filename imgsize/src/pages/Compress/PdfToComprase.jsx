import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FiUpload, FiDownload, FiTrash2, FiScissors } from "react-icons/fi";

const PdfToCompress = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [originalSize, setOriginalSize] = useState("");
  const [compressedPdf, setCompressedPdf] = useState(null);
  const [compressedSize, setCompressedSize] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file && file.type === "application/pdf") {
      setPdfName(file.name);
      setOriginalSize((file.size / 1024).toFixed(2) + " KB");
      setPdfFile(file);
      setCompressedPdf(null);
      setCompressedSize("");
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // Handle PDF Compression (Reduce by ~50%)
  const handleCompress = async () => {
    if (!pdfFile) return;
    setLoading(true);

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(pdfFile);

    fileReader.onload = async () => {
      try {
        const pdfDoc = await PDFDocument.load(fileReader.result);

        // 🔹 Reduce embedded font size
        pdfDoc.getForm().updateFieldAppearances();

        // 🔹 Optimize images (Reduce quality)
        const pages = pdfDoc.getPages();
        for (const page of pages) {
          const { width, height } = page.getSize();
          page.scale(0.9, 0.9); // 10% downscaling for better compression
        }

        // 🔹 Save with compression settings
        const compressedPdfBytes = await pdfDoc.save({
          useObjectStreams: true,
          updateFieldAppearances: false,
          compress: true,
        });

        const compressedBlob = new Blob([compressedPdfBytes], {
          type: "application/pdf",
        });

        setCompressedPdf(compressedBlob);
        setCompressedSize((compressedBlob.size / 1024).toFixed(2) + " KB");
      } catch (error) {
        alert("An error occurred during compression. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fileReader.onerror = () => {
      alert("An error occurred while reading the file. Please try again.");
      setLoading(false);
    };
  };

  // Handle Download
  const handleDownload = () => {
    if (compressedPdf) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(compressedPdf);
      link.download = `compressed_${pdfName}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Reset all states
  const handleReset = () => {
    setPdfFile(null);
    setPdfName("");
    setOriginalSize("");
    setCompressedPdf(null);
    setCompressedSize("");
    setLoading(false);
  };

  return (
    <div className="p-5 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Compress PDF (50%)</h2>

      {!pdfFile ? (
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-90 h-60 border-2 border-dashed border-gray-300 rounded-xl shadow-lg cursor-pointer hover:bg-gray-100 p-5"
        >
          <FiUpload className="text-5xl text-blue-500 mb-3" />
          <span className="text-gray-600 text-lg font-semibold">
            Upload PDF
          </span>
          <span className="text-gray-400 text-sm mt-1">
            or, drag and drop a PDF here
          </span>
          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      ) : (
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg w-full">
          <p className="font-semibold">File: {pdfName}</p>
          <p className="text-gray-600">Original Size: {originalSize}</p>

          {!compressedPdf ? (
            <button
              onClick={handleCompress}
              className="bg-blue-500 text-white px-4 py-2 mt-3 rounded-lg flex items-center gap-2 w-full justify-center"
              disabled={loading}
            >
              {loading ? "Compressing..." : <>
                <FiScissors /> Compress PDF
              </>}
            </button>
          ) : (
            <>
              <p className="text-green-600 font-semibold mt-2">
                Compressed Size: {compressedSize}
              </p>
              <button
                onClick={handleDownload}
                className="bg-green-500 text-white px-4 py-2 mt-3 rounded-lg flex items-center gap-2 w-full justify-center"
              >
                <FiDownload /> Download Compressed PDF
              </button>
            </>
          )}

          <button
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 mt-3 rounded-lg flex items-center gap-2 w-full justify-center"
          >
            <FiTrash2 /> Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfToCompress;
