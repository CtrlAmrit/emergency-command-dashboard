import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import './MapView.css'

function MapView({ selectedUnit, onUnitSelect, volunteers = [], incidents = [], onVolunteerArrival = () => {} }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const incidentMarkersRef = useRef([])
  const volunteerMarkersRef = useRef([])
  const animationFramesRef = useRef({})
  const idleIntervalsRef = useRef({})
  const hoveredIncidentRef = useRef(null)

 
  useEffect(() => {
    if (map.current) return

    
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW1yaXRpc2hlcmUiLCJhIjoiY21qcGZvdGZlMWZmOTNlc2U3d2phZTB3NCJ9.KG32kJk-9vKFGNE87uJgNw'

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-74.0060, 40.7128],
      zoom: 12,
      minZoom: 10,
      maxZoom: 18,
      attributionControl: false
    })

    // Add error handling
    map.current.on('error', (e) => {
      console.error('Mapbox error:', e)
    })

    // Ensure map loads properly
    map.current.on('load', () => {
      map.current.resize()
    })
  }, [])

  // Add/update incident markers
  useEffect(() => {
    if (!map.current || incidents.length === 0) return

    // Clear existing incident markers
    incidentMarkersRef.current.forEach(({ marker }) => {
      if (marker) marker.remove()
    })
    incidentMarkersRef.current = []

    const now = Date.now()

    // Add markers for each incident
    incidents.forEach(incident => {
      const el = document.createElement('div')
      const severity = incident.severity.toLowerCase()
      const isResolved = incident.status === 'resolved'
      
      // Calculate time unresolved (in minutes)
      const reportedTime = incident.reportedTime || now
      const timeUnresolved = (now - reportedTime) / 1000 / 60 // minutes
      
      // Determine pulse intensity and speed based on time unresolved
      let pulseIntensity = 1
      let pulseSpeed = 2 // seconds
      let pulseScale = 1.1
      let shadowSize = 4
      
      if (!isResolved) {
        // Increase intensity over time (max at 30 minutes)
        const intensityFactor = Math.min(timeUnresolved / 30, 1)
        pulseIntensity = 1 + (intensityFactor * 1.5) // 1 to 2.5
        pulseScale = 1.1 + (intensityFactor * 0.2) // 1.1 to 1.3
        shadowSize = 4 + (intensityFactor * 8) // 4 to 12
        
        // For critical incidents, pulse faster over time
        if (severity === 'critical') {
          pulseSpeed = Math.max(0.8, 2 - (intensityFactor * 1.2)) // 2s down to 0.8s
        } else {
          pulseSpeed = Math.max(1.2, 2 - (intensityFactor * 0.6)) // 2s down to 1.2s
        }
      }
      
      el.className = `marker marker-severity-${severity} ${isResolved ? 'marker-resolved' : ''}`
      
      // Apply dynamic styles based on time unresolved
      if (!isResolved) {
        el.style.setProperty('--pulse-intensity', pulseIntensity.toString())
        el.style.setProperty('--pulse-speed', `${pulseSpeed}s`)
        el.style.setProperty('--pulse-scale', pulseScale.toString())
        el.style.setProperty('--shadow-size', `${shadowSize}px`)
      }
      
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: false,
        className: 'incident-popup'
      }).setHTML(`
        <div class="popup-content">
          <div class="popup-header">
            <strong>${incident.type}</strong>
            <span class="popup-severity severity-${severity}">${incident.severity}</span>
          </div>
          <div class="popup-location">${incident.location}</div>
          <div class="popup-summary">${incident.summary}</div>
          <div class="popup-status">Status: ${incident.status.toUpperCase()}</div>
        </div>
      `)
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([incident.lng, incident.lat])
        .setPopup(popup)
        .addTo(map.current)

      // Handle hover effects
      const handleMouseEnter = () => {
        hoveredIncidentRef.current = incident.id
        popup.addTo(map.current)
        
        // Add focus ring to hovered marker
        el.classList.add('marker-hovered')
        
        // Dim other incident markers
        incidentMarkersRef.current.forEach(({ id, element: otherEl }) => {
          if (id !== incident.id && otherEl) {
            otherEl.classList.add('marker-dimmed')
          }
        })
        
        // Highlight related volunteer markers
        volunteerMarkersRef.current.forEach(({ volunteer, element: volunteerEl }) => {
          if (volunteerEl && volunteer.assignedIncidentId === incident.id) {
            volunteerEl.classList.add('volunteer-highlighted')
          }
        })
      }
      
      const handleMouseLeave = () => {
        hoveredIncidentRef.current = null
        popup.remove()
        
        // Remove focus ring
        el.classList.remove('marker-hovered')
        
        // Remove dimming from other markers
        incidentMarkersRef.current.forEach(({ element: otherEl }) => {
          if (otherEl) {
            otherEl.classList.remove('marker-dimmed')
          }
        })
        
        // Remove highlighting from volunteer markers
        volunteerMarkersRef.current.forEach(({ element: volunteerEl }) => {
          if (volunteerEl) {
            volunteerEl.classList.remove('volunteer-highlighted')
          }
        })
      }

      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)

      incidentMarkersRef.current.push({ id: incident.id, marker, element: el, incident })
    })
  }, [incidents])

  // Update pulse intensity periodically for unresolved incidents
  useEffect(() => {
    const updatePulseIntensity = () => {
      const now = Date.now()
      
      incidentMarkersRef.current.forEach(({ element, incident }) => {
        if (!element || !incident) return
        
        const isResolved = incident.status === 'resolved'
        if (isResolved) return
        
        const reportedTime = incident.reportedTime || now
        const timeUnresolved = (now - reportedTime) / 1000 / 60 // minutes
        
        const intensityFactor = Math.min(timeUnresolved / 30, 1)
        const pulseIntensity = 1 + (intensityFactor * 1.5)
        const pulseScale = 1.1 + (intensityFactor * 0.2)
        const shadowSize = 4 + (intensityFactor * 8)
        
        const severity = incident.severity.toLowerCase()
        let pulseSpeed = 2
        if (severity === 'critical') {
          pulseSpeed = Math.max(0.8, 2 - (intensityFactor * 1.2))
        } else {
          pulseSpeed = Math.max(1.2, 2 - (intensityFactor * 0.6))
        }
        
        element.style.setProperty('--pulse-intensity', pulseIntensity.toString())
        element.style.setProperty('--pulse-speed', `${pulseSpeed}s`)
        element.style.setProperty('--pulse-scale', pulseScale.toString())
        element.style.setProperty('--shadow-size', `${shadowSize}px`)
      })
    }
    
    // Update every 10 seconds
    const interval = setInterval(updatePulseIntensity, 10000)
    updatePulseIntensity() // Initial update
    
    return () => clearInterval(interval)
  }, [incidents])

  // Add/update volunteer markers and handle animations
  useEffect(() => {
    if (!map.current || volunteers.length === 0) return

    // Clear existing volunteer markers
    volunteerMarkersRef.current.forEach(marker => marker.marker.remove())
    volunteerMarkersRef.current = []
    
    // Cancel any ongoing animations
    Object.values(animationFramesRef.current).forEach(frameId => cancelAnimationFrame(frameId))
    animationFramesRef.current = {}

    // Clear all idle intervals
    Object.values(idleIntervalsRef.current).forEach(intervalId => clearInterval(intervalId))
    idleIntervalsRef.current = {}

    volunteers.forEach(volunteer => {
      const el = document.createElement('div')
      el.className = `volunteer-marker volunteer-marker-${volunteer.status}`
      el.innerHTML = '<div class="volunteer-marker-inner"></div>'
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([volunteer.lng, volunteer.lat])
        .addTo(map.current)

      const markerData = { id: volunteer.id, marker, volunteer, baseLat: volunteer.lat, baseLng: volunteer.lng, element: el }
      volunteerMarkersRef.current.push(markerData)

      // Animate volunteer moving toward incident if en-route
      if (volunteer.status === 'en-route' && volunteer.assignedIncidentId) {
        // Stop any idle motion
        if (idleIntervalsRef.current[volunteer.id]) {
          clearInterval(idleIntervalsRef.current[volunteer.id])
          delete idleIntervalsRef.current[volunteer.id]
        }
        const incident = incidents.find(inc => inc.id === volunteer.assignedIncidentId)
        if (incident) {
          animateVolunteerToIncident(markerData, incident)
        }
      }
      // Stop idle motion if on-scene
      else if (volunteer.status === 'on-scene') {
        if (idleIntervalsRef.current[volunteer.id]) {
          clearInterval(idleIntervalsRef.current[volunteer.id])
          delete idleIntervalsRef.current[volunteer.id]
        }
      }
      // Add idle motion for standby or pending volunteers
      else if (volunteer.status === 'standby' || volunteer.status === 'pending') {
        startIdleMotion(markerData)
      }
    })
  }, [volunteers, incidents])

  const startIdleMotion = (markerData) => {
    const { id, marker, baseLat, baseLng } = markerData
    
    // Clear any existing interval for this marker
    if (idleIntervalsRef.current[id]) {
      clearInterval(idleIntervalsRef.current[id])
    }

    // Get current position as base (in case marker has moved)
    const currentPos = marker.getLngLat()
    let currentBaseLat = currentPos.lat
    let currentBaseLng = currentPos.lng

    // Generate subtle random movement every 3-5 seconds
    const moveInterval = () => {
      // Very small random offset (about 0.0001 to 0.0002 degrees, roughly 10-20 meters)
      // This is subtle enough to not be distracting
      const offsetLat = (Math.random() - 0.5) * 0.0002
      const offsetLng = (Math.random() - 0.5) * 0.0002
      
      const newLat = currentBaseLat + offsetLat
      const newLng = currentBaseLng + offsetLng
      
      // Smooth transition to new position
      const startLat = marker.getLngLat().lat
      const startLng = marker.getLngLat().lng
      const duration = 2000 // 2 seconds for very smooth, subtle movement
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Ease in-out for smooth motion
        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2

        const currentLat = startLat + (newLat - startLat) * easeProgress
        const currentLng = startLng + (newLng - startLng) * easeProgress

        marker.setLngLat([currentLng, currentLat])

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          // Update base position after movement completes
          currentBaseLat = newLat
          currentBaseLng = newLng
        }
      }

      requestAnimationFrame(animate)
    }

    // Initial movement after a short delay
    setTimeout(() => {
      moveInterval()
    }, 1500)

    // Then move every 4-6 seconds (less frequent for subtlety)
    const intervalId = setInterval(() => {
      moveInterval()
    }, 4000 + Math.random() * 2000) // Random between 4-6 seconds

    idleIntervalsRef.current[id] = intervalId
  }

  const animateVolunteerToIncident = (markerData, incident) => {
    const { marker, volunteer } = markerData
    const startLat = volunteer.lat
    const startLng = volunteer.lng
    const endLat = incident.lat
    const endLng = incident.lng

    const duration = 3000 // 3 seconds
    const startTime = Date.now()
    const distance = Math.sqrt(
      Math.pow(endLat - startLat, 2) + Math.pow(endLng - startLng, 2)
    )

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      const currentLat = startLat + (endLat - startLat) * easeProgress
      const currentLng = startLng + (endLng - startLng) * easeProgress

      marker.setLngLat([currentLng, currentLat])

      if (progress < 1) {
        animationFramesRef.current[volunteer.id] = requestAnimationFrame(animate)
      } else {
        // Volunteer arrived at incident
        delete animationFramesRef.current[volunteer.id]
        onVolunteerArrival(volunteer.id, incident.id)
      }
    }

    animationFramesRef.current[volunteer.id] = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (selectedUnit && map.current) {
      map.current.flyTo({
        center: [selectedUnit.lng, selectedUnit.lat],
        zoom: 14,
        duration: 1000
      })
    }
  }, [selectedUnit])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all idle intervals
      Object.values(idleIntervalsRef.current).forEach(intervalId => clearInterval(intervalId))
      idleIntervalsRef.current = {}
      // Clear all animation frames
      Object.values(animationFramesRef.current).forEach(frameId => cancelAnimationFrame(frameId))
      animationFramesRef.current = {}
    }
  }, [])

  return <div ref={mapContainer} className="map-container" />
}

export default MapView

