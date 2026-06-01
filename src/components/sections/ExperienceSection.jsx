import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { experienceData } from '../../data/portfolioData';

const ExperienceSection = ({ styles, isMobile }) => {
  const cardHeader = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem'
  };
  const jobTitle = {
    color: '#2c3e50',
    marginBottom: isMobile ? '0.25rem' : '0',
    fontSize: isMobile ? '1.1rem' : '1.2rem'
  };

  return (
    <div id="experience-section">
      <h2 style={styles.title}>Professional Experience</h2>
      <div style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={experienceData}
            layout="vertical"
            margin={{ top: 20, right: isMobile ? 10 : 30, left: isMobile ? 100 : 150, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={isMobile ? 100 : 150}
              tick={{ fontSize: isMobile ? 12 : 14 }}
            />
            <Tooltip
              formatter={(value) => [`${value} months`, 'Duration']}
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
            <div style={cardHeader}>
              <h3 style={jobTitle}>{job.name}</h3>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>{job.period}</span>
            </div>
            <div style={{ fontWeight: '500', color: '#3498db', marginBottom: '1rem' }}>{job.company}</div>
            <p>{job.description}</p>
          </div>
        ))}
        <div style={{ ...styles.card, ...styles.experienceCard, borderLeft: '4px solid #e74c3c', backgroundColor: 'rgba(231, 76, 60, 0.05)' }}>
          <div style={cardHeader}>
            <h3 style={jobTitle}>Student Assistant (Upcoming)</h3>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>Starting September 2025</span>
          </div>
          <div style={{ fontWeight: '500', color: '#3498db', marginBottom: '1rem' }}>Utrecht University</div>
          <p>Will assist with the third-year Information Science course "Data Ethics"</p>
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;
