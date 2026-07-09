import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Wardrobe from "./pages/Wardrobe";
import Suggestions from "./pages/Suggestions";
import PastOutfits from "./pages/PastOutfits";
import StylePreferenceOnboarding from "./pages/StylePreferenceOnboarding";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page - accessible to all */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth Routes - redirect to dashboard if already authenticated */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        
        {/* Protected Routes - require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/past-outfits" element={<PastOutfits />} />
          <Route path="/style-preference-onboarding" element={<StylePreferenceOnboarding />} />
        </Route>
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
