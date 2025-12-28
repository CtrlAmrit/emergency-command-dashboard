import { useState } from 'react'
import VolunteerMapView from './VolunteerMapView'
import { DonationPanel } from './DonationPanel'
import './VolunteerDashboard.css'

function VolunteerDashboard() {
  // Volunteer's current location
  const volunteerLocation = {
    lat: 40.7200,
    lng: -74.0100
  }

    const [tasks, setTasks] = useState([
      {
        id: 1,
        serviceType: 'Medical',
        severity: 'Critical',
        distance: '2.3 km',
        status: 'in-progress',
        location: '123 Main St',
        lat: 40.7128,
        lng: -74.0060,
        description: 'Cardiac arrest reported. Immediate medical assistance needed.',
        potentialTrustGain: 25
      },
      {
        id: 2,
        serviceType: 'Supplies',
        severity: 'High',
        distance: '4.1 km',
        status: 'available',
        location: '456 Oak Ave',
        lat: 40.7580,
        lng: -73.9855,
        description: 'Emergency supplies delivery required for evacuation center.',
        potentialTrustGain: 15
      },
      {
        id: 3,
        serviceType: 'Rescue',
        severity: 'Medium',
        distance: '1.8 km',
        status: 'completed',
        location: '789 Pine Rd',
        lat: 40.7505,
        lng: -73.9934,
        description: 'Traffic accident. Assistance with traffic control needed.',
        potentialTrustGain: 10
      },
      {
        id: 4,
        serviceType: 'Medical',
        severity: 'High',
        distance: '3.5 km',
        status: 'assigned',
        location: '321 Elm St',
        lat: 40.7282,
        lng: -73.9942,
        description: 'Medical emergency. First aid support required.',
        potentialTrustGain: 20
      }
    ])

    const [decliningTasks, setDecliningTasks] = useState([])
    const [trustScore, setTrustScore] = useState(850)
    const [trustUpdated, setTrustUpdated] = useState(false)

    const handleTaskAction = (taskId, action) => {
      if (action === 'accept') {
        setTasks(prev => prev.map(task => 
          task.id === taskId 
            ? { ...task, status: 'assigned' }
            : task
        ))
        
        // Simulate progress for demo
        setTimeout(() => {
          setTasks(prev => prev.map(task => 
            task.id === taskId ? { ...task, status: 'in-progress' } : task
          ))
        }, 3000)
      } else if (action === 'decline') {
        setDecliningTasks(prev => [...prev, taskId])
        setTimeout(() => {
          setTasks(prev => prev.filter(task => task.id !== taskId))
          setDecliningTasks(prev => prev.filter(id => id !== taskId))
        }, 500)
      } else if (action === 'complete') {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, status: 'pending-verification' } : task
        ))

        // Simulate verification and trust score increase
        setTimeout(() => {
          let gainedScore = 15;
          setTasks(prev => {
            const task = prev.find(t => t.id === taskId);
            if (task) gainedScore = task.potentialTrustGain;
            return prev.map(task => 
              task.id === taskId ? { ...task, status: 'completed' } : task
            )
          })
          setTrustScore(prev => prev + gainedScore)
          setTrustUpdated(true)
          setTimeout(() => setTrustUpdated(false), 2000)
        }, 4000)
      }
    }

    const getSeverityColor = (severity) => {
      switch (severity) {
        case 'Critical': return '#ff3333'
        case 'High': return '#ff8833'
        case 'Medium': return '#ffcc33'
        case 'Low': return '#00ff00'
        default: return '#888'
      }
    }

    const getServiceIcon = (serviceType) => {
      switch (serviceType) {
        case 'Medical': return '⚕'
        case 'Supplies': return '📦'
        case 'Rescue': return '🚨'
        default: return '•'
      }
    }

    const getTaskProgress = (status) => {
      switch (status) {
        case 'available': return 0
        case 'assigned': return 30
        case 'in-progress': return 65
        case 'pending-verification': return 90
        case 'completed': return 100
        default: return 0
      }
    }

    const getStatusLabel = (status) => {
      switch (status) {
        case 'available': return 'Available'
        case 'assigned': return 'En Route'
        case 'in-progress': return 'In Progress'
        case 'pending-verification': return 'Verifying...'
        case 'completed': return 'Completed'
        default: return status
      }
    }

    // Get assigned incident (any task that is not available)
    const assignedIncident = tasks.find(task => task.status !== 'available' && task.status !== 'completed')


  return (
    <div className="volunteer-dashboard" style={{ marginTop: '45px', height: 'calc(100vh - 45px)' }}>
      <div className="volunteer-header">
        <div className="header-left">
          <h1>Volunteer Task Center</h1>
        </div>
        <div className={`trust-score-container ${trustUpdated ? 'score-updated' : ''}`}>
          <div className="trust-label">Trust Score</div>
          <div className="trust-value">
            <span className="trust-icon-star">★</span>
            {trustScore}
          </div>
        </div>
      </div>
      
      <div className="volunteer-main">
        <div className="volunteer-map-section">
          <VolunteerMapView 
            volunteerLocation={volunteerLocation}
            assignedIncident={assignedIncident ? {
              type: assignedIncident.serviceType,
              severity: assignedIncident.severity,
              location: assignedIncident.location,
              description: assignedIncident.description,
              lat: assignedIncident.lat,
              lng: assignedIncident.lng
            } : null}
          />
        </div>
        
            <div className="volunteer-content">
              <div className="tasks-container">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`task-card task-card-${task.status} ${decliningTasks.includes(task.id) ? 'task-card-declining' : ''}`}
                  >
                    <div className="task-card-header">
                      <div className="task-service">
                        <span className="task-icon">{getServiceIcon(task.serviceType)}</span>
                        <span className="task-service-type">{task.serviceType}</span>
                      </div>
                      <div 
                        className="task-severity"
                        style={{ backgroundColor: getSeverityColor(task.severity) }}
                      >
                        {task.severity}
                      </div>
                    </div>
                    
                    <div className="task-details">
                      <div className="task-location">{task.location}</div>
                      <div className="task-description">{task.description}</div>
                    </div>
                    
                        <div className="task-footer">
                          <div className="task-info-group">
                            <div className="task-distance">
                              <span className="distance-icon">📍</span>
                              {task.distance}
                            </div>
                            <div className="task-potential-gain">
                              <span className="gain-icon">★</span>
                              +{task.potentialTrustGain} Trust
                            </div>
                          </div>
                          <div className="task-status">
                            <span className={`status-badge status-${task.status}`}>
                              {getStatusLabel(task.status)}
                            </span>
                          </div>
                        </div>

                      <div className="task-progress-container">
                        <div className="task-progress-label">
                          <span>Progress</span>
                          <span>{getTaskProgress(task.status)}%</span>
                        </div>
                        <div className="task-progress-track">
                          <div 
                            className={`task-progress-bar bar-${task.status}`}
                            style={{ width: `${getTaskProgress(task.status)}%` }}
                          />
                        </div>
                      </div>
                      
                        {task.status === 'available' && !decliningTasks.includes(task.id) && (
                        <div className="task-actions">
                          <button
                            className="task-btn task-btn-accept"
                            onClick={() => handleTaskAction(task.id, 'accept')}
                          >
                            Accept
                          </button>
                          <button
                            className="task-btn task-btn-decline"
                            onClick={() => handleTaskAction(task.id, 'decline')}
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {task.status === 'in-progress' && (
                        <div className="task-actions">
                          <button
                            className="task-btn task-btn-complete"
                            onClick={() => handleTaskAction(task.id, 'complete')}
                          >
                            Complete Task
                          </button>
                        </div>
                      )}
                  </div>
                ))}
              </div>
              <DonationPanel />
            </div>

      </div>
    </div>
  )
}

export default VolunteerDashboard
