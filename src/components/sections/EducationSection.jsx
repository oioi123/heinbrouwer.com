import { educationData } from '../../data/portfolioData';
import { colors } from '../../theme';

const EducationSection = ({ styles, isMobile }) => {
  const calloutBox = (extra = {}) => ({
    backgroundColor: colors.highlightBg,
    padding: isMobile ? '1.25rem' : '1.5rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    ...extra
  });

  return (
    <div id="education-section">
      <h2 style={styles.title}>Education</h2>
      <div style={styles.experienceCards}>
        {educationData.map((edu, index) => (
          <div style={{ ...styles.card, ...styles.educationCard }} key={index}>
            <h3 style={{ color: colors.primary, marginBottom: '0.5rem', fontSize: isMobile ? '1.1rem' : '1.2rem' }}>{edu.degree}</h3>
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <span style={{ fontWeight: '500', color: colors.primary }}>{edu.institution}</span>
              <span style={{ color: colors.textMuted }}>{edu.period}</span>
            </div>
            <p>{edu.description}</p>
          </div>
        ))}
      </div>

      <div style={calloutBox({ marginTop: '1.5rem' })}>
        <h3 style={{ color: colors.primary, marginBottom: '1rem', fontSize: isMobile ? '1.2rem' : '1.35rem' }}>Bachelor Thesis Highlight</h3>
        <h4 style={{ color: colors.dark, marginBottom: '0.5rem', fontSize: isMobile ? '1rem' : '1.1rem' }}>Investigating the Effects of Model Explanations in Emotion-Based Music Recommendations for Journaling Apps</h4>
        <div style={{ display: 'inline-block', backgroundColor: colors.primary, color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.9rem', marginBottom: '1rem' }}>Grade: 8.0</div>
        <p>
          Researched real-time "black-box" model explanations (LIME) and analyzed their influence on user experience.
          All research code was shared publicly on GitHub.
        </p>
      </div>

      <div style={calloutBox()}>
        <h3 style={{ color: colors.primary, marginBottom: '1rem', fontSize: isMobile ? '1.2rem' : '1.35rem' }}>Master Thesis (Upcoming)</h3>
        <h4 style={{ color: colors.dark, marginBottom: '0.5rem', fontSize: isMobile ? '1rem' : '1.1rem' }}>Chain of Thought Approaches for LLMs</h4>
        <p>
          Evaluating and comparing different chain-of-thought approaches for large language models across programming,
          question answering, and sentiment analysis tasks.
        </p>
      </div>
    </div>
  );
};

export default EducationSection;
