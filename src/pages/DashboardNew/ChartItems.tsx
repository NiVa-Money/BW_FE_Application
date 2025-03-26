import React, { useCallback, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  Sector,
  Label
} from "recharts";
import CommonTable from "../../components/TableComponent";
import { COLORS } from "../../constants";
import ChartContainer from "./ChartContainer";
import { formatDateWithOrdinal } from "../../hooks/functions";

interface ChartItemsProps {
  constructedChartsData: {
    totalConversation: any[];
    sentiments: any[];
    resolvedChats: any[];
    averageHandlingTime: any[];
    escalationMatrix: any[];
    chatTrafficOverview: any[];
    aiAgentPerformance: any[];
  };
}
const renderColorfulLegendText = (value: string, entry: any) => {
  const { color } = entry;

  return (
    <div
      className="flex items-center gap-2 rounded-full px-2 py-[1px]"
      style={{ backgroundColor: COLORS.LIGHTGRAY }}
    >
      <span
        className="w-10 h-4 rounded-lg"
        style={{ backgroundColor: color }}
      ></span>
      <span style={{ color: "#474747" }}> {value}</span>
    </div>
  );
};
const CustomLegend = (props) => {
  const { payload } = props;

  return (
    <div className="flex justify-center gap-2">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-2">
          {renderColorfulLegendText(entry.value, entry)}
        </div>
      ))}
    </div>
  );
};
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value, name
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 10;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 4}
        outerRadius={outerRadius + 6}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${name} ${value}%`}</text>

    </g>
  );
};

const ChartItems: React.FC<ChartItemsProps> = ({ constructedChartsData }) => {
  // const firstTableHeaders = constructedChartsData.chatTrafficOverview[0]
  //   ? Object.keys(constructedChartsData.chatTrafficOverview[0])
  //   : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );
  const aiAgentPerformanceHeaders = constructedChartsData.aiAgentPerformance[0]
    ? Object.keys(constructedChartsData.aiAgentPerformance[0]).map(
      (header) => header
    )
    : [];

  const chartItems = [
    {
      id: 1,
      title: "Total Conversation",
      component: (
        <LineChart
          width={500}
          height={300}
          data={constructedChartsData.totalConversation}
        >
          <CartesianGrid stroke="#d3d3d3" horizontal={true}  // Shows horizontal grid lines
            vertical={false} />
          <XAxis dataKey="date" tickFormatter={formatDateWithOrdinal} />
          <YAxis domain={[0, 'auto']} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="web"
            strokeWidth={2}
            stroke={COLORS.GRAY}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="whatsapp"
            strokeWidth={2}
            stroke={COLORS.BLUE}
            dot={false}
          />
          <Legend
            verticalAlign="top"
            iconType="rect"
            content={CustomLegend}
            wrapperStyle={{ paddingBottom: 20 }}
          />
        </LineChart>
      ),
    },
    {
      id: 2,
      title: "Escalation Rate (%)",
      component: (
        <BarChart
          width={500}
          height={300}
          data={constructedChartsData.escalationMatrix}
        >
          <CartesianGrid stroke="#d3d3d3" horizontal={true}  // Shows horizontal grid lines
            vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 10 }} />
          <Bar dataKey="escalated" stackId="a" fill={COLORS.BLUE} />
          <Bar dataKey="solved" stackId="a" fill={COLORS.GRAY} />
        </BarChart>
      ),
    },
    {
      id: 3,
      title: "Customer Sentiment Analysis",
      component: (
        <PieChart width={500} height={400}>
          <Pie
            data={constructedChartsData.sentiments}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="70%"

            endAngle={0}
            innerRadius={100}
            outerRadius={130}
            startAngle={180}
            labelLine={false}
            fill="#8884d8"
          >
            {constructedChartsData.sentiments.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={['#b4a9fa', COLORS.GRAY, COLORS.BLUE][index % 3]}
              />
            ))}
            <Label
              position="center"
              content={
                <text
                  x="50%"
                  y="50%"
                  dy={0} // Adjust vertical alignment
                  textAnchor="middle" // Center the text horizontally
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    fill: '#000',
                  }}
                >
                  <tspan x="50%" dy="0">
                    {((constructedChartsData.sentiments[0]?.value / (constructedChartsData.sentiments[0]?.value + constructedChartsData.sentiments[1]?.value + constructedChartsData.sentiments[2]?.value)) * 100).toFixed(2) + "%"}
                  </tspan>
                  <tspan style={{
                    fontSize: '20px',
                    fontWeight: '200',
                    fill: '#000',
                  }} x="50%" dy="1.2em"> {/* Move to the next line */}
                    Positive
                  </tspan>
                </text>
              }
            />


          </Pie>
          <Tooltip />
          <Legend iconType="square" content={CustomLegend}
            wrapperStyle={{ paddingBottom: 10 }} />
        </PieChart>
      ),
    },
    {
      id: 4,
      title: "Net Promoter Score",
      component: (
        <PieChart width={500} height={300}>
          <Pie
            data={[
              { name: 'Promoters', value: 62 },
              { name: 'Detractors', value: 10 },
              { name: 'Responses', value: 28 },
              // Assuming detractors are the remaining percentage
            ]}
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"

            innerRadius={60}
            outerRadius={90}
            onMouseEnter={onPieEnter}
            labelLine={false}
            fill="#8884d8"
          >
            {constructedChartsData.sentiments.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={['#fcebb0', '#ffacad', '#c4f8df'][index % 3]}
              />
            ))}
          </Pie>
          {/* <Tooltip /> */}
          <Legend iconType="square" content={CustomLegend}
            wrapperStyle={{ paddingBottom: 10 }} />
        </PieChart>
      ),
    },
    {
      id: 5,
      title: "Resolved Chats",
      component: (
        <AreaChart
          width={500}
          height={300}
          style={{ backgroundColor: COLORS.LIGHTGRAY }}
          data={constructedChartsData.resolvedChats}
        >
          <XAxis dataKey="date" tickFormatter={formatDateWithOrdinal} />
          <YAxis domain={[0, 'auto']} />
          <Tooltip />
          <Area type="monotone" dataKey="web" stackId="1" stroke={COLORS.GRAY} fill={COLORS.GRAY} dot={false} />
          <Area type="monotone" dataKey="whatsapp" stackId="1" stroke="#8884d8" fill={COLORS.BLUE} dot={false} />


          <Legend
            verticalAlign="top"
            iconType="rect"
            content={CustomLegend}
            wrapperStyle={{ paddingBottom: 10 }}
          />
        </AreaChart>
      ),
    },
    // {
    //   id: 5,
    //   title: "Chat Traffic Overview",
    //   component: (
    //     <CommonTable
    //       headers={firstTableHeaders}
    //       rows={constructedChartsData.chatTrafficOverview}
    //     />
    //   ),
    // },
    {
      id: 6,
      title: "Average Handling Time (secs)",
      component: (
        // <BarChart
        //   width={500}
        //   height={300}
        //   margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        //   data={constructedChartsData.averageHandlingTime}
        // >
        //   <CartesianGrid strokeDasharray="3 3" />
        //   <XAxis dataKey="name" />
        //   <YAxis />
        //   <Tooltip />
        //   <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 10 }} />
        //   <Bar dataKey="whatsapp" fill={COLORS.BLUE} />
        //   <Bar dataKey="website" fill={COLORS.GRAY} />
        // </BarChart>
        <ComposedChart
          width={600}
          height={300}
          data={[
            { name: '24th', website: 100, WhatsApp: 5, Instagram: 40 },
            { name: '25th', website: 90, WhatsApp: 25, Instagram: 35 },
            { name: '26th', website: 80, WhatsApp: 30, Instagram: 30 },
            { name: '27th', website: 70, WhatsApp: 15, Instagram: 25 },
            { name: '28th', website: 60, WhatsApp: 40, Instagram: 20 },
            { name: '29th', website: 50, WhatsApp: 30, Instagram: 15 },
            { name: '30th', website: 40, WhatsApp: 50, Instagram: 10 },
          ]}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid stroke="#d3d3d3" horizontal={true}  // Shows horizontal grid lines
            vertical={false} />
          <XAxis dataKey="name" scale="band" />
          <YAxis />
          <Tooltip />
          <Legend iconType="square" content={CustomLegend}
            wrapperStyle={{ paddingBottom: 10 }} />          <Area type="monotone" dataKey="WhatsApp" fill={COLORS.BLUE} stroke="#8884d8" />
          <Bar dataKey="website" barSize={20} fill={COLORS.GRAY} />

        </ComposedChart>
      ),
    },
  ];
  const performanceBar = [
    {
      id: 1,
      title: "Agent Performance",
      component: (
        <CommonTable
          headers={aiAgentPerformanceHeaders}
          rows={constructedChartsData.aiAgentPerformance}
        />
      ),
    },
    {
      id: 2,
      title: "Human Performance",
      component: <CommonTable headers={aiAgentPerformanceHeaders} rows={[]} />,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-5 mb-4">
        {chartItems.map((item) => (
          <div key={item.id} >
            <ChartContainer
              extraSX={{ border: `1px solid ${COLORS.LAVENDERMIST}`, backgroundColor: item.id == 5 ? '#e7e0eb' : '' }}
              title={item.title}
              component={item.component}
            />
          </div>
        ))}
      </div >

      <ChartContainer
        extraSX={{ backgroundColor: COLORS.LIGHTGRAY, textAlign: "center" }}
        isMultiple
        component={performanceBar}
      />
    </>
  );
};

export default ChartItems;
