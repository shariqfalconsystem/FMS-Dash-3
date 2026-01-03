import { Link } from "react-router";
import { FiTruck } from "react-icons/fi";
import GridShape from "../../components/common/GridShape";
import { useEffect, useRef } from "react";

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Vehicles/particles for routes
    const vehicles: { x: number; y: number; speed: number; size: number }[] = [];
    for (let i = 0; i < 20; i++) {
      vehicles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.5 + Math.random() * 1.5,
        size: 2 + Math.random() * 2,
      });
    }

    // Moving truck for background animation
    const truck = {
      x: -100,
      y: height * 0.8,
      speed: 2,
      width: 80,
      height: 40,
    };

    function drawTruck() {
      if (!ctx) return;
      ctx.fillStyle = "#2563EB"; // blue truck
      ctx.fillRect(truck.x, truck.y, truck.width, truck.height);

      // Wheels
      ctx.fillStyle = "#111827"; // dark wheels
      ctx.beginPath();
      ctx.arc(truck.x + 15, truck.y + truck.height, 8, 0, Math.PI * 2);
      ctx.arc(truck.x + truck.width - 15, truck.y + truck.height, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Draw connecting lines
      for (let i = 0; i < vehicles.length; i++) {
        for (let j = i + 1; j < vehicles.length; j++) {
          const dx = vehicles[i].x - vehicles[j].x;
          const dy = vehicles[i].y - vehicles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(100,150,255,${1 - dist / 150})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(vehicles[i].x, vehicles[i].y);
            ctx.lineTo(vehicles[j].x, vehicles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw vehicles/particles
      vehicles.forEach((v) => {
        ctx.fillStyle = "#64B5FF";
        ctx.beginPath();
        ctx.arc(v.x, v.y, v.size, 0, Math.PI * 2);
        ctx.fill();

        v.x += v.speed;
        if (v.x > width) v.x = 0;
      });

      // Draw moving truck
      drawTruck();
      truck.x += truck.speed;
      if (truck.x > width + truck.width) truck.x = -truck.width;

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      truck.y = height * 0.8;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col items-center justify-center px-6 lg:px-24 py-12">
      {/* Background Grid Shapes */}
      <GridShape />

      {/* Canvas for particles and truck */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0"></canvas>

      {/* Card Container */}
      <div className="relative z-10 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex flex-col lg:flex-row items-center max-w-6xl w-full overflow-hidden">
        {/* Left Section: Animated Truck Icon */}
        <div className="flex flex-col items-center justify-center bg-blue-600 dark:bg-blue-700 text-white w-full lg:w-1/2 p-10 relative">
          <FiTruck className="text-9xl sm:text-[10rem] mb-6 animate-bounce hover:scale-110 transition-transform duration-500" />
          <h1 className="text-7xl sm:text-8xl font-extrabold">404</h1>
          <p className="mt-4 text-lg sm:text-xl font-medium">Page Not Found</p>

          {/* Floating Route Lines / Circles */}
          <div className="absolute top-5 left-5 w-16 h-16 border-2 border-white rounded-full opacity-30 animate-spin-slow"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white rounded-full opacity-20 animate-ping"></div>
        </div>

        {/* Right Section: Text & Actions */}
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center items-start space-y-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
            Oops! Something went wrong.
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
            The page you are looking for does not exist or has been moved. Check the URL or return to your dashboard to continue managing your fleet efficiently.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full">
            <Link
              to="/"
              className="flex-1 inline-flex justify-center items-center px-6 py-3 text-sm sm:text-base font-medium text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go to Dashboard
            </Link>

            <Link
              to="/support"
              className="flex-1 inline-flex justify-center items-center px-6 py-3 text-sm sm:text-base font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-sm text-gray-500 dark:text-gray-400 text-center w-full z-10">
        &copy; {new Date().getFullYear()} Fleet Management System. All rights reserved.
      </footer>
    </div>
  );
}
