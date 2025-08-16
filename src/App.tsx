import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomaPage'
import Dataset from './pages/Dataset'

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dataset" element={<Dataset />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  )
}

export default App
