import { projectData } from '../../data/portfolioData';
import { colors } from '../../theme';

const ProjectsSection = ({ styles, isMobile }) => (
  <div id="projects-section">
    <h2 style={styles.title}>Projects</h2>
    <div style={styles.experienceCards}>
      {projectData.map((project, index) => (
        <div style={{ ...styles.card, ...styles.projectCard }} key={index}>
          <h3 style={{ color: colors.dark, marginBottom: '0.5rem', fontSize: isMobile ? '1.1rem' : '1.2rem' }}>{project.title}</h3>
          <div style={{ display: 'inline-block', backgroundColor: colors.accent, color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.9rem', marginBottom: '1rem' }}>{project.year}</div>
          <p>{project.description}</p>
          <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {project.skills.map((skill, i) => (
              <span style={{ backgroundColor: colors.highlightBg, padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.9rem' }} key={i}>{skill}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ProjectsSection;
