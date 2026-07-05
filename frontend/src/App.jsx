import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StartScreen from './pages/StartScreen.jsx'
import PhoneNumber from './pages/PhoneNumber.jsx'
import QuestionPage from './pages/QuestionPage.jsx'
import ThankYou from './pages/ThankYou.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DashboardLogin from './pages/DashboardLogin.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/phone" element={<PhoneNumber />} />
        <Route path="/question/:step" element={<QuestionPage />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/login" element={<DashboardLogin />} />
      </Routes>
    </BrowserRouter>
  )
}
