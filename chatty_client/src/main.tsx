import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import pages from './routes'
import './global.css'
import { AuthProvider } from './context/authContext'
import Login from './pages/login'
import Signup from './pages/signup'
import Layout from './ui/layout'
import NotFound from './pages/notfound'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            {pages.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
          </Route>

          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)
