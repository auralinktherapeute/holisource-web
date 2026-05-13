import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useState } from 'react'
import HomePage from './pages/HomePage'
import TherapistListPage from './pages/TherapistListPage'
import TherapistProfilePage from './pages/TherapistProfilePage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import Navigation from './components/Navigation'
import { UpgradeModal } from './components/UpgradeModal'
import './App.css'

function AppInner() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const location = useLocation()

  if (location.search.includes('upgrade=success')) {
    console.log('✅ Paiement réussi!')
  } else if (location.search.includes('upgrade=canceled')) {
    console.log('❌ Paiement annulé')
  }

  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/therapeutes" element={<TherapistListPage />} />
        <Route path="/therapeute/:slug" element={<TherapistProfilePage />} />
        <Route path="/devenir-therapeute" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </>
  )
}

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  )
}

export default App
