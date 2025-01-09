import React, { CSSProperties } from 'react';

interface ThirdLayerCardData {
  id: number;
  title: string;
  value: string;
  description?: string;
  bgColor?: string;
  icon?: string;
}

interface ThirdLayerCardsProps {
  cards: ThirdLayerCardData[];
}

const ThirdLayerCards: React.FC<ThirdLayerCardsProps> = ({ cards }) => {
  const styles: Record<string, CSSProperties> = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)', // 4 columns in total
      gap: '16px',
    },
    largeCard: {
      gridColumn: 'span 2', // Spans 2 columns, making it larger
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '16px',
    },
    smallCard: {
      gridColumn: 'span 1', // Each small card takes 1 column
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '8px',
    },
    icon: {
      fontSize: '32px',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: '50%',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1F2937',
    },
    cardValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: '8px 0',
    },
    cardDescription: {
      fontSize: '12px',
      color: '#4B5563',
    },
  };

  return (
    <div style={styles.container}>
      {cards.slice(0, 6).map((card, index) => {
        if (index % 3 === 0) {
          // For large card, span 2 columns
          return (
            <div key={card.id} style={styles.largeCard}>
              <div style={styles.cardHeader}>
                {card.icon && <div style={styles.icon}>{card.icon}</div>}
                <div>
                  <div style={styles.cardTitle}>{card.title}</div>
                  <div style={styles.cardValue}>{card.value}</div>
                </div>
              </div>
              {card.description && <div style={styles.cardDescription}>{card.description}</div>}
            </div>
          );
        }
        // For small cards, span 1 column each
        return (
          <div key={card.id} style={styles.smallCard}>
            <div style={styles.cardHeader}>
              {card.icon && <div style={styles.icon}>{card.icon}</div>}
              <div>
                <div style={styles.cardTitle}>{card.title}</div>
                <div style={styles.cardValue}>{card.value}</div>
              </div>
            </div>
            {card.description && <div style={styles.cardDescription}>{card.description}</div>}
          </div>
        );
      })}
    </div>
  );
};

export default ThirdLayerCards;
