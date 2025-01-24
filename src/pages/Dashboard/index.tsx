import React, { useState, CSSProperties } from 'react';
import FirstLayerCards from './FirstLayerCards';
import { AreaChart } from "../../lib/chartUtils"
import { DonutChart } from "../../lib/chartUtilsDonout"
import { BarChart } from "../../lib/chatUtlisBar"
import { BarList } from "../../lib/chartUtilsBarList"
import { LineChart } from '../../lib/chartUtilsLine';

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
  const chartdata2 = [
    {
      name: "SolarCells",
      amount: 4890,
    },
    {
      name: "Glass",
      amount: 2103,
    },
    {
      name: "JunctionBox",
      amount: 2050,
    },
    {
      name: "Adhesive",
      amount: 1300,
    },
    {
      name: "BackSheet",
      amount: 1100,
    },
    {
      name: "Frame",
      amount: 700,
    },
    {
      name: "Encapsulant",
      amount: 200,
    },
  ]

  const chartdata3 = [
    { name: "/home", value: 843 },
    { name: "/imprint", value: 46 },
    { name: "/cancellation", value: 3 },
    { name: "/blocks", value: 108 },
    { name: "/documentation", value: 384 },
  ]


  const [firstLayerCards,] = useState([
    { id: 1, title: 'Resolution Rate', value: '50.44%', icon: '📊', height: "100px", width: "200px" },
    { id: 2, title: 'Pending Queries', value: '10', icon: '💰', height: "100px", width: "200px" },
    { id: 3, title: 'AI vs. Human Resolution Rate', value: '45', height: "100px", width: "200px" },
    { id: 4, title: 'Your balance', value: '$124', icon: '✅', trend: 'up', change: '+2.4%', height: "100px", width: "200px" },
    { id: 5, title: 'Active Chats', value: '94%', icon: '⭐', trend: 'up', change: '+1.8%', height: "100px", width: "200px" },
    { id: 6, title: 'Escalations', value: '2.4h', icon: '⏱️', trend: 'down', change: '-15%', height: "100px", width: "200px" },

    {
      id: 7, title: 'Live Metric', value: '', icon: '📝', trend: 'up', height: "100px", width: "200px", component: <AreaChart

        data={chartdata}
        index="date"
        categories={["SolarPanels", "Inverters"]}
        valueFormatter={(number: number) =>
          `$${Intl.NumberFormat("us").format(number).toString()}`
        }
        onValueChange={(v) => console.log(v)}
      />, hasCalendar: true,
    },


    {
      id: 8, title: 'Total Spent', value: '$37.5K', icon: '🐞', trend: 'down', change: '-3.4%', height: "100px", width: "200px", component:
        <LineChart

          data={chartdata}
          index="date"
          categories={["SolarPanels", "Inverters"]}
          valueFormatter={(number: number) =>
            `$${Intl.NumberFormat("us").format(number).toString()}`
          }
          onValueChange={(v) => console.log(v)}
        />
    },
    { id: 9, title: 'Server Uptime', value: '99.99%', icon: '🖥️', trend: 'up', change: '+0.1%', height: "100px", width: "200px" },
    { id: 10, title: 'Subscriptions', value: '1,045', icon: '📦', trend: 'up', change: '+4.2%', height: "100px", width: "200px" },
    { id: 11, title: 'Support Tickets', value: '87', icon: '🎟️', trend: 'down', change: '-2.3%', height: "100px", width: "200px" },
    { id: 12, title: 'Team Members', value: '28', icon: '👔', trend: 'up', change: '+1.4%', height: "100px", width: "200px" },
    {
      id: 13, title: 'Active Campaigns', value: '14', icon: '📈', trend: 'up', change: '+3.9%', height: "100px", width: "200px", component: <DonutChart
        className="mx-auto"
        data={chartdata2}
        variant="pie"
        category="name"
        value="amount"
        showLabel={true}
        valueFormatter={(number: number) =>
          `$${Intl.NumberFormat("us").format(number).toString()}`
        }
      />
    },
    { id: 14, title: 'Social Media Reach', value: '21K', icon: '📱', trend: 'up', change: '+7.5%', height: "100px", width: "200px", component: <BarList data={chartdata3} /> },
    {
      id: 15, title: 'Expenses', value: '$3,456', icon: '💳', trend: 'down', change: '-2.1%', height: "100px", width: "200px", component:
        <BarChart

          data={chartdata}
          index="date"
          categories={["SolarPanels", "Inverters"]}
          valueFormatter={(number: number) =>
            `$${Intl.NumberFormat("us").format(number).toString()}`
          }
          onValueChange={(v) => console.log(v)}
        />, hasCalendar: true
    },
    { id: 16, title: 'Net Promoter Score', value: '72', icon: '📊', trend: 'up', change: '+6.3%', height: "100px", width: "200px" },
    { id: 17, title: 'User Engement with thye bot', value: '72', icon: '📊', trend: 'up', change: '+6.3%', height: "100px", width: "200px" },

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
