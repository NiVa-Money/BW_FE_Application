import React, { CSSProperties } from 'react';

interface LargeCardData {
  id: number;
  title: string;
  value: string;
  description?: string;
  bgColor?: string; // Optional as we override it with white
  icon?: string;
}

interface SecondLayerCardsProps {
  cards: LargeCardData[];
}

const SecondLayerCards: React.FC<SecondLayerCardsProps> = ({ cards }) => {
  const styles: Record<string, CSSProperties> = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)', // Defines a grid with 6 equal columns
      gap: '16px',
    },
    card: {
      gridColumn: 'span 3', // Each card spans 3 columns (unchanged width)
      backgroundColor: '#FFFFFF', // All cards are white
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '16px',
      transition: 'box-shadow 0.2s, transform 0.2s',
      minHeight: '300px', // Increased height
    },
    icon: {
      fontSize: '48px',
      width: '60px',
      height: '60px',
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
      fontSize: '20px',
      fontWeight: '600',
      color: '#1F2937',
    },
    cardValue: {
      fontSize: '32px',
      fontWeight: 'bold',
      margin: '8px 0',
    },
    cardDescription: {
      fontSize: '14px',
      color: '#4B5563',
    },
  };

  return (
    <div style={styles.container}>
      {cards.map((card) => (
        <div key={card.id} style={styles.card}>
          <div style={styles.cardHeader}>
            {card.icon && <div style={styles.icon}>{card.icon}</div>}
            <div>
              <div style={styles.cardTitle}>{card.title}</div>
              <div style={styles.cardValue}>{card.value}</div>
            </div>
          </div>
          {card.description && <div style={styles.cardDescription}>{card.description}</div>}
        </div>
      ))}
    </div>
  );
};

export default SecondLayerCards;
