import { useState } from "react";
import { FiUpload } from "react-icons/fi"; // You can install react-icons for this

const JpgToPng = () => {
  // State to store the uploaded file, preview URL, output format, and original file size
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // State to hold file preview URL
  const [compressedImageUrl, setCompressedImageUrl] = useState(null); // State to hold the converted image URL
  const [outputFormat, setOutputFormat] = useState("image/png"); // 'image/png' for conversion
  const [originalSize, setOriginalSize] = useState(null);

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setOriginalSize((selectedFile.size / 1024).toFixed(2)); // in KB
    
      // Create image preview URL
      setFilePreview(URL.createObjectURL(selectedFile));
      setCompressedImageUrl(null); // Reset the converted image URL if new file is selected
    }
  };

  // Convert JPG to PNG using canvas
  const handleConvertImage = () => {
    if (!file) return;

    const img = new Image();
    img.src = filePreview; // Set the image source to the preview URL
    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);

      // Convert the canvas to the selected output format (PNG in this case)
      const convertedImageUrl = canvas.toDataURL(outputFormat);
      setCompressedImageUrl(convertedImageUrl);
    };
  };

  // Trigger download for the converted image
  const handleDownload = () => {
    if (!compressedImageUrl) return;

    const link = document.createElement("a");
    link.href = compressedImageUrl;
    // Set file extension based on output format (PNG)
    link.download = "converted_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 className="text-xl font-bold mb-4">JPG TO PNG</h2>

      {/* File input */}
      <div className="flex justify-center items-center ">
        {!file ? (
          <>
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-90 h-60  border-2 border-dashed border-gray-300 rounded-xl shadow-lg cursor-pointer hover:bg-gray-100 "
            >
              <div className="flex flex-col items-center justify-center p-5">
                <FiUpload className="text-5xl text-blue-500 mb-3" />
                <span className="text-gray-600 text-lg font-semibold">
                  Upload Image
                </span>
                <span className="text-gray-400 text-sm mt-1">
                  {file ? file.name : "or, drag and drop an image here"}
                </span>
              </div>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              
                className="hidden"
                
              />
            </label>
          </>
        ) : (
          <>file uploaded</>
        )}
      </div>
      {/* Display file sizes */}
      {originalSize && (
        <p>
          Original Size: <strong>{originalSize}</strong> KB
        </p>
      )}

      {/* Convert Button */}
      <button
        onClick={handleConvertImage}
        className="px-4 py-2 mb-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
      >
        Convert Image
      </button>

      {/* Converted Image Preview and Download */}
      {compressedImageUrl && (
        <div>
          <h3>Converted Image:</h3>
          <img src={compressedImageUrl} alt="Converted Preview" style={{ width: "100%", marginBottom: "10px" }} />

          <button
            onClick={handleDownload}
            className="px-4 py-2 mb-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
          >
            Download PNG Image
          </button>
        </div>
      )}
    </div>
  );
};

export default JpgToPng;
