import { useState } from 'react'
import './DonationPanel.css'

export function DonationPanel() {
  const [showModal, setShowModal] = useState(false)

  const donationData = {
    total: '124,500',
    currency: 'USD',
    sources: [
      { name: 'Private Citizens', amount: '45,200', percentage: 36 },
      { name: 'Local NGOs', amount: '38,100', percentage: 31 },
      { name: 'Corporate Partners', amount: '41,200', percentage: 33 }
    ]
  }

  return (
    <div className="command-card donation-card">
      <div className="card-header">
        <h2 className="card-title">Support Emergency Response</h2>
      </div>
      <div className="card-content">
        <div className="donation-main">
          <div className="total-collected">
            <span className="currency">{donationData.currency}</span>
            <span className="amount">{donationData.total}</span>
          </div>
          <div className="total-label">Total Donations Collected</div>
        </div>

        <div className="donation-sources">
          {donationData.sources.map((source, index) => (
            <div key={index} className="source-item">
              <div className="source-info">
                <span className="source-name">{source.name}</span>
                <span className="source-amount">{donationData.currency} {source.amount}</span>
              </div>
              <div className="source-bar-bg">
                <div 
                  className="source-bar-fill" 
                  style={{ width: `${source.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="donate-btn"
          onClick={() => setShowModal(true)}
        >
          Donate Now
        </button>
      </div>

      {showModal && (
        <div className="donation-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="donation-modal" onClick={e => e.stopPropagation()}>
            <h3>Support the Mission</h3>
            <p>This is a conceptual feature. In a production environment, this would securely process your contribution to support emergency response efforts.</p>
            <div className="modal-actions">
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
