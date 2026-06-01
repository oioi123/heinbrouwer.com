import { useState } from 'react';
import { GithubIcon, LinkedinIcon, MailIcon, GlobeIcon } from 'lucide-react';
import useResponsive from '../../hooks/useResponsive';
import { colors } from '../../theme';

const contactLink = {
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: colors.overlayHeader,
  fontSize: '1.1rem',
  fontWeight: '500',
  padding: '0.5rem 0',
  transition: 'color 0.3s, transform 0.3s',
};

const WebsiteDetailUI = ({ onClose, isVisible }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const isMobile = useResponsive();

  if (!isVisible) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('Thank you for reaching out! We will get back to you shortly.');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setFormStatus(''), 5000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: isMobile ? '1rem' : '2rem',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: '12px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: isMobile ? '90vh' : '80vh',
        overflowY: 'auto',
        position: 'relative',
        pointerEvents: 'auto',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
      }}>
        <div style={{
          backgroundColor: colors.overlayHeader,
          color: 'white',
          padding: isMobile ? '1rem' : '1.5rem',
          borderRadius: '12px 12px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: isMobile ? '1.3rem' : '1.75rem',
            paddingRight: isMobile ? '10px' : '0'
          }}>
            Contact Hein Brouwer
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              transition: 'color 0.3s',
              padding: isMobile ? '10px' : '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.target.style.color = colors.accentHover)}
            onMouseLeave={(e) => (e.target.style.color = 'white')}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: isMobile ? '1.25rem' : '2rem' }}>
          {formStatus && (
            <div style={{
              backgroundColor: '#e7f7ef',
              color: '#2e7d32',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
              {formStatus}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? '1rem' : '1.5rem',
              marginBottom: isMobile ? '1rem' : '1.5rem'
            }}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                required
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  transition: 'border-color 0.3s',
                  width: '100%',
                  height: isMobile ? '48px' : 'auto',
                }}
                onFocus={(e) => (e.target.style.borderColor = colors.accentHover)}
                onBlur={(e) => (e.target.style.borderColor = '#ddd')}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                required
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  transition: 'border-color 0.3s',
                  width: '100%',
                  height: isMobile ? '48px' : 'auto',
                }}
                onFocus={(e) => (e.target.style.borderColor = colors.accentHover)}
                onBlur={(e) => (e.target.style.borderColor = '#ddd')}
              />
            </div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Your Message"
              rows={isMobile ? '3' : '4'}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: isMobile ? '0.95rem' : '1rem',
                marginBottom: isMobile ? '1.25rem' : '1.5rem',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => (e.target.style.borderColor = colors.accentHover)}
              onBlur={(e) => (e.target.style.borderColor = '#ddd')}
            />
            <button type="submit" style={{
              display: 'inline-block',
              background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.primary} 100%)`,
              color: 'white',
              border: 'none',
              padding: isMobile ? '12px 24px' : '12px 30px',
              borderRadius: '30px',
              fontSize: isMobile ? '15px' : '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
              width: isMobile ? '100%' : 'auto',
              minHeight: isMobile ? '48px' : 'auto',
            }}>
              Send Message
            </button>
          </form>

          <h3 style={{
            marginBottom: isMobile ? '0.75rem' : '1rem',
            fontSize: isMobile ? '1.1rem' : '1.25rem'
          }}>
            Connect with Me
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? '1rem' : '1.5rem',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <a href="http://www.heinbrouwer.com" target="_blank" rel="noopener noreferrer" style={{
              ...contactLink,
              fontSize: isMobile ? '1rem' : '1.1rem',
              padding: isMobile ? '10px 0' : '0.5rem 0',
            }}>
              <GlobeIcon size={isMobile ? 20 : 24} />
              <span style={{ marginLeft: '8px' }}>Portfolio</span>
            </a>
            <a href="mailto:hein.brouwer@planet.nl" style={{
              ...contactLink,
              fontSize: isMobile ? '1rem' : '1.1rem',
              padding: isMobile ? '10px 0' : '0.5rem 0',
            }}>
              <MailIcon size={isMobile ? 20 : 24} />
              <span style={{ marginLeft: '8px' }}>Email</span>
            </a>
            <a href="https://github.com/oioi123" target="_blank" rel="noopener noreferrer" style={{
              ...contactLink,
              fontSize: isMobile ? '1rem' : '1.1rem',
              padding: isMobile ? '10px 0' : '0.5rem 0',
            }}>
              <GithubIcon size={isMobile ? 20 : 24} />
              <span style={{ marginLeft: '8px' }}>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/hein-brouwer-a76793326/" target="_blank" rel="noopener noreferrer" style={{
              ...contactLink,
              fontSize: isMobile ? '1rem' : '1.1rem',
              padding: isMobile ? '10px 0' : '0.5rem 0',
            }}>
              <LinkedinIcon size={isMobile ? 20 : 24} />
              <span style={{ marginLeft: '8px' }}>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteDetailUI;
