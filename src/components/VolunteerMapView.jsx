import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import './MapView.css'

function VolunteerMapView({ volunteerLocation, assignedIncident }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const volunteerMarkerRef = useRef(null)
  const incidentMarkerRef = useRef(null)

  // Initialize map
  useEffect(() => {
    if (map.current) return

    // Set Mapbox access token globally
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: volunteerLocation ? [volunteerLocation.lng, volunteerLocation.lat] : [-74.0060, 40.7128],
      zoom: 13,
      minZoom: 10,
      maxZoom: 18,
      attributionControl: false
    })

    map.current.on('error', (e) => {
      console.error('Mapbox error:', e)
    })

    map.current.on('load', () => {
      map.current.resize()
    })
  }, [])

  // Update volunteer marker
  useEffect(() => {
    if (!map.current || !volunteerLocation) return

    // Remove existing volunteer marker
    if (volunteerMarkerRef.current) {
      volunteerMarkerRef.current.remove()
    }

    // Create volunteer marker
    const el = document.createElement('div')
    el.className = 'volunteer-location-marker'
    
    const marker = new mapboxgl.Marker(el)
      .setLngLat([volunteerLocation.lng, volunteerLocation.lat])
      .addTo(map.current)

    volunteerMarkerRef.current = marker

    // Center map on volunteer location
    map.current.flyTo({
      center: [volunteerLocation.lng, volunteerLocation.lat],
      zoom: 13,
      duration: 1000
    })
  }, [volunteerLocation])

  // Update incident marker
  useEffect(() => {
    if (!map.current) return

    // Remove existing incident marker
    if (incidentMarkerRef.current) {
      incidentMarkerRef.current.remove()
    }

    if (assignedIncident) {
      // Create incident marker
      const el = document.createElement('div')
      el.className = `marker marker-severity-${assignedIncident.severity.toLowerCase()}`
      
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: false,
        className: 'incident-popup'
      }).setHTML(`
        <div class="popup-content">
          <div class="popup-header">
            <strong>${assignedIncident.type}</strong>
            <span class="popup-severity severity-${assignedIncident.severity.toLowerCase()}">${assignedIncident.severity}</span>
          </div>
          <div class="popup-location">${assignedIncident.location}</div>
          <div class="popup-summary">${assignedIncident.description}</div>
        </div>
      `)
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([assignedIncident.lng, assignedIncident.lat])
        .setPopup(popup)
        .addTo(map.current)

      incidentMarkerRef.current = marker

      // Show both markers with bounds
      if (volunteerLocation) {
        const bounds = new mapboxgl.LngLatBounds()
        bounds.extend([volunteerLocation.lng, volunteerLocation.lat])
        bounds.extend([assignedIncident.lng, assignedIncident.lat])
        map.current.fitBounds(bounds, { padding: 50, duration: 1000 })
      }
    }
  }, [assignedIncident, volunteerLocation])

  return <div ref={mapContainer} className="map-container" />
}

export default VolunteerMapView


