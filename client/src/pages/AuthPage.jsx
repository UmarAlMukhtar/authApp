import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";

export default function AuthPage() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signin, signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const googleError = searchParams.get("error");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = mode === "signin"
        ? await signin(email, password)
        : await signup(email, password);

      navigate(data.isProfileComplete ? "/dashboard" : "/complete-profile");
    } catch (err) {
      const message =
      err.response?.data?.error ||  
      err.message ||
      'Something went wrong'

      setError(message)
}finally {
      setLoading(false);
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setEmail("");
    setPassword("");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My App</h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === "signin" ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>

        {googleError && (
          <p className="text-red-500 text-sm text-center mb-4">
            Google sign in Failed. Please Try Again
          </p>
        )}

        <button
          onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-2xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer mb-5"
        >
          <FcGoogle size={20}/>
          Continue with Google
        </button>
        
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200"/>
          <span className="text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200"/>
        </div>

        <div className="flex border border-gray-200 rounded-2xl overflow-hidden mb-5">
          <button 
            onClick={() => switchMode("signin")}
            className={`flex-1 py-2 text-sm font-medium transition cursor-pointer ${mode === "signin" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
          >
            Sign in
          </button>
          <button 
            onClick={() => switchMode("signup")}
            className={`flex-1 py-2 text-sm font-medium transition cursor-pointer ${mode === "signup" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
            <input 
              type="email"
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Password</label>
            <input 
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed mt-2"
          >
              {loading
                ? "Please wait..."
                : mode === "signin" ? "Sign In" : "Create Account"
              }
          </button>

        </form>

      </div>
    </div>
  )
}