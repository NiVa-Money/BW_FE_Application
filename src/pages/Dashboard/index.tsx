import React, { useState, CSSProperties } from 'react';
import FirstLayerCards from './FirstLayerCards';
import SecondLayerCards from './SecondLayerCards';
import ThirdLayerCards from './ThirdLayerCards';
import FourthLayerCards from './FourthLayerCards';

const Dashboard: React.FC = () => {
  const [firstLayerCards, setFirstLayerCards] = useState([
    { id: 1, title: 'Active Users', value: '2,847', icon: '👥', trend: 'up', change: '+12.5%' },
    { id: 2, title: 'Total Revenue', value: '$12,847', icon: '💰', trend: 'up', change: '+8.2%' },
    { id: 3, title: 'Pending Tasks', value: '45', icon: '📋', trend: 'down', change: '-5.1%' },
    { id: 4, title: 'Completed Projects', value: '124', icon: '✅', trend: 'up', change: '+2.4%' },
    { id: 5, title: 'Customer Satisfaction', value: '94%', icon: '⭐', trend: 'up', change: '+1.8%' },
    { id: 6, title: 'Average Response Time', value: '2.4h', icon: '⏱️', trend: 'down', change: '-15%' },
  ]);

  const secondLayerCards = [
    {
      id: 1,
      title: 'Total Sales',
      value: '$84,500',
      description: 'Sales have increased by 20% compared to last month.',
      icon: '📈',
    },
    {
      id: 2,
      title: 'Net Profit',
      value: '$25,000',
      description: 'Profit margins remain steady at 30%.',
      icon: '💹',
    },
  ];

  const thirdLayerCards = [
    { id: 1, title: 'Sales Performance', value: '$34,000', description: 'Q4 performance.', icon: '📊' },
    { id: 2, title: 'New Users', value: '1,500', icon: '👤' },
    { id: 3, title: 'Support Tickets', value: '120', icon: '🎫' },
    { id: 4, title: 'Marketing Spend', value: '$12,000', description: 'Campaign results.', icon: '📣' },
    { id: 5, title: 'Website Traffic', value: '90,000', icon: '🌐' },
    { id: 6, title: 'Orders Fulfilled', value: '2,400', icon: '📦' },
  ];

  const fourthLayerCards = [
    {
      id: 1,
      title: 'New Signups',
      value: '1,254',
      description: 'Signups increased by 30% this week.',
      icon: '📝',
    },
    {
      id: 2,
      title: 'Churn Rate',
      value: '2.5%',
      description: 'Churn rate remains low compared to last quarter.',
      icon: '📉',
    },
    {
      id: 3,
      title: 'Customer Reviews',
      value: '4.8/5',
      description: 'Average rating from customer reviews.',
      icon: '🌟',
    },
  ];

  const styles: Record<string, CSSProperties> = {
    container: {
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    section: {
      marginBottom: '32px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <FirstLayerCards
          cards={firstLayerCards}
          onDragStart={() => {}}
          onDragOver={() => {}}
          onDrop={() => {}}
        />
      </div>

      <div style={styles.section}>
        <SecondLayerCards cards={secondLayerCards} />
      </div>

      <div style={styles.section}>
        <ThirdLayerCards cards={thirdLayerCards} />
      </div>

      {/* Fourth Layer Section */}
      <div style={styles.section}>
        <FourthLayerCards cards={fourthLayerCards} />
      </div>
    </div>
  );
};

export default Dashboard;
