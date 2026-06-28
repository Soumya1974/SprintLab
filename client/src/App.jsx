import './App.css'
import LandingPage from './pages/LandingPage'
import { Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './routes/ProtectedRoutes'
import VerifyOtpRoute from './routes/VerifyOtpRoute'
import useAuthStore from './store/authStore'
import PublicRoute from './routes/PublicRoute'
import VerifyOtp from './pages/VerifyOtp'
import SetNewPassword from './pages/SetNewPassword'
import ForgotPasswordRoute from './routes/ForgotPasswordRoute'
import NotFound from './pages/NotFound'

function App() {

  const accessToken = useAuthStore((state) =>
    state.accessToken
  )

  return (
    <div>
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
            <Route path="/forgotpassword" element={<ForgotPassword />} />
          </Route>

          {/* Signup OTP Route */}
          <Route element={<VerifyOtpRoute />}>
            <Route path="/verifyotp" element={<VerifyOtp />} />
          </Route>

          {/* Forgot password route */}
          <Route element={<ForgotPasswordRoute />}>
            <Route path="/resetpassword" element={<SetNewPassword />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path='*' element={<NotFound />}/>

        </Routes>
    </div>
  )
}

export default App
