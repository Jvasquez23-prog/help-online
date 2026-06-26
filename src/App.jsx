import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Administrator from './components/Administrator.jsx'
import Doctor from './components/Doctor.jsx'
import Pacient from './components/Pacient.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Administrator" element={<Administrator />} />
        <Route path="/Doctor" element={<Doctor />} />
        <Route path="/Pacient" element={<Pacient />} />
      </Routes>
    </BrowserRouter>
  )
}
