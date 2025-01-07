import React, { useState, CSSProperties } from 'react';
import FirstLayerCards from './FirstLayerCards';
import { AreaChart } from "../../lib/chartUtils"


const Dashboard: React.FC = () => {


  const chartdata = [
    {
      date: "Jan 23",
      SolarPanels: 2890,
      Inverters: 2338,
    },
    {
      date: "Feb 23",
      SolarPanels: 2756,
      Inverters: 2103,
    },
    {
      date: "Mar 23",
      SolarPanels: 3322,
      Inverters: 2194,
    },
    {
      date: "Apr 23",
      SolarPanels: 3470,
      Inverters: 2108,
    },
    {
      date: "May 23",
      SolarPanels: 3475,
      Inverters: 1812,
    },
    {
      date: "Jun 23",
      SolarPanels: 3129,
      Inverters: 1726,
    },
    {
      date: "Jul 23",
      SolarPanels: 3490,
      Inverters: 1982,
    },
    {
      date: "Aug 23",
      SolarPanels: 2903,
      Inverters: 2012,
    },
    {
      date: "Sep 23",
      SolarPanels: 2643,
      Inverters: 2342,
    },
    {
      date: "Oct 23",
      SolarPanels: 2837,
      Inverters: 2473,
    },
    {
      date: "Nov 23",
      SolarPanels: 2954,
      Inverters: 3848,
    },
    {
      date: "Dec 23",
      SolarPanels: 3239,
      Inverters: 3736,
    },
  ]


  const [firstLayerCards, setFirstLayerCards] = useState([
    { id: 1, title: 'Resolution Rate', value: '50.44%', icon: '📊', height: "100px", width: "200px" },
    { id: 2, title: 'Pending Queries', value: '10', icon: '💰', height: "100px", width: "200px" },
    { id: 3, title: 'AI vs. Human Resolution Rate', value: '45', height: "100px", width: "200px" },
    { id: 4, title: 'Your balance', value: '$124', icon: '✅', trend: 'up', change: '+2.4%', height: "100px", width: "200px" },
    { id: 5, title: 'Active Chats', value: '94%', icon: '⭐', trend: 'up', change: '+1.8%', height: "100px", width: "200px" },
    { id: 6, title: 'Escalations', value: '2.4h', icon: '⏱️', trend: 'down', change: '-15%', height: "100px", width: "200px" },

    {
      id: 7, title: 'New Signups', value: '342', icon: '📝', trend: 'up', change: '+5.6%', height: "100px", width: "200px", component: <AreaChart
        className="h-80"
        data={chartdata}
        index="date"
        categories={["SolarPanels", "Inverters"]}
        valueFormatter={(number: number) =>
          `$${Intl.NumberFormat("us").format(number).toString()}`
        }
        onValueChange={(v) => console.log(v)}
      />
    },


    {
      id: 8, title: 'Bug Reports', value: '18', icon: '🐞', trend: 'down', change: '-3.4%', height: "100px", width: "200px",
    },
    { id: 9, title: 'Server Uptime', value: '99.99%', icon: '🖥️', trend: 'up', change: '+0.1%', height: "100px", width: "200px" },
    { id: 10, title: 'Subscriptions', value: '1,045', icon: '📦', trend: 'up', change: '+4.2%', height: "100px", width: "200px" },
    { id: 11, title: 'Support Tickets', value: '87', icon: '🎟️', trend: 'down', change: '-2.3%', height: "100px", width: "200px" },
    { id: 12, title: 'Team Members', value: '28', icon: '👔', trend: 'up', change: '+1.4%', height: "100px", width: "200px" },
    { id: 13, title: 'Active Campaigns', value: '14', icon: '📈', trend: 'up', change: '+3.9%', height: "100px", width: "200px" },
    { id: 14, title: 'Social Media Reach', value: '21K', icon: '📱', trend: 'up', change: '+7.5%', height: "100px", width: "200px" },
    { id: 15, title: 'Expenses', value: '$3,456', icon: '💳', trend: 'down', change: '-2.1%', height: "100px", width: "200px" },
    { id: 16, title: 'Net Promoter Score', value: '72', icon: '📊', trend: 'up', change: '+6.3%', height: "100px", width: "200px" },
  ]);

  const styles: Record<string, CSSProperties> = {
    container: {
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    section: {
      marginBottom: '32px',
    },
    heading: {
      textAlign: 'left',
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '16px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.heading}>Your Dashboard</div>

      <div style={styles.section}>
        <FirstLayerCards
          cards={firstLayerCards}

        />
      </div>


    </div>
  );
};

export default Dashboard;
