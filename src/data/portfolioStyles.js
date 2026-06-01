import { colors, shadows } from '../theme';

// Builds the portfolio style objects. Kept as a factory because many values
// depend on viewport (isMobile) and scroll/nav state.
export const createPortfolioStyles = ({ isMobile, isNavScrolled, isNavVisible, mobileNavHeight, mobileNavOpen }) => ({
  mainContainer: {
    minHeight: '100vh',
    backgroundColor: colors.cardBg,
    color: colors.textBody,
    position: 'relative',
    overflowX: 'hidden'
  },
  sceneContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    zIndex: 1
  },
  contentContainer: {
    position: 'relative',
    zIndex: 2,
    backgroundColor: colors.pageBg,
    marginTop: '100vh',
    minHeight: '100vh',
    boxShadow: shadows.content,
    borderRadius: '16px 16px 0 0',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: mobileNavHeight
  },
  stickyNav: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(249, 249, 249, 0.95)',
    zIndex: 100,
    boxShadow: isNavScrolled ? shadows.nav : 'none',
    transition: 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
    opacity: isNavVisible ? 1 : 0,
    transform: isNavVisible ? 'translateY(0)' : 'translateY(-100%)',
    pointerEvents: isNavVisible ? 'auto' : 'none',
    borderRadius: '0 0 16px 16px',
  },
  navContent: {
    display: 'flex',
    justifyContent: 'center',
    padding: '0.75rem',
    flexDirection: isMobile ? 'column' : 'row',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  mobileMenuButton: {
    display: isMobile ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    alignSelf: 'flex-end',
    marginRight: '1rem',
    zIndex: 10,
  },
  navLinks: {
    display: isMobile && !mobileNavOpen ? 'none' : 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    flexDirection: isMobile ? 'column' : 'row',
    width: isMobile ? '100%' : 'auto',
    position: isMobile ? 'absolute' : 'static',
    top: isMobile ? '100%' : 'auto',
    left: 0,
    backgroundColor: colors.pageBg,
    padding: isMobile ? '0.75rem 0.5rem' : 0,
    boxShadow: isMobile ? shadows.card : 'none',
    zIndex: 999,
    maxHeight: isMobile ? 'calc(100vh - 60px)' : 'auto',
    overflowY: isMobile ? 'auto' : 'visible',
  },
  navButton: {
    background: 'none',
    border: 'none',
    padding: '0.5rem 1rem',
    color: colors.dark,
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
    width: isMobile ? '100%' : 'auto',
    textAlign: 'left',
  },
  navButtonActive: {
    backgroundColor: colors.primary,
    color: '#fff',
  },
  section: {
    padding: isMobile ? '0 1rem 3rem 1rem' : '0 1rem 4rem 1rem',
    position: 'relative',
    flex: 1
  },
  sectionContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  title: {
    fontSize: isMobile ? '1.8rem' : '2.5rem',
    fontWeight: 'bold',
    marginBottom: isMobile ? '2rem' : '3rem',
    color: colors.dark,
    borderBottom: `2px solid ${colors.primary}`,
    paddingBottom: '0.5rem'
  },
  profileContainer: {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'center' : 'flex-start',
    gap: isMobile ? '1rem' : '2rem',
    marginBottom: '2rem',
    paddingTop: '2rem',
    textAlign: isMobile ? 'center' : 'left',
  },
  profileImage: {
    flex: '0 0 auto',
  },
  placeholderImage: {
    width: isMobile ? '100px' : '120px',
    height: isMobile ? '100px' : '120px',
    borderRadius: '50%',
    backgroundColor: colors.primary,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: isMobile ? '2rem' : '2.5rem',
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: '1',
    width: isMobile ? '100%' : 'auto',
  },
  profileName: {
    fontSize: isMobile ? '2rem' : '2.5rem',
    marginBottom: '0.5rem',
    color: colors.dark
  },
  profileTitle: {
    fontSize: isMobile ? '1.2rem' : '1.5rem',
    color: colors.primary,
    fontWeight: '400',
    marginBottom: '1rem'
  },
  contactLinks: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: isMobile ? 'center' : 'flex-start',
  },
  contactLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: colors.dark,
    padding: '0.5rem',
    borderRadius: '8px',
    transition: 'background-color 0.3s',
    fontSize: isMobile ? '0.9rem' : '1rem',
    marginBottom: isMobile ? '0.5rem' : 0,
  },
  highlightBox: {
    backgroundColor: colors.highlightBg,
    padding: isMobile ? '1rem' : '1.5rem',
    borderRadius: '8px',
    margin: '2rem 0'
  },
  skillsContainer: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: isMobile ? '1.5rem' : '2rem',
  },
  skillsList: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: isMobile ? '1rem' : '1.5rem',
  },
  experienceCards: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: isMobile ? '1rem' : '1.5rem',
    marginTop: '2rem'
  },
  card: {
    backgroundColor: colors.cardBg,
    padding: isMobile ? '1.25rem' : '1.5rem',
    borderRadius: '8px',
    boxShadow: shadows.card,
    transition: 'transform 0.3s',
  },
  cardHover: {
    transform: 'translateY(-5px)',
  },
  experienceCard: {
    borderLeft: `4px solid ${colors.primary}`,
  },
  educationCard: {
    borderLeft: `4px solid ${colors.dark}`,
  },
  projectCard: {
    borderTop: `4px solid ${colors.accent}`,
  },
  footer: {
    backgroundColor: colors.dark,
    padding: isMobile ? '1.5rem' : '2rem',
    textAlign: 'center',
    color: '#fff',
    marginTop: 'auto'
  },
  chartContainer: {
    width: '100%',
    height: isMobile ? '300px' : '400px',
    marginBottom: '1.5rem',
  },
  scrollToTopButton: {
    display: isMobile ? 'flex' : 'none',
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    backgroundColor: colors.primary,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.fab,
    zIndex: 100,
    border: 'none',
    cursor: 'pointer',
  }
});
