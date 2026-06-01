import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { skillsData } from '../../data/portfolioData';

const listItem = { marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' };

const SkillsSection = ({ styles, isMobile }) => {
  const heading = { color: '#3498db', marginBottom: '0.75rem', fontSize: isMobile ? '1.1rem' : '1.2rem' };

  return (
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
            <h3 style={heading}>Programming Languages</h3>
            <ul style={{ listStyleType: 'none' }}>
              <li style={listItem}>Python</li>
              <li style={listItem}>R</li>
              <li style={listItem}>SQL</li>
              <li style={listItem}>JavaScript</li>
              <li style={listItem}>C#</li>
            </ul>
          </div>

          <div>
            <h3 style={heading}>Data Science</h3>
            <ul style={{ listStyleType: 'none' }}>
              <li style={listItem}>Statistical Analysis</li>
              <li style={listItem}>Data Visualization</li>
              <li style={listItem}>Applied Machine Learning</li>
              <li style={listItem}>XAI (Explainable AI)</li>
              <li style={listItem}>LIME</li>
            </ul>
          </div>

          <div>
            <h3 style={heading}>Development Tools</h3>
            <ul style={{ listStyleType: 'none' }}>
              <li style={listItem}>Unity (including shader development)</li>
              <li style={listItem}>React</li>
            </ul>
          </div>

          <div>
            <h3 style={heading}>Languages</h3>
            <ul style={{ listStyleType: 'none' }}>
              <li style={listItem}>Dutch (Native)</li>
              <li style={listItem}>English (Fluent)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
