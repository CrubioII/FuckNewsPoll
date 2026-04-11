import { Routes, Route } from 'react-router-dom'
import AudiencePage from './pages/AudiencePage'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AudiencePage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}
