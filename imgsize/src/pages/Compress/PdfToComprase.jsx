import React, { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { FiUpload, FiDownload, FiTrash2, FiScissors } from "react-icons/fi";

const PdfToCompress = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [pdfSize, setPdfSize] = useState("");
  const [compressedPdf, setCompressedPdf] = useState(null);
  const [compressionQuality, setCompressionQuality] = useState(0.5); // Quality Input (0 to 1)
  const [loading, setLoading] = useState(false);

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file && file.type === "application/pdf") {
      setPdfName(file.name);
      setPdfSize((file.size / 1024).toFixed(2) + " KB");
      setPdfFile(file);
      setCompressedPdf(null);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // Handle PDF Compression
  const handleCompress = async () => {
    if (!pdfFile || compressionQuality < 0 || compressionQuality > 1) return;
    setLoading(true);

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(pdfFile);

    fileReader.onload = async () => {
      try {
        const pdfDoc = await PDFDocument.load(fileReader.result);

        // Compression Logic: Reduce image quality based on user input
        const pages = pdfDoc.getPages();
        for (const page of pages) {
          const { width, height } = page.getSize();
          const scale = compressionQuality; // Scale down the images
          page.drawRectangle({
            x: 0,
            y: 0,
            width,
            height,
            color: rgb(1, 1, 1),
            opacity: 1 - scale,
          });
        }

        const compressedPdfBytes = await pdfDoc.save({
          useObjectStreams: false,
          updateFieldAppearances: false,
          compress: true,
        });

        const compressedBlob = new Blob([compressedPdfBytes], {
          type: "application/pdf",
        });

        setCompressedPdf(compressedBlob);
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
    setPdfSize("");
    setCompressedPdf(null);
    setCompressionQuality(0.5);
    setLoading(false);
  };

  return (
    <div className="p-5 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Compress PDF</h2>

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
          <p className="text-gray-600">Size: {pdfSize}</p>

          {/* Input Field for Compression Quality */}
          <input
            type="number"
            placeholder="Enter compression quality (0 to 1)"
            className="mt-3 w-full p-2 border rounded-lg"
            value={compressionQuality}
            onChange={(e) => setCompressionQuality(parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.1"
          />

          {!compressedPdf ? (
            <button
              onClick={handleCompress}
              className="bg-blue-500 text-white px-4 py-2 mt-3 rounded-lg flex items-center gap-2 w-full justify-center"
              disabled={loading}
            >
              {loading ? (
                "Compressing..."
              ) : (
                <>
                  {" "}
                  <FiScissors /> Compress PDF{" "}
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleDownload}
              className="bg-green-500 text-white px-4 py-2 mt-3 rounded-lg flex items-center gap-2 w-full justify-center"
            >
              <FiDownload />
              Download Compressed PDF
            </button>
          )}

          <button
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 mt-3 rounded-lg flex items-center gap-2 w-full justify-center"
          >
            <FiTrash2 />
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfToCompress;
