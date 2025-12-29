import React, { createContext, useContext, useState } from 'react';

const IncidentContext = createContext();

export const useIncidents = () => useContext(IncidentContext);

export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([
    { 
      id: 1, 
      type: 'Medical Emergency', 
      location: '123 Main St', 
      severity: 'Critical',
      lat: 40.7128, 
      lng: -74.0060,
      summary: 'Cardiac arrest reported. Multiple units responding. ETA 3 minutes.',
      status: 'reported',
      assignedVolunteers: [],
      reportedTime: Date.now() - (5 * 60 * 1000)
    },
    { 
      id: 2, 
      type: 'Fire Alert', 
      location: '456 Oak Ave', 
      severity: 'High',
      lat: 40.7580, 
      lng: -73.9855,
      summary: 'Structure fire in commercial building. Fire department on scene.',
      status: 'reported',
      assignedVolunteers: [],
      reportedTime: Date.now() - (10 * 60 * 1000)
    },
    { 
      id: 3, 
      type: 'Traffic Accident', 
      location: '789 Pine Rd', 
      severity: 'Medium',
      lat: 40.7505, 
      lng: -73.9934,
      summary: 'Multi-vehicle collision. Minor injuries reported. Traffic control in effect.',
      status: 'reported',
      assignedVolunteers: [],
      reportedTime: Date.now() - (2 * 60 * 1000)
    }
  ]);

  const [volunteers, setVolunteers] = useState([
    { 
      id: 1, 
      name: 'Sarah Chen', 
      role: 'Medical', 
      status: 'pending', 
      location: 'Station 1',
      lat: 40.7200,
      lng: -74.0100,
      assignedIncidentId: 1
    },
    { 
      id: 2, 
      name: 'Michael Torres', 
      role: 'Fire', 
      status: 'pending', 
      location: 'Station 2',
      lat: 40.7400,
      lng: -73.9800,
      assignedIncidentId: 2
    },
    { 
      id: 3, 
      name: 'James Wilson', 
      role: 'Traffic Control', 
      status: 'pending', 
      location: 'Station 3',
      lat: 40.7300,
      lng: -74.0000,
      assignedIncidentId: 3
    },
    { 
      id: 4, 
      name: 'Emily Davis', 
      role: 'Medical', 
      status: 'standby', 
      location: 'Station 1',
      lat: 40.7200,
      lng: -74.0100,
      assignedIncidentId: null
    }
  ]);

  const addIncident = (incident) => {
    const newIncident = {
      ...incident,
      id: incidents.length + 1,
      status: 'reported',
      assignedVolunteers: [],
      reportedTime: Date.now(),
      lat: incident.lat || 40.7128 + (Math.random() - 0.5) * 0.1,
      lng: incident.lng || -74.0060 + (Math.random() - 0.5) * 0.1,
      severity: incident.severity || 'High'
    };
    setIncidents(prev => [newIncident, ...prev]);
  };

  const updateIncidentStatus = (incidentId, status) => {
    setIncidents(prev => prev.map(inc => 
      inc.id === incidentId ? { ...inc, status } : inc
    ));
  };

  const handleVolunteerAction = (volunteerId, incidentId, action) => {
    if (action === 'accept') {
      setVolunteers(prev => prev.map(v => 
        v.id === volunteerId 
          ? { ...v, status: 'en-route', assignedIncidentId: incidentId }
          : v
      ));
      
      setIncidents(prev => prev.map(inc => 
        inc.id === incidentId 
          ? { 
              ...inc, 
              status: 'assigned',
              assignedVolunteers: [...inc.assignedVolunteers, volunteerId]
            }
          : inc
      ));
    } else if (action === 'decline') {
      setVolunteers(prev => prev.map(v => 
        v.id === volunteerId 
          ? { ...v, status: 'standby', assignedIncidentId: null }
          : v
      ));
    }
  };

  const handleVolunteerArrival = (volunteerId, incidentId) => {
    setVolunteers(prev => prev.map(v => 
      v.id === volunteerId 
        ? { ...v, status: 'on-scene' }
        : v
    ));
    
    setIncidents(prev => prev.map(inc => 
      inc.id === incidentId 
        ? { ...inc, status: 'in-progress' }
        : inc
    ));
  };

  return (
    <IncidentContext.Provider value={{ 
      incidents, 
      volunteers, 
      addIncident, 
      updateIncidentStatus,
      handleVolunteerAction,
      handleVolunteerArrival
    }}>
      {children}
    </IncidentContext.Provider>
  );
};
