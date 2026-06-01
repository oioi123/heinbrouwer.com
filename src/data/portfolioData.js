export const skillsData = [
  { subject: 'Python', A: 95, fullMark: 100 },
  { subject: 'R', A: 95, fullMark: 100 },
  { subject: 'Data Analysis', A: 85, fullMark: 100 },
  { subject: 'Machine Learning', A: 80, fullMark: 100 },
  { subject: 'Unity/AR', A: 70, fullMark: 100 },
  { subject: 'SQL', A: 70, fullMark: 100 },
  { subject: 'JavaScript/React', A: 65, fullMark: 100 },
  { subject: 'C#', A: 60, fullMark: 100 },
];

export const experienceData = [
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

export const educationData = [
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

export const projectData = [
  {
    title: 'AR Walking Tour (Utrecht Water Line)',
    description: 'Interactive walking tour with AR scenes along the Utrecht water line.',
    skills: ['Unity', 'AR', 'C#', '3D Modeling'],
    year: 2024
  },
  {
    title: '360° Bison Field Experience',
    description: 'Interactive 360-degree video comparing past and present of the bison field in Zeisterbos.',
    skills: ['Unity', '360° Video', 'JavaScript'],
    year: 2025
  },
  {
    title: 'Music Recommendation System',
    description: 'Emotion-based music recommendation system with LIME explanations for journaling apps.',
    skills: ['Python', 'Machine Learning', 'XAI', 'LIME'],
    year: 2024
  }
];

export const NAV_SECTIONS = ['profile', 'skills', 'experience', 'education', 'projects', 'timeline'];
