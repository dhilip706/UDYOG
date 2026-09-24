import React, { useEffect, useState } from 'react';
import { ngoService } from '../../services/ngoService';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Info,
} from 'lucide-react';

export const NgoReportsPage: React.FC = () => {
  const [reportData, setReportData] = useState<{
    reportDate: string;
    summary: any;
    exportDataset: any[];
  } | null>(null);
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [exportNotice, setExportNotice] = useState('');

  useEffect(() => {
    async function loadData() {
      const data = await ngoService.getReports();
      setReportData(data);
    }
    loadData();
  }, []);

  const handleExportCsv = () => {
    if (!reportData || !reportData.exportDataset.length) return;

    const headers = Object.keys(reportData.exportDataset[0]);
    const csvRows = [
      headers.join(','),
      ...reportData.exportDataset.map((row) =>
        headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `UDYOG_NGO_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('CSV report generated and downloaded successfully.');
    setTimeout(() => setExportNotice(''), 3000);
  };

  const handleExportJson = () => {
    if (!reportData) return;
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `UDYOG_NGO_Analytics_Dataset_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('JSON analytics payload exported.');
    setTimeout(() => setExportNotice(''), 3000);
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '22px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
            <BarChart3 size={16} />
            <span>OPERATIONAL & IMPACT REPORTING</span>
          </div>
          <h1 style={{ fontSize: '1.55rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
            Reports & Analytics
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            Exportable community intelligence across registrations, skill assessments, training batch progress, and verified employer placements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleExportCsv}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
              border: '1px solid #8BAEDB',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              background: 'rgba(23, 74, 145, 0.45)',
              border: '1px solid rgba(139, 174, 219, 0.4)',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <FileSpreadsheet size={14} />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', color: '#34D399', padding: '10px 16px', borderRadius: '8px', marginBottom: '18px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} />
          {exportNotice}
        </div>
      )}

      {/* Notice */}
      <div
        style={{
          background: 'rgba(23, 74, 145, 0.25)',
          border: '1px solid rgba(139, 174, 219, 0.3)',
          borderRadius: '10px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '22px',
          fontSize: '0.82rem',
          color: 'var(--color-text-secondary)',
        }}
      >
        <Info size={18} color="#8BAEDB" style={{ flexShrink: 0 }} />
        <span>
          <strong>DEMO DATA:</strong> Reports display verified demonstration data for the Tamil Nadu regional pilot. Data exports utilize live local datasets without mock delays.
        </span>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(11, 36, 82, 0.88)', border: '1px solid rgba(23, 74, 145, 0.5)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>TOTAL COMMUNITY CANDIDATES</div>
          <div style={{ fontSize: '1.7rem', fontWeight: 700, color: '#FFFFFF' }}>{reportData?.summary?.totalBeneficiaries ?? 4}</div>
          <div style={{ fontSize: '0.72rem', color: '#34D399', marginTop: '4px' }}>100% Regionally Mapped</div>
        </div>

        <div style={{ background: 'rgba(11, 36, 82, 0.88)', border: '1px solid rgba(23, 74, 145, 0.5)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>ACTIVE TRAINING COHORTS</div>
          <div style={{ fontSize: '1.7rem', fontWeight: 700, color: '#FFFFFF' }}>{reportData?.summary?.activeTrainingPrograms ?? 4}</div>
          <div style={{ fontSize: '0.72rem', color: '#8BAEDB', marginTop: '4px' }}>NSQF-Aligned Modules</div>
        </div>

        <div style={{ background: 'rgba(11, 36, 82, 0.88)', border: '1px solid rgba(23, 74, 145, 0.5)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>CANDIDATES IN TRAINING</div>
          <div style={{ fontSize: '1.7rem', fontWeight: 700, color: '#FFFFFF' }}>{reportData?.summary?.totalTraineesEnrolled ?? 123}</div>
          <div style={{ fontSize: '0.72rem', color: '#8BAEDB', marginTop: '4px' }}>Practical Skills Bay</div>
        </div>

        <div style={{ background: 'rgba(11, 36, 82, 0.88)', border: '1px solid rgba(23, 74, 145, 0.5)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', marginBottom: '4px' }}>VERIFIED WAGE PLACEMENTS</div>
          <div style={{ fontSize: '1.7rem', fontWeight: 700, color: '#34D399' }}>{reportData?.summary?.totalPlacementsConfirmed ?? 1}</div>
          <div style={{ fontSize: '0.72rem', color: '#34D399', marginTop: '4px' }}>100% Retention Follow-up</div>
        </div>
      </div>

      {/* Dataset Preview Table */}
      <div style={{ background: 'rgba(11, 36, 82, 0.88)', border: '1px solid rgba(23, 74, 145, 0.5)', borderRadius: '14px', padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
            Curated Candidate Export Dataset Preview
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'rgba(7, 26, 58, 0.9)',
                border: '1px solid rgba(23, 74, 145, 0.6)',
                color: '#FFFFFF',
                fontSize: '0.78rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Districts</option>
              <option value="Salem">Salem</option>
              <option value="Coimbatore">Coimbatore</option>
            </select>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)' }}>
              Showing {reportData?.exportDataset.filter((r) => districtFilter === 'ALL' || r.District === districtFilter).length || 0} active records
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(23, 74, 145, 0.5)', color: 'var(--color-steel-light)' }}>
                <th style={{ padding: '10px 12px' }}>Profile ID</th>
                <th style={{ padding: '10px 12px' }}>Candidate Name</th>
                <th style={{ padding: '10px 12px' }}>District</th>
                <th style={{ padding: '10px 12px' }}>Occupation</th>
                <th style={{ padding: '10px 12px' }}>Experience</th>
                <th style={{ padding: '10px 12px' }}>Training Status</th>
                <th style={{ padding: '10px 12px' }}>Skills Count</th>
                <th style={{ padding: '10px 12px' }}>Verification</th>
              </tr>
            </thead>
            <tbody>
              {reportData?.exportDataset
                .filter((r) => districtFilter === 'ALL' || r.District === districtFilter)
                .map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(23, 74, 145, 0.25)', color: '#FFFFFF' }}>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#8BAEDB' }}>{row.ProfileID}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{row.FullName}</td>
                  <td style={{ padding: '10px 12px' }}>{row.District}</td>
                  <td style={{ padding: '10px 12px' }}>{row.Occupation}</td>
                  <td style={{ padding: '10px 12px' }}>{row.YearsExperience} yrs</td>
                  <td style={{ padding: '10px 12px' }}>{row.TrainingStatus}</td>
                  <td style={{ padding: '10px 12px' }}>{row.SkillsCount}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: row.VerificationStatus === 'VERIFIED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(23, 74, 145, 0.5)', color: row.VerificationStatus === 'VERIFIED' ? '#34D399' : '#8BAEDB' }}>
                      {row.VerificationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
