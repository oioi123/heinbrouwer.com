const ProfileSection = ({ styles, isMobile }) => (
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
);

export default ProfileSection;
