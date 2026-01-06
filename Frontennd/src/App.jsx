import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from './Pages/landingPage'
import Login from './Pages/Login'
import Signup from './Pages/Signup'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home / Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;