import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/v2/Layout'
import Feed from './pages/v2/Feed'
import Login from './pages/v2/Login'
import Register from './pages/v2/Login'  // Using login for now
import Profile from './pages/v2/Profile'
import CreateIOU from './pages/CreateIOU'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'
import Discover from './pages/Discover'
import Admin from './pages/Admin'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      
      {/* Protected routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Feed />} />
        <Route path="/create" element={<CreateIOU />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  )
}
