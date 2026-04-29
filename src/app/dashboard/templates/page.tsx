'use client';

import { useState } from 'react';
import { Search, Filter, MessageSquare, Sparkles, Plus, MoreHorizontal, LayoutGrid, Check, Loader2 } from 'lucide-react';
import { TEMPLATE_CATEGORIES, MOCK_TEMPLATES, Template } from '@/lib/templates';
import { useBoardStore, useWorkspaceStore } from '@/lib/store';
import { createDefaultBoard } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function TemplateCenter() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const { addBoard, setActiveBoard } = useBoardStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [installingId, setInstallingId] = useState<string | null>(null);

  const filteredTemplates = MOCK_TEMPLATES.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = async (template: Template) => {
    if (!activeWorkspace) return;
    
    // Check if board already exists to prevent duplicates and "lost info" confusion
    const existing = useBoardStore.getState().boards.find(b => b.name === template.name && b.workspaceId === activeWorkspace.id);
    if (existing) {
      router.push(`/dashboard/board/${existing.id}`);
      return;
    }

    setInstallingId(template.id);
    
    // Simulate a bit of processing for "Enterprise" feel
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const newBoard = createDefaultBoard(activeWorkspace.id, template.name, template.type);
      newBoard.description = template.description;
      
      addBoard(newBoard);
      setActiveBoard(newBoard);
      
      router.push(`/dashboard/board/${newBoard.id}`);
    } catch (err) {
      console.error("Failed to create board from template:", err);
    } finally {
      setInstallingId(null);
    }
  };

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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Start from Scratch Card */}
            <div 
              onClick={() => handleUseTemplate({ id: 'scratch', name: 'New Board', description: 'Fresh workspace', creator: 'Me', category: 'scratch', type: 'work' })}
              style={{ background: '#fff', borderRadius: '12px', border: '1px dashed #d0d4e4', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f5f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#676879', marginBottom: '16px' }}>
                <Plus size={24} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Start from scratch</h3>
              <p style={{ fontSize: '13px', color: '#676879', textAlign: 'center', marginTop: '8px' }}>Build your own custom solution from the ground up.</p>
            </div>

            {filteredTemplates.map((template) => (
              <div key={template.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e1e4e8', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ height: '180px', background: '#f8f9ff', position: 'relative', overflow: 'hidden' }}>
                   {template.image ? (
                     <img 
                       src={template.image} 
                       alt={template.name} 
                       style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                     />
                   ) : (
                     <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0f4ff, #e5f4ff)' }}>
                        <LayoutGrid size={48} color="#6161FF" style={{ opacity: 0.2 }} />
                     </div>
                   )}
                   
                   {template.isAI && (
                     <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(4px)', color: '#6161FF', fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                       <Sparkles size={10} /> AI-POWERED
                     </div>
                   )}
                </div>
                
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#323338' }}>{template.name}</h3>
                    <MoreHorizontal size={18} color="#676879" style={{ cursor: 'pointer' }} />
                  </div>
                  <p style={{ fontSize: '14px', color: '#676879', marginTop: '10px', lineHeight: '1.6', flex: 1 }}>{template.description}</p>
                  
                  <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#6161FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>
                          {template.creator[0]}
                       </div>
                       <span style={{ fontSize: '12px', color: '#676879', fontWeight: 500 }}>{template.creator}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleUseTemplate(template)}
                      disabled={!!installingId}
                      className={installingId === template.id ? "btn-monday-secondary" : "btn-monday-primary"}
                      style={{ padding: '8px 20px', fontSize: '13px', borderRadius: '6px', minWidth: '120px' }}
                    >
                      {installingId === template.id ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Loader2 size={14} className="animate-spin" /> Installing
                        </span>
                      ) : 'Use Template'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredTemplates.length === 0 && (
            <div style={{ textAlign: 'center', padding: '100px 0', color: '#676879' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f5f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                 <Search size={32} style={{ opacity: 0.2 }} />
              </div>
              <p style={{ fontSize: '20px', fontWeight: 600 }}>No templates found</p>
              <p style={{ marginTop: '8px' }}>Try adjusting your search or filters to find what you're looking for.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                style={{ color: '#0073ea', fontWeight: 700, marginTop: '24px', cursor: 'pointer', background: 'none', border: 'none', fontSize: '15px' }}
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
