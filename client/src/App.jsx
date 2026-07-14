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

function App() {

  const accessToken = useAuthStore((state) =>
    state.accessToken
  )

  return (
    <div>
      <SkeletonTheme baseColor='#EEEEEE' highlightColor='#D1D3D4'>
        <Toaster
          position='top-right'
          toastOptions={{
            style: {
              background: "#1f2937",
              color: "#fff",
            },
          }}
        />
        <Routes>

          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/invite/:token" element={<InvitationPage />} />
          </Route>

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
          </Route>

          <Route path='*' element={<NotFound />} />

        </Routes>
      </SkeletonTheme>
    </div>
  )
}

export default App
