import { Route, Routes } from 'react-router-dom'
import Theme from '../Components/Theme'
import PublicLayout from '../Components/PublicLayout'
import UserLayout from '../Components/UserLayout'
import { Home, Login, Signup, Dashboard, UserProfile, UserSettings } from '../views'
import AuthLayout from '../Components/AuthLayout'

const WebRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Theme />} >
        <Route path="/" element={<Home />} />
        <Route path="*" element={<PublicLayout />}>
        </Route>
        <Route path='auth' element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Route>
      <Route path="user" element={<UserLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="settings" element={<UserSettings />} />
      </Route>

    </Routes>
  )
}

export default WebRoutes