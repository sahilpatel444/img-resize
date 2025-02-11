import "./App.css";

import InputFilePage from "./imgsize/InputFilePage";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import HomePage from "./imgsize/Home";
import ImgtoPdf from "./pages/Convert/ImgtoPdf";
import PdfToImg from "./pages/Convert/PdfToImg";
import Bulkresize from "./pages/Bulkresize/Bulkresize";
import JpgToPng from "./pages/Compress/JpgToPng";
import { Analytics } from "@vercel/analytics/react";
import NotFound from "./pages/NotFound";
import PdfToComprase from "./pages/Compress/PdfToComprase";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanal";
import PrivateRoute from "./components/PrivateRoutes";
import { AuthProvider } from "./Context/AuthContext";

function App() {
  const location = useLocation(); // ✅ Get current route

  // Hide navbar on login and register pages
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      <AuthProvider>
        {!hideNavbar && <Navbar />} {/* ✅ Conditionally render Navbar */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protect Admin Panel (Only accessible to isAdmin=true users) */}
          <Route path="/admin" element={<PrivateRoute adminOnly={true}><AdminPanel /></PrivateRoute>} />


          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/resize" element={<InputFilePage />} />
          <Route path="/image-resizer" element={<h1>Image Resizer Page</h1>} />
          <Route path="/crop-image" element={<h1>Crop Image Page</h1>} />
          <Route path="/compress/mb-to-kb" />
          <Route path="/compress/pdf-to-comprase" element={<PdfToComprase />} />
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
      </AuthProvider>
    </>
  );
}

export default App;
