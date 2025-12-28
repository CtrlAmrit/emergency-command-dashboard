import { useState } from 'react'
import VolunteerMapView from './VolunteerMapView'
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
      status: 'available',
      location: '123 Main St',
      lat: 40.7128,
      lng: -74.0060,
      description: 'Cardiac arrest reported. Immediate medical assistance needed.'
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
      description: 'Emergency supplies delivery required for evacuation center.'
    },
    {
      id: 3,
      serviceType: 'Rescue',
      severity: 'Medium',
      distance: '1.8 km',
      status: 'available',
      location: '789 Pine Rd',
      lat: 40.7505,
      lng: -73.9934,
      description: 'Traffic accident. Assistance with traffic control needed.'
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
      description: 'Medical emergency. First aid support required.'
    }
  ])

  const [decliningTasks, setDecliningTasks] = useState([])

  const handleTaskAction = (taskId, action) => {
    if (action === 'accept') {
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'assigned' }
          : task
      ))
    } else if (action === 'decline') {
      setDecliningTasks(prev => [...prev, taskId])
      setTimeout(() => {
        setTasks(prev => prev.filter(task => task.id !== taskId))
        setDecliningTasks(prev => prev.filter(id => id !== taskId))
      }, 500)
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

  // Get assigned incident
  const assignedIncident = tasks.find(task => task.status === 'assigned')

  return (
    <div className="volunteer-dashboard" style={{ marginTop: '45px', height: 'calc(100vh - 45px)' }}>
      <div className="volunteer-header">
        <h1>Volunteer Task Center</h1>
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
                    <div className="task-distance">
                      <span className="distance-icon">📍</span>
                      {task.distance}
                    </div>
                    <div className="task-status">
                      <span className={`status-badge status-${task.status}`}>
                        {task.status === 'assigned' ? 'En Route' : 'Available'}
                      </span>
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
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  )
}

export default VolunteerDashboard
