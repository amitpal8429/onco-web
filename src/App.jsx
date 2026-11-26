import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { SHOW_DOCTORS } from './data/site.js'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import CourseDetail from './pages/CourseDetail.jsx'
import Courses from './pages/Courses.jsx'
import Doctor from './pages/Doctor.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import RefundPolicy from './pages/RefundPolicy.jsx'
import Sitemap from './pages/Sitemap.jsx'
import Terms from './pages/Terms.jsx'

// Keeps old /programs links working.
function ProgramRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/courses/${slug}`} replace />
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:slug" element={<CourseDetail />} />
        <Route path="programs" element={<Navigate to="/courses" replace />} />
        <Route path="programs/:slug" element={<ProgramRedirect />} />
        {SHOW_DOCTORS && <Route path="doctor" element={<Doctor />} />}
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="refund" element={<RefundPolicy />} />
        <Route path="sitemap" element={<Sitemap />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
