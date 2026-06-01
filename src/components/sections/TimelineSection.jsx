import EnhancedTimeline from '../EnhancedTimeline';

const TimelineSection = ({ styles, isMobile }) => (
  <div>
    <div style={{ overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? '1rem' : 0 }}>
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
);

export default TimelineSection;
