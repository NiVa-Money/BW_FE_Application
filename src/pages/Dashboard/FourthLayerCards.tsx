import React, { CSSProperties } from 'react';

interface FourthLayerCardData {
  id: number;
  title: string;
  value: string;
  description?: string;
  bgColor?: string;
  icon?: string;
}

interface FourthLayerCardsProps {
  cards: FourthLayerCardData[];
}

const FourthLayerCards: React.FC<FourthLayerCardsProps> = ({ cards }) => {
  const styles: Record<string, CSSProperties> = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)', // 4 equal columns to distribute space
      gap: '16px',
    },
    firstTwoCard: {
      gridColumn: 'span 1', // Each of the first two cards takes 1 column
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '16px',
    },
    thirdCard: {
      gridColumn: 'span 2', // Third card spans 2 columns (larger)
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '16px',
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
      {cards.slice(0, 2).map((card) => (
        <div
          key={card.id}
          style={styles.firstTwoCard} // The first two cards each take 1 column
        >
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

      {cards.slice(2, 3).map((card) => (
        <div
          key={card.id}
          style={styles.thirdCard} // The third card takes up 2 columns (larger)
        >
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

export default FourthLayerCards;
