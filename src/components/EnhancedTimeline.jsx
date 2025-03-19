import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';

const EnhancedTimeline = () => {
  // Data for the timeline
  const experiences = [
    {
      id: 'bsc',
      name: 'BSc Information Science',
      organization: 'Utrecht University',
      type: 'education',
      startYear: 2020,
      startMonth: 9,
      endYear: 2024,
      endMonth: 7,
      color: '#8884d8'
    },
    {
      id: 'msc',
      name: 'MSc Applied Data Science',
      organization: 'Utrecht University',
      type: 'education',
      startYear: 2024,
      startMonth: 9,
      endYear: 2025,
      endMonth: 8,
      color: '#9c88e8'
    },
    {
      id: 'pathe',
      name: 'Customer Service',
      organization: 'Pathé',
      type: 'work',
      startYear: 2022,
      startMonth: 3,
      endYear: 2023,
      endMonth: 11,
      color: '#82ca9d'
    },
    {
      id: 'boas1',
      name: 'App Developer (AR Tour)',
      organization: 'boasmedia',
      type: 'work',
      startYear: 2024,
      startMonth: 6,
      endYear: 2024,
      endMonth: 8,
      color: '#6abf7a'
    },
    {
      id: 'boas2',
      name: 'App Developer (360° Video)',
      organization: 'boasmedia',
      type: 'work',
      startYear: 2025,
      startMonth: 1,
      endYear: 2025,
      endMonth: 2,
      color: '#6abf7a'
    },
    {
      id: 'assistant',
      name: 'Student Assistant',
      organization: 'Utrecht University',
      type: 'work',
      startYear: 2025,
      startMonth: 2,
      endYear: 2025,
      endMonth: 3, // Current
      color: '#55b757'
    }
  ];

  // Create chart data with a row for each experience
  const chartData = experiences.map(exp => {
    // Calculate start and duration in months since Jan 2020
    const startDate = (exp.startYear - 2020) * 12 + (exp.startMonth - 1);
    const endDate = (exp.endYear - 2020) * 12 + (exp.endMonth - 1);
    const duration = endDate - startDate + 1;
    
    // Format start and end dates for tooltip
    const startStr = `${exp.startMonth}/${exp.startYear}`;
    const endStr = `${exp.endMonth}/${exp.endYear}`;
    
    return {
      name: exp.name,
      organization: exp.organization,
      type: exp.type,
      color: exp.color,
      start: startDate,
      duration: duration,
      startDate: startStr,
      endDate: endStr
    };
  });

  // Sort data by start time and type (education first, then work)
  chartData.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'education' ? -1 : 1;
    }
    return a.start - b.start;
  });

  // Generate tick values for years
  const yearTicks = [];
  for (let year = 2020; year <= 2025; year++) {
    yearTicks.push((year - 2020) * 12);
  }
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>{data.name}</p>
          <p style={{ margin: '0' }}>{data.organization}</p>
          <p style={{ margin: '4px 0 0' }}>
            {data.startDate} - {data.endDate}
          </p>
          <p style={{ margin: '4px 0 0' }}>
            {Math.floor(data.duration / 12) > 0 ? `${Math.floor(data.duration / 12)} year${Math.floor(data.duration / 12) !== 1 ? 's' : ''}` : ''}
            {data.duration % 12 > 0 ? ` ${data.duration % 12} month${data.duration % 12 !== 1 ? 's' : ''}` : ''}
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Custom X-axis tick formatter
  const formatXAxis = (tickItem) => {
    return 2020 + Math.floor(tickItem / 12);
  };

  // Current date as a reference line
  const today = new Date();
  const todayPosition = (today.getFullYear() - 2020) * 12 + today.getMonth();

  // Education and work colors for legend
  const educationColor = '#8884d8';
  const workColor = '#82ca9d';

  return (
    <div>
      <h2 style={{ 
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '3rem',
        color: '#2c3e50',
        borderBottom: '2px solid #3498db',
        paddingBottom: '0.5rem'
      }}>
        Career Timeline
      </h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          Visualizing my academic and professional journey from 2020 to 2025:
        </p>
      </div>

      {/* Custom legend */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '2rem',
        marginBottom: '1.5rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '16px', 
            height: '16px', 
            backgroundColor: educationColor, 
            marginRight: '8px',
            borderRadius: '3px'
          }}></div>
          <span>Education</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '16px', 
            height: '16px', 
            backgroundColor: workColor, 
            marginRight: '8px',
            borderRadius: '3px'
          }}></div>
          <span>Work Experience</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '2px', 
            height: '16px', 
            backgroundColor: '#ff7300', 
            marginRight: '8px'
          }}></div>
          <span>Current Date</span>
        </div>
      </div>

      {/* Simple timeline with bars for positions */}
      <div style={{ width: '100%', height: '400px', overflowX: 'auto' }}>
        <div style={{ minWidth: '800px', height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 20, right: 50, left: 150, bottom: 40 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis 
                type="number" 
                domain={[0, 72]} // 6 years in months
                ticks={yearTicks}
                tickFormatter={formatXAxis}
                label={{ value: 'Year', position: 'bottom', offset: 0 }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 14 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                x={todayPosition}
                stroke="#ff7300"
                strokeWidth={2}
                label={{ 
                  value: 'Today',
                  position: 'top',
                  fill: '#ff7300',
                  fontSize: 12
                }}
              />
              {/* Transparent bar for spacing */}
              <Bar dataKey="start" fill="transparent" stackId="stack" />
              
              {/* Duration bar with colored cells */}
              <Bar dataKey="duration" stackId="stack">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ 
          color: '#3498db', 
          marginBottom: '1rem', 
          fontSize: '1.35rem' 
        }}>
          Key Achievements By Year
        </h3>
        
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          {[2020, 2021, 2022, 2023, 2024, 2025].map(year => (
            <div key={year} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: year === new Date().getFullYear() ? '#f0f7ff' : '#f9f9f9',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#2c3e50',
                color: 'white',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: '60px'
              }}>
                {year}
              </div>
              <div>
                {year === 2020 && (
                  <div>
                    <p>Started BSc in Information Science at Utrecht University</p>
                  </div>
                )}
                {year === 2022 && (
                  <div>
                    <p>Started first job at Pathé as Customer Service Representative</p>
                  </div>
                )}
                {year === 2024 && (
                  <div>
                    <p>Completed BSc in Information Science with thesis on model explanations</p>
                    <p>Started MSc in Applied Data Science</p>
                    <p>Developed AR walking tour along the Utrecht water line</p>
                  </div>
                )}
                {year === 2025 && (
                  <div>
                    <p>Created 360-degree video experience of Zeisterbos</p>
                    <p>Started as Student Assistant at Utrecht University</p>
                  </div>
                )}
                {(year === 2021 || year === 2023) && (
                  <div>
                    <p style={{ color: '#666' }}>Continuing studies and existing positions</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedTimeline;