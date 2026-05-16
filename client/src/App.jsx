import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import CompleteProfile from "./pages/CompleteProfile";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/signin" element={<AuthPage />} />
                <Route path="/complete-profile" element={ 
                    <ProtectedRoute>
                        <CompleteProfile />
                    </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/signin" replace />} />
            </Routes>
        </AuthProvider>
    )
}

