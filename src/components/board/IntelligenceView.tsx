'use client';

import { 
  BarChart3, TrendingUp, AlertTriangle, Lightbulb, LayoutDashboard, Brain
} from 'lucide-react';
import type { Board } from '@/lib/types';

export default function IntelligenceView({ board }: { board: Board }) {
  if (!board.aiPayload) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: '#676879' }}>
        <Brain size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#323338' }}>No Intelligence Data</h3>
        <p style={{ marginTop: '8px' }}>This board was not generated using the AI Intelligence Engine.</p>
      </div>
    );
  }

  const { dashboards, widgets, insights, risks, recommendations } = board.aiPayload;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div style={{ background: '#fff', border: '1px solid #e1e4e8', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#676879', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 800 }}>Primary Objective</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#323338' }}>{board.aiPayload.board_name}</div>
        </div>
        <div style={{ background: '#fffcf5', border: '1px solid #fde7cc', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#FDAB3D', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} /> Active Risks
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#323338' }}>{risks.length}</div>
        </div>
        <div style={{ background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#00C875', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lightbulb size={14} /> Actions Recommended
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#323338' }}>{recommendations.length}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: '#fff', border: '1px solid #e1e4e8', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <LayoutDashboard size={20} color="#6161FF" />
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#323338' }}>Generated Dashboards</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {dashboards.map((d, i) => (
                <div key={i} style={{ padding: '16px', borderRadius: '12px', border: '1px solid #e1e4e8', background: '#f8f9ff' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#6161FF', textTransform: 'uppercase', marginBottom: '4px' }}>{d.type}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#323338', marginBottom: '8px' }}>{d.title}</div>
                  <div style={{ fontSize: '13px', color: '#676879' }}>{d.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e1e4e8', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <BarChart3 size={20} color="#00C875" />
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#323338' }}>Metrics & Widgets</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {widgets.map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px', border: '1px solid #e1e4e8' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f5f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {w.type === 'line' ? <TrendingUp size={20} color="#6161FF" /> : <BarChart3 size={20} color="#00C875" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#323338' }}>{w.title}</div>
                    <div style={{ fontSize: '13px', color: '#676879', marginTop: '2px' }}>Metric: {w.data_metric}</div>
                  </div>
                  <div style={{ flex: 1, fontSize: '13px', color: '#676879', fontStyle: 'italic', paddingLeft: '16px', borderLeft: '1px solid #eee' }}>
                    {w.insight}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Insights */}
          <div style={{ background: '#fff', border: '1px solid #e1e4e8', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#323338', marginBottom: '16px' }}>Key Insights</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {insights.map((ins, i) => (
                <div key={i} style={{ paddingBottom: i !== insights.length - 1 ? '16px' : '0', borderBottom: i !== insights.length - 1 ? '1px solid #eee' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#323338' }}>{ins.title}</span>
                    <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', background: ins.impact === 'high' ? '#ffebee' : '#f5f6f8', color: ins.impact === 'high' ? '#e53935' : '#676879' }}>
                      {ins.impact}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#676879' }}>{ins.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div style={{ background: '#fff', border: '1px solid #fde7cc', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#323338', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} color="#FDAB3D" /> Risks
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {risks.map((r, i) => (
                <div key={i}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#323338', marginBottom: '4px' }}>{r.title}</div>
                  <div style={{ fontSize: '12px', color: '#676879' }}><strong>Exposure:</strong> {r.exposure}</div>
                  <div style={{ fontSize: '12px', color: '#e53935', marginTop: '2px' }}><strong>Mitigation:</strong> {r.mitigation}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div style={{ background: '#fff', border: '1px solid #c6f6d5', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#323338', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb size={16} color="#00C875" /> Recommendations
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recommendations.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#00C87515', color: '#00C875', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#323338', marginBottom: '2px' }}>{r.action}</div>
                    <div style={{ fontSize: '12px', color: '#676879' }}>{r.expected_outcome}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
