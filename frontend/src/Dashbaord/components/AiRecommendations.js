import React from 'react';
import { Sparkles, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const AiRecommendations = () => {
  return (
    <div className="glass-panel p-4 h-100 position-relative overflow-hidden">
      {/* Background decoration */}
      <div className="position-absolute" style={{
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)'
      }}></div>

      <div className="d-flex align-items-center gap-2 mb-4">
        <Sparkles size={20} className="text-purple" style={{ color: 'var(--color-purple)' }} />
        <h5 className="font-weight-bold m-0 text-dark">AI Smart Insights</h5>
      </div>

      <div className="d-flex flex-column gap-3">
        {/* Insight 1 */}
        <div className="p-3 rounded-xl bg-white shadow-sm border border-light">
          <div className="d-flex align-items-start gap-3">
            <div className="mt-1">
              <div className="rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ background: 'rgba(24, 197, 210, 0.1)' }}>
                <CheckCircle size={16} style={{ color: 'var(--color-teal)' }} />
              </div>
            </div>
            <div>
              <p className="font-weight-bold mb-1 text-dark" style={{ fontSize: '0.95rem' }}>Optimal Booking Time</p>
              <p className="text-secondary small mb-2" style={{ lineHeight: '1.5' }}>
                Based on your history, Tuesday mornings are your best availability. Dr. Wilson has a slot at 10 AM.
              </p>
              <button className="btn btn-sm btn-link p-0 font-weight-bold text-decoration-none d-flex align-items-center" style={{ color: 'var(--color-teal)', fontSize: '0.85rem' }}>
                Book Now <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Insight 2 */}
        <div className="p-3 rounded-xl bg-white shadow-sm border border-light">
          <div className="d-flex align-items-start gap-3">
            <div className="mt-1">
              <div className="rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                <AlertCircle size={16} style={{ color: 'var(--color-danger)' }} />
              </div>
            </div>
            <div>
              <p className="font-weight-bold mb-1 text-dark" style={{ fontSize: '0.95rem' }}>High Demand Alert</p>
              <p className="text-secondary small mb-0" style={{ lineHeight: '1.5' }}>
                Flu season is peaking. We recommend booking your vaccination slot soon.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-top border-light text-center">
        <p className="text-muted small mb-0 font-italic">
          "Your health patterns suggest a check-up is due in 2 weeks."
        </p>
      </div>
    </div>
  );
};

export default AiRecommendations;
