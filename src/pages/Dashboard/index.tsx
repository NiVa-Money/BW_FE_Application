import React, { useState, CSSProperties } from 'react';

interface CardData {
  id: number;
  title: string;
  value: string;
  bgColor: string;
  trend?: string;
  change?: string;
  icon?: string;
}

interface DashboardProps {
  onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [cards, setCards] = useState<CardData[]>([
    { id: 1, title: 'Active Users', value: '2,847', bgColor: '#E3F2FD', trend: 'up', change: '+12.5%', icon: '👥' },
    { id: 2, title: 'Total Revenue', value: '$12,847', bgColor: '#E8F5E9', trend: 'up', change: '+8.2%', icon: '💰' },
    { id: 3, title: 'Pending Tasks', value: '45', bgColor: '#FFF8E1', trend: 'down', change: '-5.1%', icon: '📋' },
    { id: 4, title: 'Completed Projects', value: '124', bgColor: '#F3E5F5', trend: 'up', change: '+2.4%', icon: '✅' },
    { id: 5, title: 'Customer Satisfaction', value: '94%', bgColor: '#E1F5FE', trend: 'up', change: '+1.8%', icon: '⭐' },
    { id: 6, title: 'Average Response Time', value: '2.4h', bgColor: '#F1F8E9', trend: 'down', change: '-15%', icon: '⏱️' },
    { id: 7, title: 'New Signups', value: '328', bgColor: '#FFF3E0', trend: 'up', change: '+18.3%', icon: '📈' },
    { id: 8, title: 'Server Uptime', value: '99.9%', bgColor: '#E0F2F1', trend: 'up', change: '+0.1%', icon: '🖥️' }
  ]);

  const handleLogout = (): void => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    localStorage.removeItem('roleName');
    localStorage.removeItem('orgName');
    localStorage.removeItem('moduleMap');
    
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/login';
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number): void => {
    e.dataTransfer.setData('index', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number): void => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('index'), 10);
    if (dragIndex === dropIndex) return;
    
    const newCards = [...cards];
    const [draggedCard] = newCards.splice(dragIndex, 1);
    newCards.splice(dropIndex, 0, draggedCard);
    setCards(newCards);
  };

  const styles: Record<string, CSSProperties> = {
    container: {
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
    },
    logoutButton: {
      padding: '8px 16px',
      backgroundColor: '#DC2626',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    cardContainer: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '16px',
    },
    card: {
      flex: '1 1 300px',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.2s, transform 0.2s',
      cursor: 'move',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    icon: {
      fontSize: '24px',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: '8px',
    },
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '4px',
      color: '#4B5563',
    },
    cardValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '4px',
    },
    cardTrend: {
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    dragHandle: {
      color: '#666',
      cursor: 'move',
      alignSelf: 'flex-start',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <button 
          onClick={handleLogout}
          style={styles.logoutButton}
          onMouseOver={e => {
            (e.currentTarget.style as CSSProperties).backgroundColor = '#B91C1C';
          }}
          onMouseOut={e => {
            (e.currentTarget.style as CSSProperties).backgroundColor = '#DC2626';
          }}
          type="button"
        >
          Logout
        </button>
      </div>

      <div style={styles.cardContainer}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            style={{
              ...styles.card,
              backgroundColor: card.bgColor,
            }}
          >
            <div style={styles.icon}>{card.icon}</div>
            <div style={styles.cardContent}>
              <div style={styles.cardTitle}>{card.title}</div>
              <div style={styles.cardValue}>{card.value}</div>
              <div style={styles.cardTrend}>
                {card.trend === 'up' ? '↑' : '↓'}
                <span style={{ color: card.trend === 'up' ? '#059669' : '#DC2626' }}>
                  {card.change}
                </span>
              </div>
            </div>
            <span style={styles.dragHandle}>⋮⋮</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;