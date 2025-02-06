// import { createContext, useState } from "react";
// import { FiUpload } from "react-icons/fi"; // You can install react-icons for this

// export const InputFile = createContext();

// export function InputProvider({ children }) {
//   const [file, setFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null); // State to hold file preview URL

//   // Handle file upload
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files && e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       //   setOriginalSize((selectedFile.size / 1024).toFixed(2)); // in KB
//       //   setCompressedImageUrl(null);
//       //   setCompressedSize(null);
//       // Create image preview URL
//       setFilePreview(URL.createObjectURL(selectedFile));
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const droppedFile = e.dataTransfer.files[0];
//     if (droppedFile) {
//       setFile(droppedFile);
//       setFilePreview(URL.createObjectURL(droppedFile));
//     }
//   };
//   <>
//     <div className="flex justify-center items-center ">
//       {!file ? (
//         <>
//           <label
//             htmlFor="file-upload"
//             className="flex flex-col items-center justify-center w-90 h-60  border-2 border-dashed border-gray-300 rounded-xl shadow-lg cursor-pointer hover:bg-gray-100 "
//             onDragOver={handleDragOver}
//             onDrop={handleDrop}
//           >
//             <div className="flex flex-col items-center justify-center p-5">
//               <FiUpload className="text-5xl text-blue-500 mb-3" />
//               <span className="text-gray-600 text-lg font-semibold">
//                 Upload Image
//               </span>
//               <span className="text-gray-400 text-sm mt-1">
//                 {file ? file.name : "or, drag and drop an image here"}
//               </span>
//             </div>
//             <input
//               id="file-upload"
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="hidden"
//             />
//           </label>
//         </>
//       ) : (
//         <>file uploaded</>
//       )}
//     </div>
//   </>;
//   return (<InputFile.Provider value={{file}}>{children}</InputFile.Provider>);
// };

// AppProvider.propTypes = {
//     children: PropTypes.node.isRequired,
//   };
  
