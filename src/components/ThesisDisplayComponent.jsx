// ThesisDisplayComponent.jsx
// This component will display thesis information and can be added to your existing scene
import React, { useState } from 'react';

const ThesisDisplayComponent = ({ isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState('abstract');
  
  if (!isVisible) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1000,
        padding: '20px',
        overflow: 'auto'
      }}
    >
      <div 
        style={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Header */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px 10px 0 0',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}
        >
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '15px',
              top: '15px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>
            Elevating User Trust
          </h2>
          <h3 style={{ fontSize: '18px', fontWeight: 'normal', marginBottom: '20px' }}>
            Investigating the effects of Model Explanations in Emotion-Based Music Recommendations for Journaling Apps
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p><strong>Student:</strong> H. (Hein) Brouwer</p>
              <p><strong>Grade:</strong> 8.0</p>
            </div>
            <div>
              <p><strong>First Examiner:</strong> A. (Anouk) van Kasteren</p>
              <p><strong>Second Examiner:</strong> Dr. H.J. (Hanna) Hauptmann</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div 
          style={{
            display: 'flex',
            borderBottom: '1px solid #ddd',
            position: 'sticky',
            top: '126px',
            background: 'white',
            zIndex: 5
          }}
        >
          {['abstract', 'findings', 'methodology', 'download'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '15px',
                background: activeTab === tab ? '#f0f7ff' : 'white',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid #3498db' : 'none',
                cursor: 'pointer',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                color: activeTab === tab ? '#2c3e50' : '#666'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div style={{ padding: '20px' }}>
          {activeTab === 'abstract' && (
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '15px' }}>Abstract</h3>
              <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
                Emotion-based music recommendation systems are an upcoming improvement in
                music recommendation systems. Which aim to enhance user experience by aligning music suggestions with the user's current emotional state. This study investigates the impact of explainable AI (XAI) on user trust and satisfaction within a
                journaling app that provides emotion-based music recommendations.
              </p>
              <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
                By using sentiment analysis through the DistilBERT-base-uncased-emotion model and personalized recommendations via the Spotify API, the study aims to explore how
                different explanation types affect user perceptions. The main problem addressed
                is the lack of understanding of how explainable AI influences user trust and satisfaction in emotion-based music recommendation systems.
              </p>
              <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
                The study compared three explanation types: no explanation, text-based explanation, and LIME-based
                visual explanations. Results indicate that there were no statistically significant
                differences in trust, satisfaction, or music experience across the different explanation types. These findings suggest that in this context, integrating XAI into music recommendation systems does not necessarily improve user experience.
              </p>
              <p style={{ lineHeight: '1.6' }}>
                In the broader context of AI-driven applications, these insights highlight the need
                for further research to understand the conditions under which XAI can be beneficial. This study underlines the importance of considering sample size and statistical power in future research to ensure reliable detection of significant effects.
              </p>
            </div>
          )}
          
          {activeTab === 'findings' && (
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '15px' }}>Key Findings</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div style={{ background: '#f0f7ff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
                  <h4 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px' }}>Trust</h4>
                  <p>Black-box explanations did not significantly influence user trust in the journaling app's recommendations.</p>
                </div>
                
                <div style={{ background: '#f0f7ff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
                  <h4 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px' }}>Satisfaction</h4>
                  <p>Black-box explanations did not significantly affect user satisfaction with the journaling app.</p>
                </div>
                
                <div style={{ background: '#f0f7ff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
                  <h4 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px' }}>Music Experience</h4>
                  <p>Black-box explanations did not significantly improve the music listening experience in the journaling app.</p>
                </div>
              </div>
              
              <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h4 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px' }}>Power Analysis</h4>
                <p style={{ marginBottom: '10px' }}>The power values for the analyses (0.581 for music experience, 0.382 for trust, and 0.445 for satisfaction) indicate that the study may have been underpowered.</p>
                <p>A power value of 0.8 is generally considered adequate to detect an effect if it exists. The low power suggests that the sample size may have been too small to detect statistically significant differences.</p>
              </div>
              
              <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px' }}>Implications</h4>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                  <li style={{ marginBottom: '8px' }}>Developers might prioritize enhancing the core functionalities of the journaling app over investing heavily in explanation features.</li>
                  <li style={{ marginBottom: '8px' }}>Although explanations did not significantly impact the measured outcomes, offering them as an optional feature might still benefit users who value transparency.</li>
                  <li>Future studies should conduct power analyses to ensure the reliability of their findings before and after including additional variables.</li>
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'methodology' && (
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '15px' }}>Methodology</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px' }}>Tool Development</h4>
                <p style={{ marginBottom: '10px' }}>The design of the application was guided by principles of usability and accessibility, ensuring a broad range of users could interact with the app effectively.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '15px' }}>
                  <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                    <h5 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>Sentiment Analysis Model</h5>
                    <p>DistilBERT-base-uncased-emotion was chosen as an optimal solution for the journaling app, balancing performance with computational efficiency.</p>
                  </div>
                  
                  <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                    <h5 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>LIME Implementation</h5>
                    <p>LIME was used to provide visual explanations for the sentiment analysis model's predictions, with parameters carefully tuned for real-time performance.</p>
                  </div>
                  
                  <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                    <h5 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>Music Recommendation</h5>
                    <p>Spotify API was integrated to provide personalized music recommendations based on the detected emotions and user preferences.</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px' }}>Study Design</h4>
                <p style={{ marginBottom: '15px' }}>A between-subjects experiment was conducted with three conditions, using a survey to measure trust, satisfaction, and music experience.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                  <div style={{ background: '#f0f7ff', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
                    <h5 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>No Explanation</h5>
                    <p>The first group received no explanations for the music recommendations, serving as the baseline condition.</p>
                  </div>
                  
                  <div style={{ background: '#f0f7ff', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
                    <h5 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>Text Explanation</h5>
                    <p>The second group received text-based explanations that provided a unique explanation for each predicted emotion.</p>
                  </div>
                  
                  <div style={{ background: '#f0f7ff', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
                    <h5 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>LIME Explanation</h5>
                    <p>The third group received explanations using LIME to generate a visual way to "peek inside" the blackbox model.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'download' && (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <img 
                src="/photos/thesiscover.png"
                alt="Thesis Cover"
                style={{ 
                  width: '200px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  marginBottom: '30px',
                  borderRadius: '5px'
                }}
              />
              <h3 style={{ fontSize: '20px', marginBottom: '15px' }}>Download Full Thesis</h3>
              <p style={{ marginBottom: '30px' }}>
                Access the complete version of "Elevating User Trust: Investigating the effects of Model Explanations 
                in Emotion-Based Music Recommendations for Journaling Apps."
              </p>
              <a 
                href="/Hein_Brouwer_Thesis.pdf" 
                download="Hein_Brouwer_Thesis.pdf"
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '30px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  textDecoration: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                📄 Download PDF (3.4MB)
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThesisDisplayComponent;