import { Route, Routes } from 'react-router-dom'
import { env } from '@/utils'

export function App() {
  return (
    <Routes>
      <Route path="*" element={<main data-app={env.VITE_APP_NAME} />} />
    </Routes>
  )
}

export default App
