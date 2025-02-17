import React, { useState, useEffect, Suspense } from 'react';
import OfficeScene from './OfficeScene';

const styles = {
  mainContainer: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    color: '#FFD717',
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
    backgroundColor: '#001F3F',
    marginTop: '100vh',
    boxShadow: '0 -10px 20px rgba(0, 31, 63, 0.5)'
  },
  nav: {
    position: 'fixed',
    width: '100%',
    zIndex: 50,
    transition: 'all 0.3s',
    padding: '1rem',
  },
  navScrolled: {
    backgroundColor: '#083358',
    padding: '0.5rem 1rem',
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
  },
  link: {
    color: '#FFD717',
    textDecoration: 'none',
    ':hover': {
      opacity: 0.8,
    },
  },
  heroSection: {
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
  heroContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  scrollPrompt: {
    position: 'absolute',
    bottom: '2.5rem',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    animation: 'bounce 1s infinite',
  },
  section: {
    minHeight: '100vh',
    padding: '5rem 1rem',
    position: 'relative',
  },
  sectionBlue: {
    backgroundColor: '#083358',
  },
  sectionContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '3rem',
  },
  aboutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '3rem',
    alignItems: 'center',
  },
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginTop: '1rem',
  },
  skillBadge: {
    padding: '0.5rem 1rem',
    backgroundColor: '#0DA574',
    borderRadius: '9999px',
  },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  projectCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '0.5rem',
    backgroundColor: '#083358',
  },
  projectImage: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
  },
  projectOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(8, 51, 88, 0.9)',
    opacity: 0,
    transition: 'opacity 0.3s',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '1.5rem',
    ':hover': {
      opacity: 1,
    },
  },
  form: {
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#001F3F',
    border: 'none',
    borderRadius: '0.5rem',
    color: '#FFD717',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#0DA574',
    border: 'none',
    borderRadius: '0.5rem',
    color: '#FFD717',
    cursor: 'pointer',
    ':hover': {
      opacity: 0.9,
    },
  },
  footer: {
    backgroundColor: '#001F3F',
    padding: '2rem',
    textAlign: 'center',
  },
};

const GrainOverlay = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    opacity: 0.2,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
    mixBlendMode: 'multiply',
  }} />
);

const PortfolioTemplate = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={styles.mainContainer}>
      
      
      {/* Fixed 3D Scene */}
      <div style={styles.sceneContainer}>
        <Suspense fallback={null}>
          <OfficeScene />
        </Suspense>
        <div style={styles.scrollPrompt}>
          <p style={{ marginBottom: '1rem' }}>Scroll to explore</p>
          <div>↓</div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav style={{...styles.nav, ...(isScrolled ? styles.navScrolled : {})}}>
        <div style={styles.navContent}>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Hein Brouwer</span>
          <div style={styles.navLinks}>
            <a href="#about" style={styles.link}>About</a>
            <a href="#projects" style={styles.link}>Projects</a>
            <a href="#contact" style={styles.link}>Contact</a>
          </div>
        </div>
      </nav>

      {/* Scrollable Content */}
      <div style={styles.contentContainer}>
      <section id="about" style={{ ...styles.section, ...styles.sectionBlue }}>
        <div style={styles.sectionContent}>
          <h2 style={styles.title}>About Me</h2>
          <div style={styles.aboutGrid}>
            <div>
              <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
                I'm a passionate developer with expertise in creating immersive web experiences.
                My journey in tech began with a curiosity for 3D web applications and has evolved
                into crafting sophisticated digital solutions.
              </p>
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Skills</h3>
                <div style={styles.skillsContainer}>
                  {['Python', 'R', 'SQL', 'React', 'Unity'].map((skill) => (
                    <span key={skill} style={styles.skillBadge}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ position: 'relative', height: '400px' }}>
              <div style={{ 
                position: 'absolute',
                inset: 0,
                backgroundColor: '#0DA574',
                borderRadius: '0.5rem',
                transform: 'rotate(3deg)',
              }} />
              <div style={{ 
                position: 'absolute',
                inset: 0,
                backgroundColor: '#001F3F',
                borderRadius: '0.5rem',
              }}>
                <img
                  src="/public/photos/ik.jpg"
                  alt="Profile"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" style={styles.section}>
        <div style={styles.sectionContent}>
          <h2 style={styles.title}>Featured Projects</h2>
          <div style={styles.projectsGrid}>
            {[1, 2, 3].map((project) => (
              <div key={project} style={styles.projectCard}>
                <img
                  src="/api/placeholder/400/384"
                  alt={`Project ${project}`}
                  style={styles.projectImage}
                />
                <div style={styles.projectOverlay}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Project Title
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    Brief project description showcasing key features and technologies used.
                  </p>
                  <button style={styles.button}>
                    View Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" style={{ ...styles.section, ...styles.sectionBlue }}>
        <div style={styles.sectionContent}>
          <h2 style={styles.title}>Get in Touch</h2>
          <form style={styles.form}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
              <input type="text" style={styles.input} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
              <input type="email" style={styles.input} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Message</label>
              <textarea rows="5" style={styles.input}></textarea>
            </div>
            <button type="submit" style={styles.button}>
              Send Message
            </button>
          </form>
        </div>
      </section>

        <footer style={styles.footer}>
          <p>&copy; {new Date().getFullYear()} Hein Brouwer</p>
        </footer>
      </div>
    </div>
  );
};

export default PortfolioTemplate;