import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TherapistListPage from './pages/TherapistListPage'
import TherapistProfilePage from './pages/TherapistProfilePage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import TestPage from './pages/admin/TestPage'
import Navigation from './components/Navigation'
import './App.css'

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/therapeutes" element={<TherapistListPage />} />
        <Route path="/therapeute/:slug" element={<TherapistProfilePage />} />
        <Route path="/devenir-therapeute" element={<RegisterPage />} />
        <Route path="/admin" element={<div style={{padding: '2rem', color: 'white', background: '#1a0a2e'}}>✅ ADMIN FONCTIONNE</div>} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
