import { useState } from "react";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { authApi } from "../services/authApi";
import { requestResetSchema } from "../validations/resetPasswordSchema";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate
    const validation = requestResetSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid email");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.requestPasswordReset(email);
      setIsSent(true);
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to send reset instructions",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-red-300 py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg rounded-2xl sm:px-10 text-center">
            <FaEnvelope className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600 mb-6">
              We've sent password reset instructions to <strong>{email}</strong>
              . Please check your inbox and spam folder.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => setIsSent(false)}
                className="text-[#34020E] hover:text-[#5c3954] font-medium flex items-center justify-center gap-2 mx-auto"
              >
                <FaArrowLeft /> Send to a different email
              </button>
              <Link
                to="/login"
                className="block w-full py-3 px-4 bg-[#34020E] text-white rounded-lg hover:bg-[#5c3954] transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F5EEE6] py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-2xl sm:px-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Reset Your Password
            </h2>
            <p className="mt-2 text-gray-600">
              Enter your email address and we'll send you instructions to reset
              your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34020E] focus:border-transparent sm:text-sm pr-10"
                  placeholder="your@email.com"
                />
                <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#34020E] hover:bg-[#5c3954] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#34020E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Sending..." : "Send Reset Instructions"}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-[#34020E] hover:text-[#5c3954] flex items-center justify-center gap-2"
            >
              <FaArrowLeft /> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
