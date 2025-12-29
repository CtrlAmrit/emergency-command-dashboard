import { useState } from 'react'
import { useIncidents } from '../IncidentContext'
import './CommandPanel.css'

  function CommandPanel({ selectedUnit, onUnitSelect, volunteers = [], incidents = [], onVolunteerAction = () => {} }) {
    const { updateIncidentStatus, certifications = [], updateCertificationStatus } = useIncidents()
    
    const statusSteps = [
      { id: 'reported', label: 'Reported' },
      { id: 'verified', label: 'Verified' },
      { id: 'assigned', label: 'Assigned' },
      { id: 'in-progress', label: 'In Progress' },
      { id: 'resolved', label: 'Resolved' }
    ]

    const trustScore = {
      overall: 94,
      trend: 'up',
      reliability: 98,
      response: 92,
      coordination: 91
    }

    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case 'en-route': return '#3498db';
        case 'on-scene': return '#f1c40f';
        case 'assigned': return '#2ecc71';
        case 'standby': return '#95a5a6';
        case 'pending': return '#e67e22';
        default: return '#ffffff';
      }
    }

    const currentStep = statusSteps.findIndex(step => step.id === selectedUnit?.status?.toLowerCase());
    const isIncidentSelected = !!selectedUnit?.type;

    const handlePreviousStep = () => {
      if (!isIncidentSelected || currentStep <= 0) return
      const prevStatus = statusSteps[currentStep - 1].id
      updateIncidentStatus(selectedUnit.id, prevStatus)
      onUnitSelect({ ...selectedUnit, status: prevStatus })
    }

    const handleNextStep = () => {
      if (!isIncidentSelected || currentStep === -1 || currentStep >= statusSteps.length - 1) return
      const nextStatus = statusSteps[currentStep + 1].id
      updateIncidentStatus(selectedUnit.id, nextStatus)
      onUnitSelect({ ...selectedUnit, status: nextStatus })
    }

    const activeIncidentsCount = incidents.filter(inc => inc.status !== 'resolved').length;
    const criticalIncidentsCount = incidents.filter(inc => inc.severity === 'Critical').length;
    const highIncidentsCount = incidents.filter(inc => inc.severity === 'High').length;
    const mediumIncidentsCount = incidents.filter(inc => inc.severity === 'Medium').length;

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
          {/* Active Incidents List Card */}
          <div className="command-card">
            <div className="card-header">
              <h2 className="card-title">Recent Incidents</h2>
              <div className="card-divider"></div>
            </div>
            <div className="card-content">
              <div className="incident-list-container">
                {incidents.slice(0, 5).map(incident => (
                  <div 
                    key={incident.id} 
                    className={`incident-list-item ${selectedUnit?.id === incident.id && selectedUnit?.type ? 'selected' : ''}`}
                    onClick={() => onUnitSelect(incident)}
                  >
                    <div className="incident-item-left">
                      <div className={`severity-tag severity-${incident.severity.toLowerCase()}`}>
                        {incident.severity}
                      </div>
                      <div className="incident-item-title">{incident.type}</div>
                    </div>
                    <div className="incident-item-right">
                      <div className="incident-item-status">{incident.status.toUpperCase()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Incident Overview Card */}
          <div className="command-card">
            <div className="card-header">
              <h2 className="card-title">System Metrics</h2>
              <div className="card-divider"></div>
            </div>
            <div className="card-content">
              <div className="overview-grid">
                <div className="overview-item">
                  <div className="overview-label">Active Incidents</div>
                  <div className="overview-value">{activeIncidentsCount}</div>
                </div>
                <div className="overview-item">
                  <div className="overview-label">Critical</div>
                  <div className="overview-value critical">{criticalIncidentsCount}</div>
                </div>
                <div className="overview-item">
                  <div className="overview-label">High Priority</div>
                  <div className="overview-value high">{highIncidentsCount}</div>
                </div>
                <div className="overview-item">
                  <div className="overview-label">Medium Priority</div>
                  <div className="overview-value medium">{mediumIncidentsCount}</div>
                </div>
                <div className="overview-item">
                  <div className="overview-label">Avg Response Time</div>
                  <div className="overview-value">4.2 min</div>
                </div>
                <div className="overview-item">
                  <div className="overview-label">Avg Resolution</div>
                  <div className="overview-value">18.5 min</div>
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
                          {step.label}
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
                  disabled={!isIncidentSelected || currentStep === 0}
                >
                  Previous
                </button>
                <button 
                  className="status-action-btn status-action-btn-primary"
                  onClick={handleNextStep}
                  disabled={!isIncidentSelected || currentStep === statusSteps.length - 1}
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
  
          {/* Certification Approvals Card */}
          <div className="command-card">
            <div className="card-header">
              <h2 className="card-title">Certification Approvals</h2>
              <div className="card-divider"></div>
            </div>
            <div className="card-content">
              <div className="volunteer-list">
                {certifications.filter(c => c.status === 'PENDING').length > 0 ? (
                  certifications
                    .filter(c => c.status === 'PENDING')
                    .map(cert => (
                      <div key={cert.id} className="volunteer-item volunteer-item-pending">
                        <div className="volunteer-main">
                          <div className="volunteer-name">{cert.volunteerName || 'Volunteer'}</div>
                          <div className="volunteer-role">{cert.type} Certification</div>
                          <div className="volunteer-incident">
                            Method: {cert.method} {cert.method === 'url' ? `- ${cert.url}` : `- ${cert.fileName}`}
                          </div>
                        </div>
                        <div className="volunteer-actions">
                          <button
                            className="volunteer-action-btn volunteer-action-accept"
                            onClick={() => updateCertificationStatus(cert.id, 'APPROVED')}
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="volunteer-empty">No pending certifications</div>
                )}
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
