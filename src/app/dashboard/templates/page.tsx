'use client';

import { useState } from 'react';
import { Search, Filter, MessageSquare, Sparkles, Plus, MoreHorizontal, LayoutGrid } from 'lucide-react';
import { TEMPLATE_CATEGORIES, MOCK_TEMPLATES, Template } from '@/lib/templates';

export default function TemplateCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTemplates = MOCK_TEMPLATES.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* Header */}
      <header style={{ padding: '24px 40px', borderBottom: '1px solid #e1e4e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#323338' }}>Template center</h1>
          <p style={{ fontSize: '14px', color: '#676879', marginTop: '4px' }}>Search by template name, creator or description</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #d0d4e4', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={16} /> Feedback
          </button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar Filter */}
        <aside style={{ width: '280px', borderRight: '1px solid #e1e4e8', overflowY: 'auto', padding: '16px' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#676879' }} size={16} />
              <input 
                type="text" 
                placeholder="Search templates" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '4px', border: '1px solid #d0d4e4', fontSize: '14px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {TEMPLATE_CATEGORIES.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', 
                  borderRadius: '4px', cursor: 'pointer', fontSize: '14px',
                  background: activeCategory === cat.id ? '#e5f4ff' : 'transparent',
                  color: activeCategory === cat.id ? '#0073ea' : '#323338',
                  fontWeight: activeCategory === cat.id ? 600 : 400
                }}
              >
                <cat.icon size={16} />
                <span>{cat.label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '40px', background: '#f5f6f8' }}>
          <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>
              {TEMPLATE_CATEGORIES.find(c => c.id === activeCategory)?.label || 'All Templates'}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#676879', fontSize: '14px' }}>
              <Filter size={16} /> Filter
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Start from Scratch Card */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px dashed #d0d4e4', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f5f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#676879', marginBottom: '16px' }}>
                <Plus size={24} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Start from scratch</h3>
              <p style={{ fontSize: '13px', color: '#676879', textAlign: 'center', marginTop: '8px' }}>Build your own custom solution from the ground up.</p>
            </div>

            {filteredTemplates.map((template) => (
              <div key={template.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e1e4e8', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '160px', background: '#f5f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                   <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <LayoutGrid size={48} color="#6161FF" style={{ opacity: 0.5 }} />
                   </div>
                   {template.isAI && (
                     <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'linear-gradient(135deg, #6161FF, #a25ddc)', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '4px 8px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                       <Sparkles size={10} /> AI-POWERED
                     </div>
                   )}
                </div>
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#323338' }}>{template.name}</h3>
                    <MoreHorizontal size={16} color="#676879" />
                  </div>
                  <p style={{ fontSize: '13px', color: '#676879', marginTop: '8px', lineHeight: '1.5', flex: 1 }}>{template.description}</p>
                  <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#9699a6' }}>By {template.creator}</span>
                    <button className="btn-monday-primary" style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '4px' }}>Use Template</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredTemplates.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#676879' }}>
              <p style={{ fontSize: '18px' }}>No templates found matching your search.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                style={{ color: '#0073ea', fontWeight: 600, marginTop: '16px', cursor: 'pointer' }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
