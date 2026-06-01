import React, { useState, useEffect, Suspense, useRef } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { GithubIcon, LinkedinIcon, MailIcon, GlobeIcon, Menu, X } from 'lucide-react';
import OfficeScene from './OfficeScene';
import EnhancedTimeline from './EnhancedTimeline';

const PortfolioTemplate = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isMobile, setIsMobile] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sceneQuality, setSceneQuality] = useState('high'); // 'high', 'medium', 'low'
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(false); // Track nav visibility for fade effect
  const contentRef = useRef(null);
  const navRef = useRef(null);
  
  // Define mobile nav height to use for padding adjustments
  const mobileNavHeight = 60;

  // Check if device is mobile based on screen width and handle scroll effects
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Auto-detect device capabilities and set appropriate scene quality
    const detectDeviceCapabilities = () => {
      // Check if device is low-powered (most mobile devices)
      if (window.innerWidth < 768 || 
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        setSceneQuality('low');
      } else if (window.innerWidth < 1200) {
        setSceneQuality('medium');
      } else {
        setSceneQuality('high');
      }
    };
    
    detectDeviceCapabilities();
    
    // Add scroll event listener for nav effects
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Show/hide the navigation based on scroll position
      if (scrollTop > 100) {
        setIsNavVisible(true);
        
        // If we've scrolled more than 100px into the content
        if (contentRef.current && scrollTop > contentRef.current.offsetTop + 100) {
          setIsNavScrolled(true);
        } else {
          setIsNavScrolled(false);
        }
      } else {
        // Hide navigation when close to the top
        setIsNavVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle section change and scroll position
  const handleSectionChange = (section) => {
    setActiveSection(section);
    setMobileNavOpen(false);
    
    // Calculate scroll position - if on mobile, account for the fixed header
    if (contentRef.current) {
      const yOffset = isMobile ? -mobileNavHeight : 0;
      const element = document.getElementById(section + '-section');
      if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
      } else {
        // If specific section element isn't found, scroll to the content container
        contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Data for CV sections
  const skillsData = [
    { subject: 'Python', A: 95, fullMark: 100 },
    { subject: 'R', A: 95, fullMark: 100 },
    { subject: 'Data Analysis', A: 85, fullMark: 100 },
    { subject: 'Machine Learning', A: 80, fullMark: 100 },
    { subject: 'Unity/AR', A: 70, fullMark: 100 },
    { subject: 'SQL', A: 70, fullMark: 100 },
    { subject: 'JavaScript/React', A: 65, fullMark: 100 },
    { subject: 'C#', A: 60, fullMark: 100 },
  ];
  
  const experienceData = [
    { 
      name: 'Student Assistant', 
      company: 'Utrecht University', 
      period: 'Feb 2025 - Present',
      duration: 2,
      description: 'Teaching assistant for the course "User Experience and User Design"'
    },
    { 
      name: 'App Developer', 
      company: 'boasmedia', 
      period: 'Jan 2025 - Feb 2025',
      duration: 2,
      description: 'Interactive 360-degree video experience of Zeisterbos'
    },
    { 
      name: 'App Developer', 
      company: 'boasmedia', 
      period: 'Jun 2024 - Aug 2024',
      duration: 3,
      description: 'AR walking tour along the Utrecht water line'
    },
    { 
      name: 'Customer Service', 
      company: 'Pathé', 
      period: 'Mar 2022 - Nov 2023',
      duration: 20,
      description: 'Customer service representative in cinema environment'
    }
  ];
  
  const educationData = [
    {
      degree: 'MSc Applied Data Science',
      institution: 'Utrecht University',
      period: '2024 - 2025',
      description: 'Focus on chain-of-thought approaches for LLMs',
      duration: 12,
    },
    {
      degree: 'BSc Information Science',
      institution: 'Utrecht University',
      period: '2020 - 2024',
      description: 'Thesis on model explanations in emotion-based music recommendations',
      duration: 48,
    },
    {
      degree: 'Atheneum',
      institution: 'Atheneum College Hageveld',
      period: '2012 - 2019',
      description: 'Got my VWO highschool diploma',
      duration: 94,
    }
  ];
  
  const projectData = [
    {
      title: "AR Walking Tour (Utrecht Water Line)",
      description: "Interactive walking tour with AR scenes along the Utrecht water line.",
      skills: ["Unity", "AR", "C#", "3D Modeling"],
      year: 2024
    },
    {
      title: "360° Bison Field Experience",
      description: "Interactive 360-degree video comparing past and present of the bison field in Zeisterbos.",
      skills: ["Unity", "360° Video", "JavaScript"],
      year: 2025
    },
    {
      title: "Music Recommendation System",
      description: "Emotion-based music recommendation system with LIME explanations for journaling apps.",
      skills: ["Python", "Machine Learning", "XAI", "LIME"],
      year: 2024
    }
  ];

  // Responsive styles with mobile considerations
  const styles = {
    mainContainer: {
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      color: '#333',
      position: 'relative',
      overflowX: 'hidden'
    },
    sceneContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh', // Full height for both mobile and desktop
      zIndex: 1
    },
    contentContainer: {
      position: 'relative',
      zIndex: 2,
      backgroundColor: '#f9f9f9',
      marginTop: '100vh', // Full height for both mobile and desktop
      minHeight: '100vh',
      boxShadow: '0 -10px 20px rgba(0, 0, 0, 0.2)',
      borderRadius: '16px 16px 0 0', // More pronounced curve on mobile
      display: 'flex',
      flexDirection: 'column',
      paddingTop: mobileNavHeight // Add padding to accommodate the fixed header
    },
    // Fixed navigation at the top of the screen
    stickyNav: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      backgroundColor: 'rgba(249, 249, 249, 0.95)',
      zIndex: 100,
      boxShadow: isNavScrolled ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
      transition: 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
      opacity: isNavVisible ? 1 : 0,
      transform: isNavVisible ? 'translateY(0)' : 'translateY(-100%)',
      pointerEvents: isNavVisible ? 'auto' : 'none', // Disable interactions when hidden
      borderRadius: '0 0 16px 16px',
    },
    // Mobile-friendly navigation
    navContent: {
      display: 'flex',
      justifyContent: 'center',
      padding: '0.75rem',
      flexDirection: isMobile ? 'column' : 'row',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
    },
    // Mobile-friendly navigation with improved dropdown and fixed positioning
    mobileMenuButton: {
      display: isMobile ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.5rem',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      alignSelf: 'flex-end', // Position at the right side
      marginRight: '1rem',
      zIndex: 10,
    },
    navLinks: {
      display: 'flex',
      gap: '0.75rem',
      flexWrap: 'wrap',
      flexDirection: isMobile ? 'column' : 'row',
      width: isMobile ? '100%' : 'auto',
      // Mobile nav menu
      position: isMobile ? 'absolute' : 'static',
      top: isMobile ? '100%' : 'auto',
      left: 0,
      backgroundColor: '#f9f9f9',
      padding: isMobile ? '0.75rem 0.5rem' : 0,
      boxShadow: isMobile ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
      // Hide when closed on mobile
      display: isMobile && !mobileNavOpen ? 'none' : 'flex',
      zIndex: 999,
      maxHeight: isMobile ? 'calc(100vh - 60px)' : 'auto',
      overflowY: isMobile ? 'auto' : 'visible',
    },
    navButton: {
      background: 'none',
      border: 'none',
      padding: '0.5rem 1rem',
      color: '#2c3e50',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'background-color 0.3s',
      width: isMobile ? '100%' : 'auto',
      textAlign: 'left',
    },
    navButtonActive: {
      backgroundColor: '#3498db',
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
      width: '100%', // Ensure full width on small screens
    },
    title: {
      fontSize: isMobile ? '1.8rem' : '2.5rem',
      fontWeight: 'bold',
      marginBottom: isMobile ? '2rem' : '3rem',
      color: '#2c3e50',
      borderBottom: '2px solid #3498db',
      paddingBottom: '0.5rem'
    },
    // Mobile-responsive profile
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
      backgroundColor: '#3498db',
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
      color: '#2c3e50'
    },
    profileTitle: {
      fontSize: isMobile ? '1.2rem' : '1.5rem',
      color: '#3498db',
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
      color: '#2c3e50',
      padding: '0.5rem',
      borderRadius: '8px',
      transition: 'background-color 0.3s',
      // Adjust for touch targets on mobile
      fontSize: isMobile ? '0.9rem' : '1rem',
      marginBottom: isMobile ? '0.5rem' : 0,
    },
    highlightBox: {
      backgroundColor: '#ecf0f1',
      padding: isMobile ? '1rem' : '1.5rem',
      borderRadius: '8px',
      margin: '2rem 0'
    },
    // Responsive grids
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
      backgroundColor: 'white',
      padding: isMobile ? '1.25rem' : '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s',
    },
    cardHover: {
      transform: 'translateY(-5px)',
    },
    experienceCard: {
      borderLeft: '4px solid #3498db',
    },
    educationCard: {
      borderLeft: '4px solid #2c3e50',
    },
    projectCard: {
      borderTop: '4px solid #e74c3c',
    },
    footer: {
      backgroundColor: '#2c3e50',
      padding: isMobile ? '1.5rem' : '2rem',
      textAlign: 'center',
      color: '#fff',
      marginTop: 'auto'
    },
    // Mobile-specific chart container
    chartContainer: {
      width: '100%',
      height: isMobile ? '300px' : '400px',
      marginBottom: '1.5rem',
    },
    // Floating action scroll button for mobile
    scrollToTopButton: {
      display: isMobile ? 'flex' : 'none',
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      width: '3rem',
      height: '3rem',
      borderRadius: '50%',
      backgroundColor: '#3498db',
      color: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      zIndex: 100,
      border: 'none',
      cursor: 'pointer',
    }
  };

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div style={styles.mainContainer}>
      {/* Sticky Navigation that fades in on scroll */}
      <nav 
        ref={navRef} 
        style={styles.stickyNav}
        className={isNavScrolled ? 'nav-scrolled' : ''}
      >
        <div style={styles.navContent}>
          {/* Mobile menu button */}
          <button 
            style={styles.mobileMenuButton}
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
          >
            {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Navigation links */}
          <div style={styles.navLinks}>
            {['profile', 'skills', 'experience', 'education', 'projects', 'timeline'].map(section => (
              <button 
                key={section}
                onClick={() => handleSectionChange(section)}
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
      
      {/* Fixed 3D Scene - Height reduced on mobile */}
      <div style={styles.sceneContainer}>
        <Suspense fallback={null}>
          <OfficeScene qualityLevel={sceneQuality} isMobile={isMobile} />
        </Suspense>
        
        {/* Enhanced scroll prompt for better visibility on full-screen mobile */}
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
            backgroundColor: 'rgba(0,0,0,0.5)', // Darker background for better visibility
            padding: isMobile ? '0.75rem 1.5rem' : '0.5rem 1rem',
            borderRadius: '30px',
            fontSize: isMobile ? '1.1rem' : 'inherit',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)', // Add shadow for better visibility
            zIndex: 5,
          }}
          onClick={() => {
            // Scroll to content with offset for fixed header on mobile
            const yOffset = isMobile ? -mobileNavHeight : 0;
            const element = document.getElementById('cv-content');
            if (element) {
              const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({top: y, behavior: 'smooth'});
            }
          }}
        >
          <p style={{ marginBottom: isMobile ? '0.5rem' : '1rem', fontWeight: 'bold' }}>
            {isMobile ? 'Click to view portifolio' : 'Scroll/click to view portifolio'}
          </p>
          <div style={{ fontSize: isMobile ? '1.5rem' : '1.2rem', fontWeight: 'bold' }}>↓</div>
        </div>
      </div>
      
      {/* Scrollable Content - Starts earlier on mobile */}
      <div style={styles.contentContainer} ref={contentRef} id="cv-content">
        <div style={styles.section}>
          <div style={styles.sectionContent}>
            {/* Profile Header - Responsive layout for mobile */}
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

            {/* Active Section Content */}
            {activeSection === 'profile' && (
              <div id="profile-section">
                <h2 style={styles.title}>Profile</h2>
                <p style={{ marginBottom: '1.5rem', fontSize: isMobile ? '1rem' : '1.1rem' }}>
                  Master's student in Applied Data Science at Utrecht University with expertise in combining data analysis, 
                  machine learning, and interactive technology to develop impactful, user-centered solutions. 
                  Skilled in Python, R, SQL, and various data visualization techniques, with additional experience in 
                  augmented reality and interactive application development using Unity.
                </p>
                <p style={{ marginBottom: '1.5rem', fontSize: isMobile ? '1rem' : '1.1rem' }}>
                  Particularly interested in explainable AI and its applications in enhancing user experience in 
                  data-driven applications. Currently working on evaluating and comparing different chain-of-thought 
                  approaches for large language models across programming, question answering, and sentiment analysis tasks.
                </p>
                
                <div style={styles.highlightBox}>
                  <h3 style={{ color: '#3498db', marginBottom: '1rem', fontSize: isMobile ? '1.2rem' : '1.35rem' }}>Career Highlights</h3>
                  <ul style={{ marginLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Developed multiple AR applications for interactive walking experiences</li>
                    <li style={{ marginBottom: '0.5rem' }}>Teaching assistant for Information Science courses at Utrecht University</li>
                    <li style={{ marginBottom: '0.5rem' }}>Bachelor thesis on model explanations in emotion-based music recommendations (Grade: 8.0)</li>
                    <li style={{ marginBottom: '0.5rem' }}>Managed a €50,000 budget as Treasurer of the Diescomissie Board</li>
                    <li style={{ marginBottom: '0.5rem' }}>Raised over €2,400 for "Oog voor Utrecht" charity</li>
                  </ul>
                </div>
              </div>
            )}
            
            {activeSection === 'skills' && (
              <div id="skills-section">
                <h2 style={styles.title}>Skills</h2>
                <div style={styles.skillsContainer}>
                  <div style={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Skills" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div style={styles.skillsList}>
                    <div>
                      <h3 style={{ color: '#3498db', marginBottom: '0.75rem', fontSize: isMobile ? '1.1rem' : '1.2rem' }}>Programming Languages</h3>
                      <ul style={{ listStyleType: 'none' }}>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>Python</li>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>R</li>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>SQL</li>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>JavaScript</li>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>C#</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 style={{ color: '#3498db', marginBottom: '0.75rem', fontSize: isMobile ? '1.1rem' : '1.2rem' }}>Data Science</h3>
                      <ul style={{ listStyleType: 'none' }}>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>Statistical Analysis</li>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>Data Visualization</li>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>Applied Machine Learning</li>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>XAI (Explainable AI)</li>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>LIME</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 style={{ color: '#3498db', marginBottom: '0.75rem', fontSize: isMobile ? '1.1rem' : '1.2rem' }}>Development Tools</h3>
                      <ul style={{ listStyleType: 'none' }}>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>Unity (including shader development)</li>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>React</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 style={{ color: '#3498db', marginBottom: '0.75rem', fontSize: isMobile ? '1.1rem' : '1.2rem' }}>Languages</h3>
                      <ul style={{ listStyleType: 'none' }}>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>Dutch (Native)</li>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>English (Fluent)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
 {activeSection === 'experience' && (
              <div id="experience-section">
                <h2 style={styles.title}>Professional Experience</h2>
                <div style={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={experienceData}
                      layout="vertical"
                      margin={{ 
                        top: 20, 
                        right: isMobile ? 10 : 30, 
                        left: isMobile ? 100 : 150, 
                        bottom: 5 
                      }}
                    >
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={isMobile ? 100 : 150} 
                        tick={{ fontSize: isMobile ? 12 : 14 }}
                      />
                      <Tooltip 
                        formatter={(value, name, props) => [`${value} months`, 'Duration']}
                        labelFormatter={(index) => {
                          if (index !== undefined && experienceData[index]) {
                            return experienceData[index].company;
                          }
                          return '';
                        }}
                      />
                      <Bar dataKey="duration" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div style={styles.experienceCards}>
                  {experienceData.map((job, index) => (
                    <div style={{ ...styles.card, ...styles.experienceCard }} key={index}>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'space-between', 
                        alignItems: isMobile ? 'flex-start' : 'flex-start', 
                        marginBottom: '0.5rem' 
                      }}>
                        <h3 style={{ color: '#2c3e50', marginBottom: isMobile ? '0.25rem' : '0', fontSize: isMobile ? '1.1rem' : '1.2rem' }}>{job.name}</h3>
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>{job.period}</span>
                      </div>
                      <div style={{ fontWeight: '500', color: '#3498db', marginBottom: '1rem' }}>{job.company}</div>
                      <p>{job.description}</p>
                    </div>
                  ))}
                  <div style={{ ...styles.card, ...styles.experienceCard, borderLeft: '4px solid #e74c3c', backgroundColor: 'rgba(231, 76, 60, 0.05)' }}>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: isMobile ? 'column' : 'row',
                      justifyContent: 'space-between', 
                      alignItems: isMobile ? 'flex-start' : 'flex-start', 
                      marginBottom: '0.5rem' 
                    }}>
                      <h3 style={{ color: '#2c3e50', marginBottom: isMobile ? '0.25rem' : '0', fontSize: isMobile ? '1.1rem' : '1.2rem' }}>Student Assistant (Upcoming)</h3>
                      <span style={{ fontSize: '0.9rem', color: '#666' }}>Starting September 2025</span>
                    </div>
                    <div style={{ fontWeight: '500', color: '#3498db', marginBottom: '1rem' }}>Utrecht University</div>
                    <p>Will assist with the third-year Information Science course "Data Ethics"</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === 'education' && (
              <div id="education-section">
                <h2 style={styles.title}>Education</h2>
                <div style={styles.experienceCards}>
                  {educationData.map((edu, index) => (
                    <div style={{ ...styles.card, ...styles.educationCard }} key={index}>
                      <h3 style={{ color: '#3498db', marginBottom: '0.5rem', fontSize: isMobile ? '1.1rem' : '1.2rem' }}>{edu.degree}</h3>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'space-between', 
                        marginBottom: '1rem' 
                      }}>
                        <span style={{ fontWeight: '500', color: '#3498db' }}>{edu.institution}</span>
                        <span style={{ color: '#666' }}>{edu.period}</span>
                      </div>
                      <p>{edu.description}</p>
                    </div>
                  ))}
                </div>
                
                <div style={{ backgroundColor: '#ecf0f1', padding: isMobile ? '1.25rem' : '1.5rem', borderRadius: '8px', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#3498db', marginBottom: '1rem', fontSize: isMobile ? '1.2rem' : '1.35rem' }}>Bachelor Thesis Highlight</h3>
                  <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem', fontSize: isMobile ? '1rem' : '1.1rem' }}>Investigating the Effects of Model Explanations in Emotion-Based Music Recommendations for Journaling Apps</h4>
                  <div style={{ display: 'inline-block', backgroundColor: '#3498db', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.9rem', marginBottom: '1rem' }}>Grade: 8.0</div>
                  <p>
                    Researched real-time "black-box" model explanations (LIME) and analyzed their influence on user experience.
                    All research code was shared publicly on GitHub.
                  </p>
                </div>
                
                <div style={{ backgroundColor: '#ecf0f1', padding: isMobile ? '1.25rem' : '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#3498db', marginBottom: '1rem', fontSize: isMobile ? '1.2rem' : '1.35rem' }}>Master Thesis (Upcoming)</h3>
                  <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem', fontSize: isMobile ? '1rem' : '1.1rem' }}>Chain of Thought Approaches for LLMs</h4>
                  <p>
                    Evaluating and comparing different chain-of-thought approaches for large language models across programming,
                    question answering, and sentiment analysis tasks.
                  </p>
                </div>
              </div>
            )}
            
            {activeSection === 'projects' && (
              <div id="projects-section">
                <h2 style={styles.title}>Projects</h2>
                <div style={styles.experienceCards}>
                  {projectData.map((project, index) => (
                    <div style={{ ...styles.card, ...styles.projectCard }} key={index}>
                      <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem', fontSize: isMobile ? '1.1rem' : '1.2rem' }}>{project.title}</h3>
                      <div style={{ display: 'inline-block', backgroundColor: '#e74c3c', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.9rem', marginBottom: '1rem' }}>{project.year}</div>
                      <p>{project.description}</p>
                      <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {project.skills.map((skill, i) => (
                          <span style={{ backgroundColor: '#ecf0f1', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.9rem' }} key={i}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeSection === 'timeline' && (
              <div>
                {/* Wrap EnhancedTimeline in a div with height constraint for mobile */}
                <div style={{ 
                  overflowX: isMobile ? 'auto' : 'visible', 
                  paddingBottom: isMobile ? '1rem' : 0
                }}>
                  <EnhancedTimeline isMobile={isMobile} />
                </div>
                
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ color: '#3498db', marginBottom: '1rem', fontSize: isMobile ? '1.2rem' : '1.35rem' }}>Leadership & Volunteering Experience</h3>
                  <div style={styles.experienceCards}>
                    <div style={styles.card}>
                      <h4 style={{ color: '#2c3e50', marginBottom: '1rem', fontSize: isMobile ? '1rem' : '1.1rem' }}>Treasurer, Diescomissie Board</h4>
                      <ul style={{ marginLeft: '1.25rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Organized events for 300+ attendees</li>
                        <li style={{ marginBottom: '0.5rem' }}>Managed a budget of €50,000</li>
                        <li style={{ marginBottom: '0.5rem' }}>Demonstrated financial responsibility and event planning skills</li>
                      </ul>
                    </div>
                    <div style={styles.card}>
                      <h4 style={{ color: '#2c3e50', marginBottom: '1rem', fontSize: isMobile ? '1rem' : '1.1rem' }}>Fundraising Committee Member</h4>
                      <ul style={{ marginLeft: '1.25rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Raised over €2,400 for "Oog voor Utrecht" charity</li>
                        <li style={{ marginBottom: '0.5rem' }}>Coordinated fundraising initiatives and community outreach</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer style={styles.footer}>
          <p>&copy; {new Date().getFullYear()} Hein Brouwer</p>
        </footer>
      </div>
      
      {/* Mobile-only scroll to top button */}
      {isMobile && (
        <button 
          onClick={scrollToTop}
          style={styles.scrollToTopButton}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
      
      {/* Enhanced animation styles */}
      <style jsx>{`
        .scroll-prompt {
          animation: bobbing 1.5s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        
        .scroll-prompt:hover {
          transform: translateY(-5px) translateX(-50%);
          background-color: rgba(0,0,0,0.7) !important;
        }
        
        @keyframes bobbing {
          0%, 100% { transform: translateY(0) translateX(-50%); }
          50% { transform: translateY(-10px) translateX(-50%); }
        }
        
        /* Improved touch interactions for mobile */
        @media (max-width: 768px) {
          button, a {
            min-height: 44px;
            min-width: 44px;
            display: flex;
            align-items: center;
          }
        }
        
        /* Fade-in animation for nav */
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Add a class for when nav is sticky and scrolled */
        .nav-scrolled {
          box-shadow: 0 4px 12px rgba(0,0,0,0.25) !important;
          background-color: rgba(249, 249, 249, 0.98) !important;
        }
      `}</style>
    </div>
  );
};

export default PortfolioTemplate;