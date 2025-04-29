import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Week 1', resolved: 40, total: 50 },
  { name: 'Week 2', resolved: 45, total: 55 },
  { name: 'Week 3', resolved: 52, total: 60 },
  { name: 'Week 4', resolved: 49, total: 55 },
  { name: 'Week 5', resolved: 60, total: 65 },
  { name: 'Week 6', resolved: 75, total: 80 },
];

const ResolvedChatsChart = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5 flex flex-col h-full">
      <div className="flex justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-purple-950">Resolved Chats</h3>
          <p className="text-sm text-muted-foreground">Chats resolved vs. total chats</p>
        </div>
        <div className="bg-purple-light/30 px-3 py-1 rounded-md">
          <span className="text-lg font-bold text-purple-950">
            {((data[data.length - 1].resolved / data[data.length - 1].total) * 100).toFixed(0)}%
          </span>
        </div>
      </div>
      
      <div className="flex-1 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e8def8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#e8def8" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3f2181" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3f2181" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: `1px solid #e8def8`,
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="total" 
              name="Total Chats" 
              stroke="#e8def8" 
              fill="url(#totalGradient)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="resolved" 
              name="Resolved Chats" 
              stroke="#3f2181" 
              fill="url(#resolvedGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResolvedChatsChart;