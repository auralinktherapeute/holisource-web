/**
 * ApiSettingsPage — Gestion des clés API et crédits Anthropic
 * Accès: /admin/settings (via AdminDashboard)
 */

import { useState, useEffect } from 'react'
import './ApiSettingsPage.css'

interface ApiStatus {
  anthropicConfigured: boolean
  lastChecked: string
  error?: string
}

export default function ApiSettingsPage() {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    setLoading(true)
    try {
      // Vérifier si ANTHROPIC_API_KEY est configuré dans Supabase Secrets
      const response = await fetch('/.netlify/functions/check-api-status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setApiStatus({
          anthropicConfigured: data.anthropic_configured,
          lastChecked: new Date().toLocaleString('fr-FR'),
          error: data.error
        })
      } else {
        setApiStatus({
          anthropicConfigured: false,
          lastChecked: new Date().toLocaleString('fr-FR'),
          error: 'Impossible de vérifier le statut des clés API'
        })
      }
    } catch (err) {
      setApiStatus({
        anthropicConfigured: false,
        lastChecked: new Date().toLocaleString('fr-FR'),
        error: 'Erreur de connexion'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="api-settings-page">
      <div className="settings-container">
        <h1 className="page-title">⚙️ Paramètres API & Crédits</h1>

        {/* Card: Anthropic API */}
        <section className="api-card">
          <div className="card-header">
            <h2>🤖 Anthropic API</h2>
            <span className={`status-badge ${apiStatus?.anthropicConfigured ? 'configured' : 'unconfigured'}`}>
              {apiStatus?.anthropicConfigured ? '✅ Configuré' : '❌ Non configuré'}
            </span>
          </div>

          <div className="card-content">
            <div className="api-info">
              <p className="info-label">Statut:</p>
              <p className="info-value">
                {apiStatus?.anthropicConfigured
                  ? 'Clé API configurée dans Supabase Secrets'
                  : 'Clé API non détectée'}
              </p>
            </div>

            {apiStatus?.error && (
              <div className="error-banner">
                <p>⚠️ {apiStatus.error}</p>
              </div>
            )}

            <div className="usage-section">
              <h3>Utilisation:</h3>
              <ul className="usage-list">
                <li>Agent GEO — Analyse visibilité (en production)</li>
                <li>Agent GEO Création — Articles optimisés (en attente crédits)</li>
                <li>Agents Tauri — Modération, SEO, email (en production)</li>
              </ul>
            </div>

            <div className="actions">
              <button
                className="btn-primary"
                onClick={() => window.open('https://console.anthropic.com/account/billing/overview', '_blank')}
              >
                💳 Gérer les crédits Anthropic
              </button>

              <button
                className="btn-secondary"
                onClick={checkApiStatus}
                disabled={loading}
              >
                {loading ? '⏳ Vérification...' : '🔄 Vérifier le statut'}
              </button>
            </div>

            {apiStatus?.lastChecked && (
              <p className="last-check">Dernier contrôle: {apiStatus.lastChecked}</p>
            )}
          </div>
        </section>

        {/* Card: Configuration */}
        <section className="api-card">
          <div className="card-header">
            <h2>📋 Configuration</h2>
          </div>

          <div className="card-content">
            <div className="config-info">
              <p className="config-label">Pour configurer les clés API:</p>
              <ol className="config-steps">
                <li>Aller sur <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer">console.anthropic.com</a></li>
                <li>Créer une nouvelle clé API</li>
                <li>Copier la clé</li>
                <li>Ajouter dans Supabase Dashboard → Settings → Edge Functions → Secrets</li>
                <li>Clé: <code>ANTHROPIC_API_KEY</code></li>
                <li>Redéployer les Edge Functions</li>
              </ol>
            </div>

            <div className="secrets-hint">
              <h4>📌 Secrets Supabase actuels:</h4>
              <ul>
                <li><code>ANTHROPIC_API_KEY</code> — Pour les agents</li>
                <li><code>MOLLIE_API_KEY</code> — Paiements</li>
                <li><code>RESEND_API_KEY</code> — Emails</li>
                <li><code>TWILIO_ACCOUNT_SID</code> — SMS</li>
                <li><code>TWILIO_AUTH_TOKEN</code> — SMS</li>
                <li><code>WEBHOOK_SECRET</code> — Webhooks internes</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Card: Agent GEO 2 Status */}
        <section className="api-card warning">
          <div className="card-header">
            <h2>🔴 Agent GEO 2 — État</h2>
          </div>

          <div className="card-content">
            <div className="alert-block">
              <p className="alert-title">⚠️ Actuellement bloqué</p>
              <p className="alert-message">
                Agent GEO 2 (création d'articles optimisés) attend une recharge de crédits Anthropic.
              </p>
              <div className="alert-actions">
                <button
                  className="btn-primary"
                  onClick={() => window.open('https://console.anthropic.com/account/billing/overview', '_blank')}
                >
                  💳 Recharger les crédits
                </button>
                <p className="alert-hint">
                  Ensuite: <code>python3 "/Users/geraldhenry/Downloads/Demo Holisource/Agent GEO/run_creation_geo.py"</code>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
