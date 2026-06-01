import { Menu, X } from 'lucide-react';
import { NAV_SECTIONS } from '../../data/portfolioData';

const Navigation = ({
  navRef,
  styles,
  isNavScrolled,
  activeSection,
  mobileNavOpen,
  setMobileNavOpen,
  onSectionChange
}) => (
  <nav ref={navRef} style={styles.stickyNav} className={isNavScrolled ? 'nav-scrolled' : ''}>
    <div style={styles.navContent}>
      <button
        style={styles.mobileMenuButton}
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
        aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
      >
        {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div style={styles.navLinks}>
        {NAV_SECTIONS.map((section) => (
          <button
            key={section}
            onClick={() => onSectionChange(section)}
            style={{
              ...styles.navButton,
              ...(activeSection === section ? styles.navButtonActive : {})
            }}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>
    </div>
  </nav>
);

export default Navigation;
