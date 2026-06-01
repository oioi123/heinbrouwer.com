import { useState, useEffect, Suspense, useRef } from 'react';
import { GithubIcon, LinkedinIcon, MailIcon, GlobeIcon } from 'lucide-react';
import OfficeScene from './OfficeScene';
import Navigation from './sections/Navigation';
import ProfileSection from './sections/ProfileSection';
import SkillsSection from './sections/SkillsSection';
import ExperienceSection from './sections/ExperienceSection';
import EducationSection from './sections/EducationSection';
import ProjectsSection from './sections/ProjectsSection';
import TimelineSection from './sections/TimelineSection';
import useResponsive from '../hooks/useResponsive';
import { createPortfolioStyles } from '../data/portfolioStyles';
import './portfolio.css';

const MOBILE_NAV_HEIGHT = 60;

const PortfolioTemplate = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const contentRef = useRef(null);
  const navRef = useRef(null);

  const isMobile = useResponsive();

  // Fade the nav in/out and toggle its shadow based on scroll position.
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > 100) {
        setIsNavVisible(true);
        if (contentRef.current && scrollTop > contentRef.current.offsetTop + 100) {
          setIsNavScrolled(true);
        } else {
          setIsNavScrolled(false);
        }
      } else {
        setIsNavVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const styles = createPortfolioStyles({
    isMobile,
    isNavScrolled,
    isNavVisible,
    mobileNavHeight: MOBILE_NAV_HEIGHT,
    mobileNavOpen
  });

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setMobileNavOpen(false);

    if (contentRef.current) {
      const yOffset = isMobile ? -MOBILE_NAV_HEIGHT : 0;
      const element = document.getElementById(section + '-section');
      if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else {
        contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const sectionProps = { styles, isMobile };

  return (
    <div style={styles.mainContainer}>
      <Navigation
        navRef={navRef}
        styles={styles}
        isNavScrolled={isNavScrolled}
        activeSection={activeSection}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        onSectionChange={handleSectionChange}
      />

      {/* Fixed 3D Scene */}
      <div style={styles.sceneContainer}>
        <Suspense fallback={null}>
          <OfficeScene />
        </Suspense>

        <div
          className="scroll-prompt"
          style={{
            position: 'absolute',
            bottom: isMobile ? '2rem' : '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            color: '#fff',
            cursor: 'pointer',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: isMobile ? '0.75rem 1.5rem' : '0.5rem 1rem',
            borderRadius: '30px',
            fontSize: isMobile ? '1.1rem' : 'inherit',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 5,
          }}
          onClick={() => {
            const yOffset = isMobile ? -MOBILE_NAV_HEIGHT : 0;
            const element = document.getElementById('cv-content');
            if (element) {
              const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }}
        >
          <p style={{ marginBottom: isMobile ? '0.5rem' : '1rem', fontWeight: 'bold' }}>
            {isMobile ? 'Click to view portfolio' : 'Scroll/click to view portfolio'}
          </p>
          <div style={{ fontSize: isMobile ? '1.5rem' : '1.2rem', fontWeight: 'bold' }}>↓</div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div style={styles.contentContainer} ref={contentRef} id="cv-content">
        <div style={styles.section}>
          <div style={styles.sectionContent}>
            {/* Profile Header */}
            <div style={styles.profileContainer}>
              <div style={styles.profileImage}>
                <div style={styles.placeholderImage}>HB</div>
              </div>
              <div style={styles.profileInfo}>
                <h1 style={styles.profileName}>Hein Brouwer</h1>
                <h2 style={styles.profileTitle}>Data Scientist & AR Developer</h2>
                <div style={styles.contactLinks}>
                  <a href="https://github.com/oioi123" target="_blank" rel="noopener noreferrer" style={styles.contactLink}>
                    <GithubIcon size={isMobile ? 16 : 18} />
                    <span>GitHub</span>
                  </a>
                  <a href="https://www.linkedin.com/in/hein-brouwer-a76793326/" target="_blank" rel="noopener noreferrer" style={styles.contactLink}>
                    <LinkedinIcon size={isMobile ? 16 : 18} />
                    <span>LinkedIn</span>
                  </a>
                  <a href="http://www.heinbrouwer.com" target="_blank" rel="noopener noreferrer" style={styles.contactLink}>
                    <GlobeIcon size={isMobile ? 16 : 18} />
                    <span>Portfolio</span>
                  </a>
                  <a href="mailto:contact@heinbrouwer.com" style={styles.contactLink}>
                    <MailIcon size={isMobile ? 16 : 18} />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>

            {activeSection === 'profile' && <ProfileSection {...sectionProps} />}
            {activeSection === 'skills' && <SkillsSection {...sectionProps} />}
            {activeSection === 'experience' && <ExperienceSection {...sectionProps} />}
            {activeSection === 'education' && <EducationSection {...sectionProps} />}
            {activeSection === 'projects' && <ProjectsSection {...sectionProps} />}
            {activeSection === 'timeline' && <TimelineSection {...sectionProps} />}
          </div>
        </div>

        <footer style={styles.footer}>
          <p>&copy; {new Date().getFullYear()} Hein Brouwer</p>
        </footer>
      </div>

      {isMobile && (
        <button onClick={scrollToTop} style={styles.scrollToTopButton} aria-label="Scroll to top">
          ↑
        </button>
      )}
    </div>
  );
};

export default PortfolioTemplate;
