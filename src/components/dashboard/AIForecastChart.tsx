'use client';

import { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Legend 
} from 'recharts';
import { TrendingUp, AlertTriangle, Target, Info } from 'lucide-react';

const data = [
  { name: 'Jan', revenue: 4000, forecast: 4000, risk: 200 },
  { name: 'Feb', revenue: 3000, forecast: 3200, risk: 400 },
  { name: 'Mar', revenue: 2000, forecast: 2500, risk: 600 },
  { name: 'Apr', revenue: 2780, forecast: 3000, risk: 300 },
  { name: 'May', revenue: 1890, forecast: 2200, risk: 800 },
  { name: 'Jun', revenue: 2390, forecast: 2800, risk: 200 },
  { name: 'Jul', revenue: 3490, forecast: 4100, risk: 100 },
  { name: 'Aug', forecast: 4800, risk: 500 },
  { name: 'Sep', forecast: 5200, risk: 900 },
  { name: 'Oct', forecast: 6100, risk: 400 },
];

export default function AIForecastChart() {
  return (
    <div style={{ background: '#fff', border: '1px solid #e1e4e8', borderRadius: '16px', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#323338', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="#6161FF" />
            Neural Revenue Forecasting
          </h3>
          <p style={{ fontSize: '12px', color: '#676879', marginTop: '4px' }}>Predictive analysis based on current pipeline velocity and historical win rates.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#9699a6', textTransform: 'uppercase' }}>Confidence</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#00c875' }}>94.2%</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#9699a6', textTransform: 'uppercase' }}>Variance</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#e2445c' }}>±4.2k</div>
          </div>
        </div>
      </div>

      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6161FF" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6161FF" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00c875" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#00c875" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9699a6' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9699a6' }} tickFormatter={(value) => `$${value/1000}k`} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              itemStyle={{ fontSize: '12px', fontWeight: 600 }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area type="monotone" dataKey="revenue" name="Actual Revenue" stroke="#6161FF" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            <Area type="monotone" dataKey="forecast" name="AI Forecast" stroke="#00c875" strokeDasharray="5 5" strokeWidth={2} fillOpacity={1} fill="url(#colorForecast)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '24px', padding: '16px', background: '#f8f9ff', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <AlertTriangle size={20} color="#fdab3d" style={{ marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#323338' }}>AI Risk Detection</div>
          <p style={{ fontSize: '12px', color: '#676879', lineHeight: '1.5', marginTop: '4px' }}>
            Chancellor AI detected a potential 12% revenue dip in September due to a concentration of deals in the "Stalled" state. I recommend deploying the Sales Agent to re-engage Acme Corp and Globex.
          </p>
          <button style={{ marginTop: '12px', fontSize: '12px', fontWeight: 700, color: '#6161FF', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Apply Mitigation Strategy <Target size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
