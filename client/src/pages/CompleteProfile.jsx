import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function CompleteProfile() {
    const { saveToken } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        displayName: "",
        dateOfBirth: "",
        role: "",
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }))
        setError('');
    }

    const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await axios.post('/api/auth/complete-profile', form)

      saveToken(data.token)

      navigate('/dashboard')


    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-medium">
              ✓
            </div>
            <div className="w-12 h-px bg-gray-300" />
            <div className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-medium">
              2
            </div>
            <div className="w-12 h-px bg-gray-200" />
            <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 text-xs flex items-center justify-center font-medium">
              3
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">One last step</h1>
          <p className="text-sm text-gray-500 mt-1">Tell us a bit about yourself</p>
        </div>

         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        First name
                    </label>
                    <input
                        type="text"
                        placeholder="John"
                        value={form.firstName}
                        onChange={handleChange('firstName')}
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Last name
                    </label>
                    <input
                        type="text"
                        placeholder="Doe"
                        value={form.lastName}
                        onChange={handleChange('lastName')}
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
                    />
                </div>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Display name
            </label>
            <div className="relative">
              {/* @ prefix inside the input */}
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                @
              </span>
              <input
                type="text"
                placeholder="johndoe"
                value={form.displayName}
                onChange={handleChange('displayName')}
                required
                className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Date of birth
            </label>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange('dateOfBirth')}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Your role
            </label>
            <select
              value={form.role}
              onChange={handleChange('role')}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition text-gray-700 bg-white cursor-pointer"
            >
              <option value="" disabled>Select your role...</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="manager">Manager</option>
              <option value="student">Student</option>
              <option value="other">Other</option>
            </select>
          </div>
           {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
           <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-gray-700 transition disabled:opacity-60 cursor-pointer mt-2"
          >
            {loading ? 'Saving...' : 'Complete setup →'}
          </button>

         </form>
      </div>
    </div>
  )
}