import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MapView.css'

function createVolunteerLocationIcon() {
  return L.divIcon({
    className: 'volunteer-location-marker',
    html: `<div style="background-color: #3388ff; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 12px rgba(51, 136, 255, 0.6);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  })
}

function createIncidentIcon(severity) {
  const colors = {
    critical: '#ff3333',
    high: '#ff8833',
    medium: '#ffcc33'
  }
  const color = colors[severity] || '#ffcc33'
  
  return L.divIcon({
    className: `marker marker-severity-${severity}`,
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  })
}

function MapBounds({ volunteerLocation, assignedIncident }) {
  const map = useMap()

  useEffect(() => {
    if (volunteerLocation && assignedIncident) {
      const bounds = L.latLngBounds([
        [volunteerLocation.lat, volunteerLocation.lng],
        [assignedIncident.lat, assignedIncident.lng]
      ])
      map.fitBounds(bounds, { padding: [50, 50], duration: 1 })
    } else if (volunteerLocation) {
      map.flyTo([volunteerLocation.lat, volunteerLocation.lng], 13, { duration: 1 })
    }
  }, [volunteerLocation, assignedIncident, map])

  return null
}

function VolunteerMapView({ volunteerLocation, assignedIncident }) {
  const volunteerIcon = useMemo(() => createVolunteerLocationIcon(), [])
  
  const incidentIcon = useMemo(() => {
    if (assignedIncident) {
      return createIncidentIcon(assignedIncident.severity.toLowerCase())
    }
    return null
  }, [assignedIncident])

  const center = volunteerLocation 
    ? [volunteerLocation.lat, volunteerLocation.lng] 
    : [40.7128, -74.0060]

  return (
    <MapContainer
      center={center}
      zoom={13}
      minZoom={10}
      maxZoom={18}
      className="map-container"
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <MapBounds volunteerLocation={volunteerLocation} assignedIncident={assignedIncident} />
      
      {volunteerLocation && (
        <Marker
          position={[volunteerLocation.lat, volunteerLocation.lng]}
          icon={volunteerIcon}
        />
      )}
      
      {assignedIncident && (
        <Marker
          position={[assignedIncident.lat, assignedIncident.lng]}
          icon={incidentIcon}
        >
          <Popup className="incident-popup">
            <div className="popup-content">
              <div className="popup-header">
                <strong>{assignedIncident.type}</strong>
                <span className={`popup-severity severity-${assignedIncident.severity.toLowerCase()}`}>
                  {assignedIncident.severity}
                </span>
              </div>
              <div className="popup-location">{assignedIncident.location}</div>
              <div className="popup-summary">{assignedIncident.description}</div>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}

export default VolunteerMapView
