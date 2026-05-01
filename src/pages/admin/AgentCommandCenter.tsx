/**
 * Centre de Commandement des Agents IA
 * Rubrique complète du Dashboard Admin Holisource
 *
 * Fonctionnalités:
 * - Vue d'ensemble temps réel
 * - Monitoring 8 agents IA
 * - Logs et alertes
 * - Gestion des jobs pg_cron
 * - Historique 24h
 */

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface AgentStat {
  agent_name: string;
  total_runs: number;
  successful_runs: number;
  failed_runs: number;
  avg_duration_ms: number;
  last_run_at: string;
  last_success_at: string;
  last_failure_at: string;
}

interface Alert {
  id: string;
  agent_name: string;
  severity: string;
  message: string;
  triggered_at: string;
  resolved_at: string | null;
  email_status: string;
}

interface AgentRun {
  id: string;
  agent_name: string;
  status: string;
  started_at: string;
  duration_ms: number | null;
  error_message: string | null;
}

interface AgentLog {
  id: string;
  agent: string;
  action: string;
  details: any;
  succes: boolean;
  erreur: string | null;
  duree_ms: number | null;
  created_at: string;
}

const SUPABASE_URL = 'https://dqmujlqxpmcwscztrrdt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbXVqbHF4cG1jd3NjenRycmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MjM5NzgsImV4cCI6MjA4NDk5OTk3OH0.8RbSZphL-Ee78Ruo1_QE4WJ0tU4tkUl9w6Mk6uq7NKg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function AgentCommandCenter() {
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'alerts' | 'logs'>('overview');
  const [agentStats, setAgentStats] = useState<AgentStat[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [runningJobs, setRunningJobs] = useState<AgentRun[]>([]);
  const [recentLogs, setRecentLogs] = useState<AgentLog[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleTimeString('fr-FR'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const AGENTS = [
    { name: 'agent-seo-scheduler', icon: '🎯', color: 'from-blue-500 to-cyan-500' },
    { name: 'check-agent-health', icon: '🏥', color: 'from-green-500 to-teal-500' },
    { name: 'agent-email', icon: '📧', color: 'from-purple-500 to-pink-500' },
    { name: 'agent-sms', icon: '💬', color: 'from-orange-500 to-red-500' },
    { name: 'agent-moderateur', icon: '⚖️', color: 'from-indigo-500 to-purple-500' },
    { name: 'agent-prospection', icon: '🎣', color: 'from-yellow-500 to-orange-500' },
    { name: 'resend-webhook', icon: '🔔', color: 'from-pink-500 to-rose-500' },
    { name: 'stripe-webhook', icon: '💳', color: 'from-green-600 to-emerald-600' },
  ];

  const fetchData = async () => {
    try {
      const [statsRes, alertsRes, runsRes, logsRes] = await Promise.all([
        supabase.from('agent_stats').select('*').order('agent_name'),
        supabase.from('alerts').select('*').is('resolved_at', null).order('triggered_at', { ascending: false }).limit(20),
        supabase.from('agent_runs').select('*').is('duration_ms', null).order('started_at', { ascending: false }).limit(10),
        supabase.from('agent_logs').select('*').order('created_at', { ascending: false }).limit(100),
      ]);

      setAgentStats(statsRes.data || []);
      setAlerts(alertsRes.data || []);
      setRunningJobs(runsRes.data || []);
      setRecentLogs(logsRes.data || []);
      setLastUpdate(new Date().toLocaleTimeString('fr-FR'));
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Erreur Supabase:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const getAgentStat = (agentName: string) => {
    return agentStats.find(s => s.agent_name === agentName);
  };

  const getSuccessRate = (stat: AgentStat | undefined) => {
    if (!stat || stat.total_runs === 0) return 0;
    return ((stat.successful_runs / stat.total_runs) * 100).toFixed(1);
  };

  // ===== RENDER OVERVIEW =====
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Agents Actifs</span>
            <span className="text-2xl">🤖</span>
          </div>
          <div className="text-4xl font-bold text-cyan-400">{agentStats.length}</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Jobs en cours</span>
            <span className="text-2xl">▶️</span>
          </div>
          <div className="text-4xl font-bold text-amber-400">{runningJobs.length}</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Alertes Actives</span>
            <span className="text-2xl">⚠️</span>
          </div>
          <div className={`text-4xl font-bold ${alerts.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {alerts.length}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Taux Succès Global</span>
            <span className="text-2xl">📊</span>
          </div>
          <div className="text-4xl font-bold text-cyan-400">
            {agentStats.length > 0
              ? ((agentStats.reduce((acc, s) => acc + s.successful_runs, 0) / agentStats.reduce((acc, s) => acc + s.total_runs, 0) * 100) || 0).toFixed(0)
              : 0}%
          </div>
        </div>
      </div>

      {/* Alertes critiques */}
      {alerts.length > 0 && (
        <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-6 backdrop-blur">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🚨</span>
            <h3 className="text-xl font-bold text-red-400">Alertes Critiques</h3>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alerts.slice(0, 5).map(alert => (
              <div key={alert.id} className={`p-3 rounded border-l-4 ${
                alert.severity === 'critical'
                  ? 'border-l-red-500 bg-red-500/10'
                  : 'border-l-amber-500 bg-amber-500/10'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-slate-100">{alert.agent_name}</div>
                    <div className="text-sm text-slate-300">{alert.message}</div>
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(alert.triggered_at).toLocaleString('fr-FR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Jobs en cours */}
      {runningJobs.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-6 backdrop-blur">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⏳</span>
            <h3 className="text-xl font-bold text-amber-400">Exécutions en Cours</h3>
          </div>
          <div className="space-y-2">
            {runningJobs.map(run => {
              const elapsed = ((Date.now() - new Date(run.started_at).getTime()) / 1000).toFixed(1);
              return (
                <div key={run.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-amber-500/20">
                  <span className="font-mono text-amber-300">{run.agent_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">{elapsed}s</span>
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // ===== RENDER AGENTS =====
  const renderAgents = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {AGENTS.map(agent => {
        const stat = getAgentStat(agent.name);
        const successRate = getSuccessRate(stat);
        return (
          <div
            key={agent.name}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-5 hover:border-slate-600 transition group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`text-3xl`}>{agent.icon}</div>
                <div>
                  <h4 className="font-semibold text-slate-100">{agent.name}</h4>
                  <div className={`text-sm font-bold ${parseFloat(successRate as string) > 80 ? 'text-green-400' : 'text-red-400'}`}>
                    {successRate}% ✓
                  </div>
                </div>
              </div>
            </div>

            {stat ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Total:</span>
                  <span className="font-mono">{stat.total_runs}</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>Succès:</span>
                  <span className="font-mono">{stat.successful_runs}</span>
                </div>
                <div className="flex justify-between text-red-400">
                  <span>Erreurs:</span>
                  <span className="font-mono">{stat.failed_runs}</span>
                </div>
                <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-700">
                  <span className="text-xs">Dernier run:</span>
                  <span className="text-xs">
                    {stat.last_run_at ? new Date(stat.last_run_at).toLocaleTimeString('fr-FR') : '—'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-sm">Pas de données</div>
            )}
          </div>
        );
      })}
    </div>
  );

  // ===== RENDER ALERTS =====
  const renderAlerts = () => (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <span className="text-4xl mb-4 block">✨</span>
          <p>Aucune alerte — Tous les systèmes sont opérationnels!</p>
        </div>
      ) : (
        alerts.map(alert => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border-l-4 ${
              alert.severity === 'critical'
                ? 'bg-red-950/40 border-l-red-500 border border-red-500/20'
                : alert.severity === 'warning'
                ? 'bg-amber-950/40 border-l-amber-500 border border-amber-500/20'
                : 'bg-blue-950/40 border-l-blue-500 border border-blue-500/20'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-bold text-slate-100">{alert.agent_name}</div>
                <div className={`text-xs font-semibold ${
                  alert.severity === 'critical' ? 'text-red-400' :
                  alert.severity === 'warning' ? 'text-amber-400' :
                  'text-blue-400'
                }`}>
                  {alert.severity.toUpperCase()}
                </div>
              </div>
              <div className="text-xs text-slate-400">
                {new Date(alert.triggered_at).toLocaleString('fr-FR')}
              </div>
            </div>
            <p className="text-slate-300 text-sm">{alert.message}</p>
          </div>
        ))
      )}
    </div>
  );

  // ===== RENDER LOGS =====
  const renderLogs = () => (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 border-b border-slate-700 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">Agent</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">Action</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">Statut</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">Durée (ms)</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 max-h-96 overflow-y-auto block">
            {recentLogs.slice(0, 50).map(log => (
              <tr key={log.id} className="hover:bg-slate-800/50 block w-full flex">
                <td className="px-4 py-3 text-cyan-400 font-mono flex-1">
                  {log.agent}
                </td>
                <td className="px-4 py-3 text-slate-300 flex-1">
                  {log.action}
                </td>
                <td className={`px-4 py-3 font-bold flex-1 ${log.succes ? 'text-green-400' : 'text-red-400'}`}>
                  {log.succes ? '✓ OK' : '✗ ERR'}
                </td>
                <td className="px-4 py-3 text-slate-400 flex-1">
                  {log.duree_ms ? `${log.duree_ms}ms` : '—'}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs flex-1 whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-100 flex items-center gap-3">
                🎛️ Centre de Commandement des Agents IA
              </h1>
              <p className="text-slate-400 text-sm mt-1">Monitoring en temps réel — Mise à jour: {lastUpdate}</p>
            </div>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition text-sm"
            >
              🔄 Actualiser
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-slate-700 -mb-px">
            {(['overview', 'agents', 'alerts', 'logs'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-semibold text-sm border-b-2 transition ${
                  activeTab === tab
                    ? 'text-cyan-400 border-cyan-400'
                    : 'text-slate-400 border-transparent hover:text-slate-300'
                }`}
              >
                {tab === 'overview' && '📊 Vue d\'ensemble'}
                {tab === 'agents' && '🤖 Agents'}
                {tab === 'alerts' && '⚠️ Alertes'}
                {tab === 'logs' && '📋 Logs'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12 text-slate-400">Chargement...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">
            <div className="text-2xl mb-4">⚠️</div>
            <p className="text-lg">{error}</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'agents' && renderAgents()}
            {activeTab === 'alerts' && renderAlerts()}
            {activeTab === 'logs' && renderLogs()}
          </>
        )}
      </div>
    </div>
  );
}
