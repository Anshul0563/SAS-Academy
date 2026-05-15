import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

const TestPerformanceChart = ({ trendData = [] }) => {
  const data = React.useMemo(() => {
    return trendData.map(item => ({
      month: item.month,
      students: item.students || 0,
      avgScore: Math.round(item.avgScore || 0),
      passRate: 85
    }));
  }, [trendData]);
  
  return (
    <div className="h-72 min-h-72 w-full sm:h-80 lg:h-[400px]">
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center text-slate-400">
          No performance data yet
        </div>
      ) : (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/>
              <stop offset="75%" stopColor="#10b981" stopOpacity={0.05}/>
              <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false}
            stroke="rgba(255,255,255,0.08)"
          />
          
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickMargin={12}
          />
          
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px'
            }}
          />
          
          <Line 
            type="monotone" 
            dataKey="avgScore" 
            name="Avg Score (WPM)"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
          
          <Area 
            type="monotone" 
            dataKey="avgScore"
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#colorScore)"
          />
        </LineChart>
      </ResponsiveContainer>
      )}
    </div>
  );
};

export default TestPerformanceChart;
