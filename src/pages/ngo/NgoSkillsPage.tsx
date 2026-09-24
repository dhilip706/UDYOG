import React, { useEffect, useState } from 'react';
import { ngoService } from '../../services/ngoService';
import { SkillInventoryItem } from '../../types/ngo';
import {
  Cpu,
  Search,
  ChevronRight,
} from 'lucide-react';

export const NgoSkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<SkillInventoryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState('Salem');
  const [selectedBlock, setSelectedBlock] = useState('ALL');
  const [drillDownSkill, setDrillDownSkill] = useState<SkillInventoryItem | null>(null);

  useEffect(() => {
    async function loadSkills() {
      const res = await ngoService.getSkillInventory();
      setSkills(res.skills);
      setCategories(res.categories);
    }
    loadSkills();
  }, []);

  const filteredSkills = skills.filter((s) => {
    const matchCat = selectedCategory === 'ALL' || s.category.toUpperCase().includes(selectedCategory.toUpperCase());
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Title */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Cpu size={16} />
          <span>COMMUNITY CAPABILITY MATRIX</span>
        </div>
        <h1 style={{ fontSize: '1.55rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
          Skill Intelligence & Inventory
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Structured 9-category inventory of community competencies, employer demand alignments, and drill-down regional mapping.
        </p>
      </div>

      {/* Drill-down Navigation Hierarchy Bar (Requirement 10) */}
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.85)',
          border: '1px solid rgba(23, 74, 145, 0.5)',
          borderRadius: '12px',
          padding: '12px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          fontSize: '0.8125rem',
        }}
      >
        <span style={{ color: 'var(--color-steel-light)', fontWeight: 600 }}>Drill-Down:</span>

        {/* State */}
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: '6px', background: '#071A3A', border: '1px solid rgba(139, 174, 219, 0.3)', color: '#FFFFFF', fontSize: '0.78rem' }}
        >
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Karnataka">Karnataka</option>
        </select>
        <ChevronRight size={14} color="var(--color-steel-light)" />

        {/* District */}
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: '6px', background: '#071A3A', border: '1px solid rgba(139, 174, 219, 0.3)', color: '#FFFFFF', fontSize: '0.78rem' }}
        >
          <option value="Salem">Salem</option>
          <option value="Coimbatore">Coimbatore</option>
        </select>
        <ChevronRight size={14} color="var(--color-steel-light)" />

        {/* Block / Community */}
        <select
          value={selectedBlock}
          onChange={(e) => setSelectedBlock(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: '6px', background: '#071A3A', border: '1px solid rgba(139, 174, 219, 0.3)', color: '#FFFFFF', fontSize: '0.78rem' }}
        >
          <option value="ALL">All Blocks</option>
          <option value="Attur">Attur Block</option>
          <option value="Omalur">Omalur Block</option>
          <option value="Hastampatti">Hastampatti</option>
        </select>

        {/* Search Input */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', position: 'relative' }}>
          <Search size={14} color="var(--color-steel-light)" style={{ position: 'absolute', left: '8px' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skill..."
            style={{
              padding: '6px 10px 6px 28px',
              borderRadius: '6px',
              background: '#071A3A',
              border: '1px solid rgba(139, 174, 219, 0.3)',
              color: '#FFFFFF',
              fontSize: '0.78rem',
              outline: 'none',
              width: '160px',
            }}
          />
        </div>
      </div>

      {/* Category Pills (9 Categories from Requirement 10) */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '22px' }}>
        <button
          type="button"
          onClick={() => setSelectedCategory('ALL')}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            background: selectedCategory === 'ALL' ? 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)' : 'rgba(11, 36, 82, 0.7)',
            border: selectedCategory === 'ALL' ? '1px solid #8BAEDB' : '1px solid rgba(23, 74, 145, 0.45)',
            color: selectedCategory === 'ALL' ? '#FFFFFF' : 'var(--color-text-secondary)',
            fontSize: '0.78rem',
            cursor: 'pointer',
          }}
        >
          All Categories
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              background: selectedCategory === cat ? 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)' : 'rgba(11, 36, 82, 0.7)',
              border: selectedCategory === cat ? '1px solid #8BAEDB' : '1px solid rgba(23, 74, 145, 0.45)',
              color: selectedCategory === cat ? '#FFFFFF' : 'var(--color-text-secondary)',
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Inventory Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {filteredSkills.map((s, idx) => (
          <div
            key={idx}
            onClick={() => setDrillDownSkill(s)}
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '12px',
              padding: '16px 18px',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(139, 174, 219, 0.6)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(23, 74, 145, 0.5)')}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-steel-light)', fontWeight: 600 }}>
                  {s.category}
                </span>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(23, 74, 145, 0.4)', borderRadius: '4px', color: '#8BAEDB' }}>
                  {selectedDistrict}
                </span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: '2px 0 8px 0' }}>
                {s.name}
              </h3>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(23, 74, 145, 0.35)', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Practitioners Tracked</span>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{s.practitionerCount} verified</span>
            </div>
          </div>
        ))}
      </div>

      {/* Drill-down Modal */}
      {drillDownSkill && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'classic-fade-in 0.2s ease-out',
          }}
          onClick={() => setDrillDownSkill(null)}
        >
          <div
            style={{
              background: '#0B2452',
              border: '1px solid rgba(23, 74, 145, 0.7)',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: 'var(--shadow-royal)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', fontWeight: 600, marginBottom: '4px' }}>
              SKILL DETAIL & DEMAND DRILL-DOWN
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
              {drillDownSkill.name}
            </h2>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '18px' }}>
              Category: {drillDownSkill.category} • Region: {selectedDistrict}, {selectedState}
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(7, 26, 58, 0.7)', border: '1px solid rgba(23, 74, 145, 0.4)', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)', marginBottom: '6px' }}>
                Employer Demand Alignment:
              </div>
              <div style={{ fontSize: '0.85rem', color: '#FFFFFF', lineHeight: 1.5 }}>
                Requested in active hiring specifications by <strong>Nexus Mobility Engineering Pvt Ltd</strong> and <strong>Surya Green Power</strong> for diagnostic & field positions.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDrillDownSkill(null)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'rgba(23, 74, 145, 0.5)',
                border: '1px solid rgba(139, 174, 219, 0.4)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
