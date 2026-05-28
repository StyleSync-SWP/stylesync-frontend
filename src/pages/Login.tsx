import { useState, useCallback } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuthStore from "../stores/authStore";
import { authApi } from "../services/authApi";
import { loginSchema } from "../validations/loginSchema";
import useGoogleAuth from "../hooks/useGoogleAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const errorMessages: { email?: string; password?: string } = {};
      validation.error.issues.forEach((err) => {
        errorMessages[err.path[0] as "email" | "password"] = err.message;
      });
      setErrors(errorMessages);
      return;
    }

    setIsLoading(true);

    try {
      const { user, token, refreshToken } = await authApi.login(
        email,
        password,
      );
      login(user, token, refreshToken);

      Swal.fire({
        title: "Success!",
        text: "You have successfully logged in",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/dashboard");
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message || "Invalid email or password",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-in handler using custom hook
  const handleGoogleSuccess = useCallback(
    async (googleUser: {
      email: string;
      name: string;
      picture: string;
      sub: string;
    }) => {
      setIsLoading(true);

      try {
        // Authenticate with our mock API
        const { user, token, refreshToken } = await authApi.googleAuth({
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          sub: googleUser.sub,
        });

        login(user, token, refreshToken);

        Swal.fire({
          title: "Success!",
          text: "Logged in with Google successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate("/dashboard");
      } catch (error: any) {
        Swal.fire({
          title: "Error",
          text: error.message || "Google login failed",
          icon: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [login, navigate],
  );

  const handleGoogleError = useCallback((error: Error) => {
    Swal.fire({
      title: "Error",
      text: error.message || "Google login failed",
      icon: "error",
    });
  }, []);

  const { login: googleLogin } = useGoogleAuth(
    handleGoogleSuccess,
    handleGoogleError,
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-red-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-2xl sm:px-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-bold text-[#34020E]">
              StyleSync
            </Link>
            <p className="mt-2 text-gray-600">Welcome back!</p>
          </div>

          {/* Google Sign-in Button */}
          <button
            onClick={() => googleLogin()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors mb-6"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="font-medium">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34020E] focus:border-transparent sm:text-sm"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34020E] focus:border-transparent sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-[#34020E] hover:text-[#5c3954]"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#34020E] hover:bg-[#5c3954] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#34020E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-[#34020E] hover:text-[#5c3954]"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
