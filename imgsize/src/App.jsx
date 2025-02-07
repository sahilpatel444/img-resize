import "./App.css";

import InputFilePage from "./imgsize/InputFilePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import HomePage from "./imgsize/Home";
import ImgtoPdf from "./pages/Convert/ImgtoPdf";
import PdfToImg from "./pages/Convert/PdfToImg";
import Bulkresize from "./pages/Bulkresize/Bulkresize";
import JpgToPng from "./pages/Compress/JpgToPng";
import { Analytics } from "@vercel/analytics/react";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <BrowserRouter
        future={{
          v7_startTransition: true,
        }}
      >
        <Analytics />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/resize" element={<InputFilePage />} />
          <Route path="/image-resizer" element={<h1>Image Resizer Page</h1>} />
          <Route path="/crop-image" element={<h1>Crop Image Page</h1>} />
          <Route path="/compress/mb-to-kb" />
          <Route path="/compress/jpg-to-png" element={<JpgToPng />} />
          <Route path="/convert/img-to-pdf" element={<ImgtoPdf />} />
          <Route path="/convert/pdf-to-img" element={<PdfToImg />} />
          <Route
            path="/convert/webp-to-png"
            element={<h1>WEBP to PNG Page</h1>}
          />
          <Route path="/bulk-resize" element={<Bulkresize />} />
          {/* <Route path="/three" element={<ThreeScene />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
