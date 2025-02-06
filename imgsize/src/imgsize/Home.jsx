import { Link } from "react-router-dom";

// HomePage.propTypes = {};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <header className="bg-gray-800 py-6 text-center">
        <h1 className="text-4xl font-bold">Online Image Resizer</h1>
        <p className="mt-2 text-gray-400 text-lg">
          Resize, Compress & Convert Images Instantly
        </p>
      </header>

      {/* CTA Section */}
      <section className="text-center mt-12">
        <h2 className="text-2xl font-semibold">Get Started Now</h2>
        <p className="text-gray-300 mt-2">
          Upload and resize your images instantly.
        </p>
        <Link
          to="/resize"
          className="mt-4 inline-block text-white bg-blue-600 hover:bg-blue-500 hover:text-white px-6 py-3 text-lg rounded-md"
        >
          Resize Images Now
        </Link>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto mt-10 px-4">
        <h2 className="text-2xl font-semibold text-center">Features</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Resize Images</h3>
            <p className="mt-2 text-gray-300">
              Adjust image dimensions without losing quality.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Compress Files</h3>
            <p className="mt-2 text-gray-300">
              Reduce image file size while maintaining clarity.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Format Conversion</h3>
            <p className="mt-2 text-gray-300">
              Convert between JPG, PNG, WEBP, and PDF formats.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Bulk Resize</h3>
            <p className="mt-2 text-gray-300">
              Resize multiple images at once efficiently.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">High-Speed Processing</h3>
            <p className="mt-2 text-gray-300">
              Process large images quickly and effectively.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Secure & Private</h3>
            <p className="mt-2 text-gray-300">
              All images are processed securely with no data stored.
            </p>
          </div>
        </div>
      </section>
      {/* Introduction Section */}
      <section className="max-w-4xl mx-auto text-center mt-10 px-4">
        <h2 className="text-2xl font-semibold">Why Use Our Image Resizer?</h2>
        <p className="mt-4 text-gray-300">
          Quickly adjust the size, quality, and format of your images with our
          easy-to-use online tool. Perfect for websites, social media, and
          professional use.
        </p>
      </section>
      {/* footer*/}
      <section className="bg-gray-800 p-15 mt-5">
        <div className=" grid-cols-1  space-x-1.5 flex-auto ">
          <p>IMG TO PDF</p>
          <p>IMG TO PDF</p>
          <p>IMG TO PDF</p>
          <p>IMG TO PDF</p>
          <p>IMG TO PDF</p>
        </div>
      </section>
    </div>
  );
};
export default HomePage;
