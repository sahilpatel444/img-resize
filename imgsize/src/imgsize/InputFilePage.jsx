import { useState } from "react";
import imageCompression from "browser-image-compression";
import { FiUpload } from "react-icons/fi"; // You can install react-icons for this

const InputFilePage = () => {
  // State to store the uploaded file, target size, output format, and preview details.
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // State to hold file preview URL
  const [targetSizeKB, setTargetSizeKB] = useState(50); // default target: 500 KB
  const [outputFormat, setOutputFormat] = useState("image/jpeg"); // 'image/jpeg' or 'image/png'
  const [originalSize, setOriginalSize] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [compressedImageUrl, setCompressedImageUrl] = useState(null);

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setOriginalSize((selectedFile.size / 1024).toFixed(2)); // in KB
      setCompressedImageUrl(null);
      setCompressedSize(null);
      // Create image preview URL
      setFilePreview(URL.createObjectURL(selectedFile));
      // setTargetSizeKB((selectedFile.size / 1024).toFixed(0))
    }
  };

  // drop and down img
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setFilePreview(URL.createObjectURL(droppedFile));
    }
  };
  console.log(file, "drag and drop");

  // Convert a Blob to PNG using canvas
  const convertBlobToPNG = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((pngBlob) => {
            if (pngBlob) {
              resolve(pngBlob);
            } else {
              reject(new Error("Canvas is empty"));
            }
          }, "image/png");
        };
        img.onerror = (err) => reject(err);
        img.src = e.target.result;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(blob);
    });
  };

  // Compress the image using the browser-image-compression library
  const handleCompress = async () => {
    if (!file) return;

    // Convert the target size from KB to MB (library option expects MB)
    // const targetSizeMB = targetSizeKB / 1024;
    // Ensure valid size input
    if (targetSizeKB <= 0) {
      alert("Please enter a valid target size.");
      return;
    }
    const targetSizeMB = targetSizeKB / 1024; // Convert KB to MB
    let compressedFile = file; // Start with original file

    const options = {
      maxSizeMB: targetSizeMB > 0 ? targetSizeMB : 0.1, // Avoid 0MB issue
      maxWidthOrHeight: 1024, // Resize large images (optional)
      useWebWorker: true, // Improve performance
    };
    try {
      let attempt = 0;

      // Retry compression until size is below target
      while (compressedFile.size / 1024 > targetSizeKB && attempt < 5) {
        attempt++;
        compressedFile = await imageCompression(compressedFile, options);

        console.log(
          `Attempt ${attempt}: Compressed Size =`,
          (compressedFile.size / 1024).toFixed(2),
          "KB"
        );

        // Adjust compression strength (reduce quality further)
        options.maxSizeMB *= 0.8; // Reduce size further each attempt
      }

      if (compressedFile.size / 1024 > targetSizeKB) {
        alert(
          "Could not achieve exact target size. Closest possible compression applied."
        );
      }

      // Handle PNG conversion if selected
      if (outputFormat === "image/png") {
        const pngBlob = await convertBlobToPNG(compressedFile);
        setCompressedSize((pngBlob.size / 1024).toFixed(2)); // in KB
        setCompressedImageUrl(URL.createObjectURL(pngBlob));
      } else {
        setCompressedSize((compressedFile.size / 1024).toFixed(2)); // in KB
        setCompressedImageUrl(URL.createObjectURL(compressedFile));
      }
    } catch (error) {
      console.error("Error during image compression:", error);
    }
  };

  // Trigger download for the compressed image
  const handleDownload = () => {
    if (!compressedImageUrl) return;
    const link = document.createElement("a");
    link.href = compressedImageUrl;
    // Set file extension based on output format
    link.download =
      outputFormat === "image/jpeg"
        ? "compressed_image.jpg"
        : "compressed_image.png";
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
      <h2>Image Compressor</h2>

      {/* File input */}
      <div className="flex justify-center items-center ">
        {!file ? (
          <>
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-90 h-60  border-2 border-dashed border-gray-300 rounded-xl shadow-lg cursor-pointer hover:bg-gray-100 "
              onDragOver={handleDragOver}
              onDrop={handleDrop}
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
      {compressedSize && (
        <p>
          Compressed Size: <strong>{compressedSize}</strong> KB
        </p>
      )}

      {/* file view */}
      {!filePreview ? (
        <></>
      ) : (
        <>
          <img
            src={filePreview}
            alt="upload file"
            style={{ maxWidth: "50%", margin: "0 auto" }}
          />
        </>
      )}
      {/* Input for target compression value */}
      <div className="flex flex-col items-center my-4">
        <label htmlFor="targetSize" className=" font-medium">
          Target Size (KB):
        </label>
        <input
          id="targetSize"
          type="number"
          value={targetSizeKB}
          onChange={(e) => {
            const value = e.target.value;
            setTargetSizeKB(value === "" ? "" : Number(value));
          }}
          className="w-20 px-3 py-1  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm "
        />
      </div>
      {/* Compress Button */}
      <button
        onClick={handleCompress}
        className="px-4 py-2 mb-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
      >
        Click To Compress
      </button>

      {compressedSize && (
        <p>
          Compressed Size: <strong>{compressedSize}</strong> KB
        </p>
      )}

      {/* Compressed Image Preview and Download */}
      {compressedImageUrl && (
        <div>
          <h3>Compressed Image Preview:</h3>
          <img
            src={compressedImageUrl}
            alt="Compressed Preview"
            style={{ maxWidth: "50%", margin: "0 auto" }}
          />
          <br />
          {/* Dropdown for output format */}
          <div style={{ margin: "10px 0" }}>
            <label htmlFor="format">Download Format: </label>
            <select
              id="format"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              style={{ marginLeft: "5px" }}
            >
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
            </select>
          </div>
          <button
            onClick={handleDownload}
            className="px-4 py-2 mb-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
          >
            Download Image
          </button>
        </div>
      )}
    </div>
  );
};

export default InputFilePage;
