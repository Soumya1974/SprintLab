import './App.css'
import LandingPage from './pages/landingPages/LandingPage'
import { Route, Routes } from 'react-router-dom'
import Signup from './pages/authPages/Signup'
import Login from './pages/authPages/Login'
import ForgotPassword from './pages/authPages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './routes/authRoutes/ProtectedRoutes'
import VerifyOtpRoute from './routes/authRoutes/VerifyOtpRoute'
import useAuthStore from './store/authStore'
import PublicRoute from './routes/authRoutes/PublicRoute'
import VerifyOtp from './pages/authPages/VerifyOtp'
import SetNewPassword from './pages/authPages/SetNewPassword'
import ForgotPasswordRoute from './routes/authRoutes/ForgotPasswordRoute'
import NotFound from './pages/landingPages/NotFound'
import { SkeletonTheme } from 'react-loading-skeleton'
import InvitationPage from './pages/authPages/InvitationPage'
import ProfilePage from './components/ApplicationPages/ProfilePage'

function App() {

  const accessToken = useAuthStore((state) =>
    state.accessToken
  )

  return (
    <div>
      <SkeletonTheme baseColor='#EEEEEE' highlightColor='#D1D3D4'>
        <Toaster
          position="top-right"
          gutter={10}
          toastOptions={{
            duration: 3000,
            style: {
              width: "360px",
              minHeight: "64px",
              background: "#FFFFFF",
              color: "#172B4D",
              border: "1px solid #DFE1E6",
              borderRadius: "6px",
              boxShadow: "0 4px 12px rgba(9, 30, 66, 0.15)",
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "500",
            },

            success: {
              style: {
                borderLeft: "4px solid #36B37E",
              },
              iconTheme: {
                primary: "#36B37E",
                secondary: "#FFFFFF",
              },
            },

            error: {
              style: {
                borderLeft: "4px solid #DE350B",
              },
              iconTheme: {
                primary: "#DE350B",
                secondary: "#FFFFFF",
              },
            },

            loading: {
              style: {
                borderLeft: "4px solid #0052CC",
              },
              iconTheme: {
                primary: "#0052CC",
                secondary: "#FFFFFF",
              },
            },
          }}
        />

        <Routes>

          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Invitation route accessible to everyone */}
          <Route path="/invite/:token" element={<InvitationPage />} />

          {/* Signup OTP Route */}
          <Route element={<VerifyOtpRoute />}>
            <Route path="/verifyotp" element={<VerifyOtp />} />
          </Route>

          {/* Forgot password route */}
          <Route element={<ForgotPasswordRoute />}>
            <Route path="/resetpassword" element={<SetNewPassword />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/userprofile" element={<ProfilePage />} />
          </Route>

          <Route path='*' element={<NotFound />} />

        </Routes>
      </SkeletonTheme>
    </div>
  )
}

export default App
