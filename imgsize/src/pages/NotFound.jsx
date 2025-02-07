import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(3); // Countdown starting from 3 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000); // Decrease count every second

    const timer = setTimeout(() => {
      navigate("/");
    }, 3000); // Redirect after 3 seconds

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-red-500">404 - Page Not Found</h1>
      <p className="mt-2 text-gray-600">
        Redirecting to home in <span className="text-blue-500 font-semibold">{count}</span> seconds...
      </p>
    </div>
  );
};

export default NotFound;
