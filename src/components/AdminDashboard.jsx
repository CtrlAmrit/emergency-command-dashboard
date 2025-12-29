import { useState } from 'react'
import MapView from './MapView'
import CommandPanel from './CommandPanel'
import { useIncidents } from '../IncidentContext'
import './Dashboard.css'

function AdminDashboard() {
  const [selectedUnit, setSelectedUnit] = useState(null)
  const { 
    incidents, 
    volunteers, 
    handleVolunteerAction, 
    handleVolunteerArrival 
  } = useIncidents()

    return (
      <div className="dashboard" style={{ marginTop: '32px', height: 'calc(100vh - 32px)' }}>
      <div className="dashboard-left">
        <MapView 
          selectedUnit={selectedUnit} 
          onUnitSelect={setSelectedUnit}
          volunteers={volunteers}
          incidents={incidents}
          onVolunteerArrival={handleVolunteerArrival}
        />
      </div>
      <div className="dashboard-right">
        <CommandPanel 
          selectedUnit={selectedUnit} 
          onUnitSelect={setSelectedUnit}
          volunteers={volunteers}
          incidents={incidents}
          onVolunteerAction={handleVolunteerAction}
        />
      </div>
    </div>
  )
}

export default AdminDashboard
