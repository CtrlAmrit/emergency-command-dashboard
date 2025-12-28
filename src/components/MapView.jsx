import { useEffect, useRef, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MapView.css'

function createIncidentIcon(severity, isResolved) {
  const colors = {
    critical: '#ff3333',
    high: '#ff8833',
    medium: '#ffcc33'
  }
  const color = colors[severity] || '#ffcc33'
  
  return L.divIcon({
    className: `marker marker-severity-${severity} ${isResolved ? 'marker-resolved' : ''}`,
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  })
}

function createVolunteerIcon(status) {
  const colors = {
    pending: '#ffaa00',
    'en-route': '#3388ff',
    'on-scene': '#00ff00',
    standby: '#888888'
  }
  const color = colors[status] || '#3388ff'
  
  return L.divIcon({
    className: `volunteer-marker volunteer-marker-${status}`,
    html: `<div class="volunteer-marker-inner" style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  })
}

function FlyToLocation({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 14, { duration: 1 })
    }
  }, [center, zoom, map])
  return null
}

function AnimatedVolunteerMarker({ volunteer, incidents, onArrival }) {
  const markerRef = useRef(null)
  const animationRef = useRef(null)
  const idleIntervalRef = useRef(null)
  const basePositionRef = useRef({ lat: volunteer.lat, lng: volunteer.lng })

  useEffect(() => {
    const marker = markerRef.current
    if (!marker) return

    if (idleIntervalRef.current) {
      clearInterval(idleIntervalRef.current)
      idleIntervalRef.current = null
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    if (volunteer.status === 'en-route' && volunteer.assignedIncidentId) {
      const incident = incidents.find(inc => inc.id === volunteer.assignedIncidentId)
      if (incident) {
        const startLat = volunteer.lat
        const startLng = volunteer.lng
        const endLat = incident.lat
        const endLng = incident.lng
        const duration = 3000
        const startTime = Date.now()

        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          const easeProgress = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2

          const currentLat = startLat + (endLat - startLat) * easeProgress
          const currentLng = startLng + (endLng - startLng) * easeProgress

          marker.setLatLng([currentLat, currentLng])

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate)
          } else {
            onArrival(volunteer.id, incident.id)
          }
        }

        animationRef.current = requestAnimationFrame(animate)
      }
    } else if (volunteer.status === 'standby' || volunteer.status === 'pending') {
      let currentBaseLat = basePositionRef.current.lat
      let currentBaseLng = basePositionRef.current.lng

      const moveMarker = () => {
        const offsetLat = (Math.random() - 0.5) * 0.0002
        const offsetLng = (Math.random() - 0.5) * 0.0002
        const newLat = currentBaseLat + offsetLat
        const newLng = currentBaseLng + offsetLng

        const startLat = marker.getLatLng().lat
        const startLng = marker.getLatLng().lng
        const moveDuration = 2000
        const startTime = Date.now()

        const animateIdle = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / moveDuration, 1)
          const easeProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2

          const lat = startLat + (newLat - startLat) * easeProgress
          const lng = startLng + (newLng - startLng) * easeProgress
          marker.setLatLng([lat, lng])

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animateIdle)
          } else {
            currentBaseLat = newLat
            currentBaseLng = newLng
          }
        }

        animationRef.current = requestAnimationFrame(animateIdle)
      }

      setTimeout(moveMarker, 1500)
      idleIntervalRef.current = setInterval(moveMarker, 4000 + Math.random() * 2000)
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (idleIntervalRef.current) clearInterval(idleIntervalRef.current)
    }
  }, [volunteer, incidents, onArrival])

  const icon = useMemo(() => createVolunteerIcon(volunteer.status), [volunteer.status])

  return (
    <Marker
      ref={markerRef}
      position={[volunteer.lat, volunteer.lng]}
      icon={icon}
    />
  )
}

function MapView({ selectedUnit, onUnitSelect, volunteers = [], incidents = [], onVolunteerArrival = () => {} }) {
  const flyToCenter = useMemo(() => {
    if (selectedUnit) {
      return [selectedUnit.lat, selectedUnit.lng]
    }
    return null
  }, [selectedUnit])

  const incidentMarkers = useMemo(() => {
    return incidents.map(incident => {
      const severity = incident.severity.toLowerCase()
      const isResolved = incident.status === 'resolved'
      const icon = createIncidentIcon(severity, isResolved)

      return (
        <Marker
          key={incident.id}
          position={[incident.lat, incident.lng]}
          icon={icon}
        >
          <Popup className="incident-popup">
            <div className="popup-content">
              <div className="popup-header">
                <strong>{incident.type}</strong>
                <span className={`popup-severity severity-${severity}`}>{incident.severity}</span>
              </div>
              <div className="popup-location">{incident.location}</div>
              <div className="popup-summary">{incident.summary}</div>
              <div className="popup-status">Status: {incident.status.toUpperCase()}</div>
            </div>
          </Popup>
        </Marker>
      )
    })
  }, [incidents])

  return (
    <MapContainer
      center={[40.7128, -74.0060]}
      zoom={12}
      minZoom={10}
      maxZoom={18}
      className="map-container"
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {flyToCenter && <FlyToLocation center={flyToCenter} zoom={14} />}
      {incidentMarkers}
      {volunteers.map(volunteer => (
        <AnimatedVolunteerMarker
          key={volunteer.id}
          volunteer={volunteer}
          incidents={incidents}
          onArrival={onVolunteerArrival}
        />
      ))}
    </MapContainer>
  )
}

export default MapView
