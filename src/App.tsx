import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomaPage'
import DatasetOverview from './pages/DatasetOverview'

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dataset" element={<DatasetOverview />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  )
}

export default App
