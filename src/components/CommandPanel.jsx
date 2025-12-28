import { useState } from 'react'
import './CommandPanel.css'

function CommandPanel({ selectedUnit, onUnitSelect, volunteers = [], incidents = [], onVolunteerAction = () => {} }) {
  const [currentStep, setCurrentStep] = useState(2) // Start at "Assigned" step (0-indexed: 0=Reported, 1=Verified, 2=Assigned, 3=In Progress, 4=Resolved)

  const statusSteps = [
    'Reported',
    'Verified',
    'Assigned',
    'In Progress',
    'Resolved'
  ]

  const handleNextStep = () => {
    if (currentStep < statusSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  // Dummy data
  const incidentOverview = {
    active: 5,
    critical: 2,
    high: 2,
    medium: 1,
    responseTime: '4.2 min',
    avgResolution: '18.5 min'
  }


  const trustScore = {
    overall: 87,
    reliability: 92,
    response: 85,
    coordination: 88,
    trend: 'up'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return '#ffaa00'
      case 'en-route': return '#3388ff'
      case 'on-scene': return '#00ff00'
      case 'standby': return '#888888'
      default: return '#ffffff'
    }
  }

  return (
    <div className="command-panel">
      <div className="panel-header">
        <h1>COMMAND CENTER</h1>
        <div className="status-indicator">
          <span className="status-dot active"></span>
          <span>OPERATIONAL</span>
        </div>
      </div>

      <div className="cards-container">
        {/* Incident Overview Card */}
        <div className="command-card">
          <div className="card-header">
            <h2 className="card-title">Incident Overview</h2>
            <div className="card-divider"></div>
          </div>
          <div className="card-content">
            <div className="overview-grid">
              <div className="overview-item">
                <div className="overview-label">Active Incidents</div>
                <div className="overview-value">{incidentOverview.active}</div>
              </div>
              <div className="overview-item">
                <div className="overview-label">Critical</div>
                <div className="overview-value critical">{incidentOverview.critical}</div>
              </div>
              <div className="overview-item">
                <div className="overview-label">High Priority</div>
                <div className="overview-value high">{incidentOverview.high}</div>
              </div>
              <div className="overview-item">
                <div className="overview-label">Medium Priority</div>
                <div className="overview-value medium">{incidentOverview.medium}</div>
              </div>
              <div className="overview-item">
                <div className="overview-label">Avg Response Time</div>
                <div className="overview-value">{incidentOverview.responseTime}</div>
              </div>
              <div className="overview-item">
                <div className="overview-label">Avg Resolution</div>
                <div className="overview-value">{incidentOverview.avgResolution}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Timeline Card */}
        <div className="command-card">
          <div className="card-header">
            <h2 className="card-title">Status Timeline</h2>
            <div className="card-divider"></div>
          </div>
          <div className="card-content">
            <div className="status-timeline-vertical">
              {statusSteps.map((step, index) => {
                const isCompleted = index < currentStep
                const isCurrent = index === currentStep
                const isFuture = index > currentStep

                return (
                  <div key={index} className="status-timeline-step">
                    <div className="status-timeline-connector">
                      <div className={`status-timeline-dot ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isFuture ? 'future' : ''}`}>
                        {isCompleted && <div className="status-timeline-check">✓</div>}
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`status-timeline-line ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isFuture ? 'future' : ''}`}></div>
                      )}
                    </div>
                    <div className="status-timeline-content">
                      <div className={`status-timeline-label ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isFuture ? 'future' : ''}`}>
                        {step}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="status-timeline-actions">
              <button 
                className="status-action-btn status-action-btn-secondary"
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
              >
                Previous
              </button>
              <button 
                className="status-action-btn status-action-btn-primary"
                onClick={handleNextStep}
                disabled={currentStep === statusSteps.length - 1}
              >
                Next Step
              </button>
            </div>
          </div>
        </div>

        {/* Volunteer Assignment Card */}
        <div className="command-card">
          <div className="card-header">
            <h2 className="card-title">Volunteer Assignment</h2>
            <div className="card-divider"></div>
          </div>
          <div className="card-content">
            {/* Pending Tasks Section */}
            {volunteers.filter(v => v.status === 'pending').length > 0 && (
              <div className="volunteer-section">
                <div className="volunteer-section-title">Pending Tasks</div>
                <div className="volunteer-list">
                  {volunteers
                    .filter(v => v.status === 'pending')
                    .map(volunteer => {
                      const assignedIncident = incidents.find(inc => inc.id === volunteer.assignedIncidentId) || incidents[0]
                      return (
                        <div key={volunteer.id} className="volunteer-item volunteer-item-pending">
                          <div className="volunteer-main">
                            <div className="volunteer-name">{volunteer.name}</div>
                            <div className="volunteer-role">{volunteer.role}</div>
                            {assignedIncident && (
                              <div className="volunteer-incident">
                                {assignedIncident.type} - {assignedIncident.location}
                              </div>
                            )}
                          </div>
                          <div className="volunteer-actions">
                            <button
                              className="volunteer-action-btn volunteer-action-accept"
                              onClick={() => onVolunteerAction(volunteer.id, assignedIncident?.id || 1, 'accept')}
                            >
                              Accept
                            </button>
                            <button
                              className="volunteer-action-btn volunteer-action-decline"
                              onClick={() => onVolunteerAction(volunteer.id, assignedIncident?.id || 1, 'decline')}
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Active Assignments Section */}
            <div className="volunteer-section">
              <div className="volunteer-section-title">Active Assignments</div>
              <div className="volunteer-list">
                {volunteers
                  .filter(v => ['en-route', 'on-scene', 'assigned'].includes(v.status))
                  .map(volunteer => {
                    const assignedIncident = incidents.find(inc => inc.id === volunteer.assignedIncidentId)
                    return (
                      <div key={volunteer.id} className="volunteer-item">
                        <div className="volunteer-main">
                          <div className="volunteer-name">{volunteer.name}</div>
                          <div className="volunteer-role">{volunteer.role}</div>
                          {assignedIncident && (
                            <div className="volunteer-incident">
                              {assignedIncident.type} - {assignedIncident.location}
                            </div>
                          )}
                        </div>
                        <div className="volunteer-details">
                          <div className="volunteer-location">{volunteer.location}</div>
                          <div 
                            className="volunteer-status"
                            style={{ color: getStatusColor(volunteer.status) }}
                          >
                            {volunteer.status.replace('-', ' ').toUpperCase()}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                {volunteers.filter(v => ['en-route', 'on-scene', 'assigned'].includes(v.status)).length === 0 && (
                  <div className="volunteer-empty">No active assignments</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Score Card */}
          <div className="command-card">
            <div className="card-header">
              <h2 className="card-title">Trust Score</h2>
              <div className="card-divider"></div>
            </div>
            <div className="card-content">
              <div className="trust-score-main">
                <div className="trust-score-value">{trustScore.overall}</div>
                <div className="trust-score-label">Overall Score</div>
                <div className={`trust-score-trend trend-${trustScore.trend}`}>
                  {trustScore.trend === 'up' ? '↑' : '↓'} 2.3%
                </div>
              </div>
              <div className="trust-metrics">
                <div className="trust-metric">
                  <div className="trust-metric-label">Reliability</div>
                  <div className="trust-metric-bar">
                    <div 
                      className="trust-metric-fill" 
                      style={{ width: `${trustScore.reliability}%` }}
                    ></div>
                  </div>
                  <div className="trust-metric-value">{trustScore.reliability}%</div>
                </div>
                <div className="trust-metric">
                  <div className="trust-metric-label">Response</div>
                  <div className="trust-metric-bar">
                    <div 
                      className="trust-metric-fill" 
                      style={{ width: `${trustScore.response}%` }}
                    ></div>
                  </div>
                  <div className="trust-metric-value">{trustScore.response}%</div>
                </div>
                <div className="trust-metric">
                  <div className="trust-metric-label">Coordination</div>
                  <div className="trust-metric-bar">
                    <div 
                      className="trust-metric-fill" 
                      style={{ width: `${trustScore.coordination}%` }}
                    ></div>
                  </div>
                  <div className="trust-metric-value">{trustScore.coordination}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }


export default CommandPanel

