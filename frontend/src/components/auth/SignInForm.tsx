import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Fleet Manager</h1>
          <p className="text-gray-500 text-sm mt-2">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="admin@fleet.com"
                className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none hover:border-gray-300 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none hover:border-gray-300 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              Remember me
            </label>

            <a
              href="#"
              className="text-sm text-blue-500 hover:underline font-medium"
            >
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-400">Secure Login</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          © 2025 Fleet Manager · All rights reserved
        </p>
      </div>
    </div>
  );
}
