import CoolIntro from "./components/CoolIntro"
import Experiences from "./components/Experiences"
import Projects from "./components/Projects"
import Skills from "./components/Skills"
import Contact from "./components/Contact"
import SnapScroll from "./components/SnapScroll"
import ThemeToggle from "./components/ThemeToggle"
import GridBackground from "./components/GridBackground"

export function App() {
  return (
    <>
      <GridBackground />
      <ThemeToggle />
      <SnapScroll>
        <CoolIntro />
        <Experiences />
        <Projects />
        <Skills />
        <Contact />
      </SnapScroll>
    </>
  )
}

export default App
