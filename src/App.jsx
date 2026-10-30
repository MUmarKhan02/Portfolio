import './styles.css';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { AiMl, Swe, Experience, Education, Skills, Contact } from './components/Sections';
import { BackgroundPulses, CursorGlow, ScrollProgress } from './components/Effects';
import useTheme from './hooks/useTheme';
import useStreaks from './hooks/useStreaks';
import useDotAlignment from './hooks/useDotAlignment';

export default function App() {
  const toggleTheme = useTheme();
  const [streaksOn, toggleStreaks] = useStreaks();
  useDotAlignment();

  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Nav onToggleTheme={toggleTheme} streaksOn={streaksOn} onToggleStreaks={toggleStreaks} />
      <Hero />
      <AiMl />
      <Swe />
      <Experience />
      <Education />
      <Skills />
      <Contact />
      <Footer />
      {/* keep the canvas last in the DOM: it paints over section backgrounds but under the text */}
      <BackgroundPulses streaksOn={streaksOn} />
    </>
  );
}
