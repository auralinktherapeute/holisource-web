import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import './UpgradeModal.css';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, currentPlan = 'basic' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    {
      id: 'premium',
      name: 'Premium',
      price: '19,99€',
      period: '/mois',
      features: [
        '✓ RDV en ligne',
        '✓ Statistiques détaillées',
        '✓ Priorité dans les résultats',
        '✓ Email support',
      ],
    },
    {
      id: 'premium_annual',
      name: 'Premium Annuel',
      price: '199€',
      period: '/an (économisez 40€)',
      features: [
        '✓ Tout Premium',
        '✓ 2 mois gratuits',
        '✓ Facture annuelle',
      ],
    },
    {
      id: 'premium_plus',
      name: 'Premium+',
      price: '29,99€',
      period: '/mois',
      badge: 'Disponible juin',
      features: [
        '✓ Tout Premium',
        '✓ Chatbot IA personnalisé',
        '✓ SMS automatisés',
        '✓ Profil IA optimisé',
        '✓ Support prioritaire',
      ],
    },
  ];

  const handleUpgrade = async (plan: string) => {
    if (currentPlan !== 'basic' && plan !== currentPlan) {
      // Check if already subscribed
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError('Veuillez vous connecter d\'abord');
        setLoading(false);
        return;
      }

      const response = await supabase.functions.invoke('mollie-checkout', {
        body: {
          plan,
          success_url: `${window.location.origin}/dashboard?upgrade=success`,
          cancel_url: `${window.location.origin}/dashboard?upgrade=canceled`,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        setError(response.error.message || 'Erreur lors de la création de la session de paiement');
        setLoading(false);
        return;
      }

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        setError('URL de paiement non reçue');
        setLoading(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(`Erreur: ${message}`);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="upgrade-modal-overlay" onClick={onClose}>
      <div className="upgrade-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <h2 className="modal-title">Passer à Premium</h2>
        <p className="modal-subtitle">Déverrouillez toutes les fonctionnalités pour développer votre pratique</p>

        {error && <div className="error-banner">{error}</div>}

        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${currentPlan === plan.id ? 'active' : ''} ${
                plan.badge ? 'disabled' : ''
              }`}
            >
              {plan.badge && <div className="badge">{plan.badge}</div>}

              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                {plan.price}
                <span className="plan-period">{plan.period}</span>
              </div>

              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>

              <button
                className={`upgrade-btn ${currentPlan === plan.id ? 'current' : ''} ${
                  plan.badge ? 'disabled' : ''
                }`}
                onClick={() => handleUpgrade(plan.id)}
                disabled={loading || plan.badge !== undefined}
              >
                {loading ? 'Chargement...' : currentPlan === plan.id ? '✓ Abonné' : 'Choisir'}
              </button>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <p className="text-muted">Paiement sécurisé via Mollie • Facture automatique • Annulation à tout moment</p>
        </div>
      </div>
    </div>
  );
};
