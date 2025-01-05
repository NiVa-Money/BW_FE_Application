import React, { CSSProperties } from 'react';

interface CardData {
  id: number;
  title: string;
  value: string;
  bgColor?: string; // Optional as we override it with white
  trend?: string;
  change?: string;
  icon?: string;
}

interface FirstLayerCardsProps {
  cards: CardData[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => void;
}

const FirstLayerCards: React.FC<FirstLayerCardsProps> = ({ cards, onDragStart, onDragOver, onDrop }) => {
  const styles: Record<string, CSSProperties> = {
    cardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)', // Defines 6 cards per row
      gap: '16px',
    },
    card: {
      backgroundColor: '#FFFFFF', // Ensure all cards are white
      minWidth: '200px',
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
    },
  };

  return (
    <div style={styles.cardContainer}>
      {cards.map((card, index) => (
        <div
          key={card.id}
          draggable
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, index)}
          style={styles.card}
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
  );
};

export default FirstLayerCards;
