import React, { useState, useEffect, Suspense } from 'react';
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
import { GithubIcon, LinkedinIcon, MailIcon, GlobeIcon } from 'lucide-react';
import OfficeScene from './OfficeScene';
import EnhancedTimeline from './EnhancedTimeline';

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
    height: '100vh',
    zIndex: 1
  },
  contentContainer: {
    position: 'relative',
    zIndex: 2,
    backgroundColor: '#f9f9f9',
    marginTop: '100vh',
    minHeight: '100vh',
    boxShadow: '0 -10px 20px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px 8px 0 0',
    display: 'flex',
    flexDirection: 'column'
  },
  // Updated navigation styles for content container positioning
  navContent: {
    display: 'flex',
    justifyContent: 'center',
    padding: '1rem',
    position: 'sticky',
    top: 0,
    backgroundColor: '#f9f9f9',
    zIndex: 10,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px 8px 0 0',
  },
  navLinks: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  navButton: {
    background: 'none',
    border: 'none',
    padding: '0.5rem 1rem',
    color: '#2c3e50',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
  navButtonActive: {
    backgroundColor: '#3498db',
    color: '#fff',
  },
  section: {
    padding: '0 1rem 4rem 1rem',
    position: 'relative',
    flex: 1
  },
  sectionContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '3rem',
    color: '#2c3e50',
    borderBottom: '2px solid #3498db',
    paddingBottom: '0.5rem'
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    marginBottom: '2rem',
    paddingTop: '2rem'
  },
  profileImage: {
    flex: '0 0 120px',
  },
  placeholderImage: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '2.5rem',
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: '1',
  },
  profileName: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
    color: '#2c3e50'
  },
  profileTitle: {
    fontSize: '1.5rem',
    color: '#3498db',
    fontWeight: '400',
    marginBottom: '1rem'
  },
  contactLinks: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  contactLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: '#2c3e50',
    padding: '0.5rem',
    borderRadius: '8px',
    transition: 'background-color 0.3s'
  },
  highlightBox: {
    backgroundColor: '#ecf0f1',
    padding: '1.5rem',
    borderRadius: '8px',
    margin: '2rem 0'
  },
  skillsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  skillsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
  },
  experienceCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem'
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
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
    padding: '2rem',
    textAlign: 'center',
    color: '#fff',
    marginTop: 'auto'
  },
};

const PortfolioTemplate = () => {
  const [activeSection, setActiveSection] = useState('profile');

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

  return (
    <div style={styles.mainContainer}>
      
      {/* Fixed 3D Scene */}
      <div style={styles.sceneContainer}>
        <Suspense fallback={null}>
          <OfficeScene />
        </Suspense>
        <div className="scroll-prompt" style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          color: '#fff',
          cursor: 'pointer'
        }}
        onClick={() => {
          document.querySelector('#cv-content')?.scrollIntoView({behavior:'smooth'});
        }}
        >
          <p style={{ marginBottom: '1rem' }}>Scroll /click to explore</p>
          <div>↓</div>
        </div>
        </div>
      
      {/* Scrollable Content */}
      <div style={styles.contentContainer}>
        {/* Navigation moved to the content container */}
        <div style={styles.navContent}>
          <div style={styles.navLinks}>
            <button 
              onClick={() => setActiveSection('profile')}
              style={{
                ...styles.navButton,
                ...(activeSection === 'profile' ? styles.navButtonActive : {})
              }}
            >
              Profile
            </button>
            <button 
              onClick={() => setActiveSection('skills')}
              style={{
                ...styles.navButton,
                ...(activeSection === 'skills' ? styles.navButtonActive : {})
              }}
            >
              Skills
            </button>
            <button 
              onClick={() => setActiveSection('experience')}
              style={{
                ...styles.navButton,
                ...(activeSection === 'experience' ? styles.navButtonActive : {})
              }}
            >
              Experience
            </button>
            <button 
              onClick={() => setActiveSection('education')}
              style={{
                ...styles.navButton,
                ...(activeSection === 'education' ? styles.navButtonActive : {})
              }}
            >
              Education
            </button>
            <button 
              onClick={() => setActiveSection('projects')}
              style={{
                ...styles.navButton,
                ...(activeSection === 'projects' ? styles.navButtonActive : {})
              }}
            >
              Projects
            </button>
            <button 
              onClick={() => setActiveSection('timeline')}
              style={{
                ...styles.navButton,
                ...(activeSection === 'timeline' ? styles.navButtonActive : {})
              }}
            >
              Timeline
            </button>
          </div>
        </div>
        
        <div style={styles.section} id="cv-content">
          <div style={styles.sectionContent}>
            {/* Profile Header - Always visible */}
            <div style={styles.profileContainer}>
              <div style={styles.profileImage}>
                <div style={styles.placeholderImage}>HB</div>
              </div>
              <div style={styles.profileInfo}>
                <h1 style={styles.profileName}>Hein Brouwer</h1>
                <h2 style={styles.profileTitle}>Data Scientist & AR Developer</h2>
                <div style={styles.contactLinks}>
                  <a href="https://github.com/oioi123" target="_blank" rel="noopener noreferrer" style={styles.contactLink}>
                    <GithubIcon size={18} />
                    <span>GitHub</span>
                  </a>
                  <a href="https://www.linkedin.com/in/hein-brouwer-a76793326/" target="_blank" rel="noopener noreferrer" style={styles.contactLink}>
                    <LinkedinIcon size={18} />
                    <span>LinkedIn</span>
                  </a>
                  <a href="http://www.heinbrouwer.com" target="_blank" rel="noopener noreferrer" style={styles.contactLink}>
                    <GlobeIcon size={18} />
                    <span>Portfolio</span>
                  </a>
                  <a href="mailto:contact@heinbrouwer.com" style={styles.contactLink}>
                    <MailIcon size={18} />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Active Section Content */}
            {activeSection === 'profile' && (
              <div>
                <h2 style={styles.title}>Profile</h2>
                <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                  Master's student in Applied Data Science at Utrecht University with expertise in combining data analysis, 
                  machine learning, and interactive technology to develop impactful, user-centered solutions. 
                  Skilled in Python, R, SQL, and various data visualization techniques, with additional experience in 
                  augmented reality and interactive application development using Unity.
                </p>
                <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                  Particularly interested in explainable AI and its applications in enhancing user experience in 
                  data-driven applications. Currently working on evaluating and comparing different chain-of-thought 
                  approaches for large language models across programming, question answering, and sentiment analysis tasks.
                </p>
                
                <div style={styles.highlightBox}>
                  <h3 style={{ color: '#3498db', marginBottom: '1rem', fontSize: '1.35rem' }}>Career Highlights</h3>
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
              <div>
                <h2 style={styles.title}>Skills</h2>
                <div style={styles.skillsContainer}>
                  <div>
                    <h3 style={{ color: '#3498db', marginBottom: '1rem', fontSize: '1.35rem' }}>Technical Proficiency</h3>
                    <ResponsiveContainer width="100%" height={400}>
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
                      <h3 style={{ color: '#3498db', marginBottom: '0.75rem', fontSize: '1.2rem' }}>Programming Languages</h3>
                      <ul style={{ listStyleType: 'none' }}>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>Python</li>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>R</li>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>SQL</li>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>JavaScript</li>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>C#</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 style={{ color: '#3498db', marginBottom: '0.75rem', fontSize: '1.2rem' }}>Data Science</h3>
                      <ul style={{ listStyleType: 'none' }}>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>Statistical Analysis</li>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>Data Visualization</li>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>Applied Machine Learning</li>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>XAI (Explainable AI)</li>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>LIME</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 style={{ color: '#3498db', marginBottom: '0.75rem', fontSize: '1.2rem' }}>Development Tools</h3>
                      <ul style={{ listStyleType: 'none' }}>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>Unity (including shader development)</li>
                        <li style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>React</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 style={{ color: '#3498db', marginBottom: '0.75rem', fontSize: '1.2rem' }}>Languages</h3>
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
              <div>
                <h2 style={styles.title}>Professional Experience</h2>
                <div style={{ marginBottom: '2rem' }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart 
                      data={experienceData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={150} />
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h3 style={{ color: '#2c3e50', marginBottom: '0', fontSize: '1.2rem' }}>{job.name}</h3>
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>{job.period}</span>
                      </div>
                      <div style={{ fontWeight: '500', color: '#3498db', marginBottom: '1rem' }}>{job.company}</div>
                      <p>{job.description}</p>
                    </div>
                  ))}
                  <div style={{ ...styles.card, ...styles.experienceCard, borderLeft: '4px solid #e74c3c', backgroundColor: 'rgba(231, 76, 60, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ color: '#2c3e50', marginBottom: '0', fontSize: '1.2rem' }}>Student Assistant (Upcoming)</h3>
                      <span style={{ fontSize: '0.9rem', color: '#666' }}>Starting September 2025</span>
                    </div>
                    <div style={{ fontWeight: '500', color: '#3498db', marginBottom: '1rem' }}>Utrecht University</div>
                    <p>Will assist with the third-year Information Science course "Data Ethics"</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === 'education' && (
              <div>
                <h2 style={styles.title}>Education</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                  {educationData.map((edu, index) => (
                    <div style={{ ...styles.card, ...styles.educationCard }} key={index}>
                      <h3 style={{ color: '#3498db', marginBottom: '0.5rem', fontSize: '1.2rem' }}>{edu.degree}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontWeight: '500', color: '#3498db' }}>{edu.institution}</span>
                        <span style={{ color: '#666' }}>{edu.period}</span>
                      </div>
                      <p>{edu.description}</p>
                    </div>
                  ))}
                </div>
                
                <div style={{ backgroundColor: '#ecf0f1', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#3498db', marginBottom: '1rem', fontSize: '1.35rem' }}>Bachelor Thesis Highlight</h3>
                  <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Investigating the Effects of Model Explanations in Emotion-Based Music Recommendations for Journaling Apps</h4>
                  <div style={{ display: 'inline-block', backgroundColor: '#3498db', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.9rem', marginBottom: '1rem' }}>Grade: 8.0</div>
                  <p>
                    Researched real-time "black-box" model explanations (LIME) and analyzed their influence on user experience.
                    All research code was shared publicly on GitHub.
                  </p>
                </div>
                
                <div style={{ backgroundColor: '#ecf0f1', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#3498db', marginBottom: '1rem', fontSize: '1.35rem' }}>Master Thesis (Upcoming)</h3>
                  <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Chain of Thought Approaches for LLMs</h4>
                  <p>
                    Evaluating and comparing different chain-of-thought approaches for large language models across programming,
                    question answering, and sentiment analysis tasks.
                  </p>
                </div>
              </div>
            )}
            
            {activeSection === 'projects' && (
              <div>
                <h2 style={styles.title}>Projects</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {projectData.map((project, index) => (
                    <div style={{ ...styles.card, ...styles.projectCard }} key={index}>
                      <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem', fontSize: '1.2rem' }}>{project.title}</h3>
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
                <EnhancedTimeline />
                
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ color: '#3498db', marginBottom: '1rem', fontSize: '1.35rem' }}>Leadership & Volunteering Experience</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div style={styles.card}>
                      <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Treasurer, Diescomissie Board</h4>
                      <ul style={{ marginLeft: '1.25rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Organized events for 300+ attendees</li>
                        <li style={{ marginBottom: '0.5rem' }}>Managed a budget of €50,000</li>
                        <li style={{ marginBottom: '0.5rem' }}>Demonstrated financial responsibility and event planning skills</li>
                      </ul>
                    </div>
                    <div style={styles.card}>
                      <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Fundraising Committee Member</h4>
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
      
      {/* Animation styles for the bobbing effect */}
      <style jsx>{`
        .scroll-prompt {
          animation: bobbing 1.5s ease-in-out infinite;
        }
        
        @keyframes bobbing {
          0%, 100% { transform: translateY(0) translateX(-50%); }
          50% { transform: translateY(-10px) translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default PortfolioTemplate;