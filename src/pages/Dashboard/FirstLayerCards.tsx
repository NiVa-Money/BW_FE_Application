import React, { CSSProperties } from 'react';
import { Resizable } from "re-resizable";
import DatePicker from 'react-datepicker'; // Ensure you install 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';

interface CardData {
  id: number;
  title: string;
  value: string;
  bgColor?: string; 
  change?: string;
  icon?: string;
  height?: string;
  width?: string;
  component?: React.ReactNode;
  hasCalendar?: boolean;
}

interface FirstLayerCardsProps {
  cards: CardData[];

}

const FirstLayerCards: React.FC<FirstLayerCardsProps> = ({ cards }) => {
  const styles: Record<string, CSSProperties> = {
    cardContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
    },
    card: {
      backgroundColor: '#FFFFFF', 
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
    cardComponent: {
      marginTop: '16px',
      width: '90%',
    },
    calendar: {
      position: 'absolute', 
      top: '8px', 
      right: '60%', 
      transform: 'translate(-50%, 0) scale(0.8)',
      backgroundColor: '#FFFFFF',
      borderRadius: '8px', 
      zIndex: 10,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
    },

  };

  return (
    <div style={styles.cardContainer}>
      {cards.map((card, index) => (
        <Resizable key={card.id}

        style={{ ...styles.card, height: card.height, width: card.width }}>
            <div style={styles.icon}>{card.icon}</div>
            <div style={styles.cardContent}>
              <div style={styles.cardTitle}>{card.title}</div>
              <div style={styles.cardValue}>{card.value}</div>
              <div style={styles.cardTrend}>
               
                <span >
                  {card.change}
                </span>
              </div>
            </div>
            {card.component && (
            <div style={styles.cardComponent}>{card.component}</div>
          )}
           {card.hasCalendar && (
              <div style={styles.calendar}>
                <DatePicker
                  selected={new Date()} // Replace with state for controlled behavior
                  onChange={(date) => console.log(date)} // Replace with state handler
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            )}
        </Resizable>
      ))}
    </div>
  );
};

export default FirstLayerCards;
