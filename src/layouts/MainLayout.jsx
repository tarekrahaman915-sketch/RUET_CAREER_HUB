import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar.jsx'
import Footer from '../components/common/Footer.jsx'

export default function MainLayout() {
  return (
    <>
      <div className="grid-bg" />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}
