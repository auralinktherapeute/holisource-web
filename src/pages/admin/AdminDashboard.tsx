/**
 * AdminDashboard — Tableau de bord Admin Holisource
 * Accès: /admin/dashboard
 */

import { useState } from 'react';
import AgentCommandCenter from './AgentCommandCenter';
import './AdminDashboard.css';

type AdminSection = 'agents' | 'moderation' | 'analytics';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<AdminSection>('agents');

  return (
    <div className="admin-dashboard">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2 className="text-xl font-bold text-cyan-400">🔐 Admin</h2>
        </div>

        <nav className="sidebar-nav">
          <button
            onClick={() => setActiveSection('agents')}
            className={`sidebar-link ${activeSection === 'agents' ? 'active' : ''}`}
          >
            <span>🎛️</span>
            <span>Centre de Commandement</span>
          </button>

          <button
            onClick={() => setActiveSection('moderation')}
            className={`sidebar-link ${activeSection === 'moderation' ? 'active' : ''}`}
          >
            <span>⚖️</span>
            <span>Modération</span>
          </button>

          <button
            onClick={() => setActiveSection('analytics')}
            className={`sidebar-link ${activeSection === 'analytics' ? 'active' : ''}`}
          >
            <span>📊</span>
            <span>Analytics</span>
          </button>
        </nav>

        <div className="sidebar-footer text-xs text-slate-400">
          <p>v1.0 — Holisource</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {activeSection === 'agents' && <AgentCommandCenter />}
        {activeSection === 'moderation' && (
          <div className="p-8 text-center text-slate-400">
            <p className="text-lg">À venir — Section Modération</p>
          </div>
        )}
        {activeSection === 'analytics' && (
          <div className="p-8 text-center text-slate-400">
            <p className="text-lg">À venir — Section Analytics</p>
          </div>
        )}
      </main>
    </div>
  );
}
