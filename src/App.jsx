import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Footer from './components/Footer'
import StatusBar from './components/StatusBar'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import { ThemeProvider } from './components/ThemeTransition'

export default function App() {
  return (
    <ThemeProvider>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <StatusBar />
      <BackToTop />
    </ThemeProvider>
  )
}
