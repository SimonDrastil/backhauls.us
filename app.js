const GEOAPIFY_API_KEY = 'd2f92aeb8b774dbcbd4aacbb3158f1a0';

const trips = [
  {
    id: 't1',
    origin: 'Dallas, TX',
    destination: 'Atlanta, GA',
    price: 1450,
    capacity: 12000,
    type: 'truck',
    date: '2025-09-22',
    time: '08:00',
    rating: 4.9,
    carrier: 'Nebula Freight',
    vehicle: "53' Dry Van",
    distance: '781 mi',
  },
  {
    id: 't2',
    origin: 'Chicago, IL',
    destination: 'New York, NY',
    price: 1750,
    capacity: 9000,
    type: 'truck',
    date: '2025-09-21',
    time: '19:00',
    rating: 4.8,
    carrier: 'Aurora Transport',
    vehicle: 'Reefer',
    distance: '790 mi',
  },
  {
    id: 't3',
    origin: 'Los Angeles, CA',
    destination: 'Denver, CO',
    price: 5200,
    capacity: 18000,
    type: 'plane',
    date: '2025-09-20',
    time: '05:30',
    rating: 5,
    carrier: 'Stratos Air Cargo',
    vehicle: 'Boeing 767F',
    distance: '830 mi',
  },
  {
    id: 't4',
    origin: 'Seattle, WA',
    destination: 'San Francisco, CA',
    price: 2200,
    capacity: 24000,
    type: 'truck',
    date: '2025-09-24',
    time: '06:00',
    rating: 4.7,
    carrier: 'Cascade Logistics',
    vehicle: 'Flatbed',
    distance: '807 mi',
  },
  {
    id: 't5',
    origin: 'Houston, TX',
    destination: 'Miami, FL',
    price: 6100,
    capacity: 33000,
    type: 'ship',
    date: '2025-09-27',
    time: '09:00',
    rating: 4.6,
    carrier: 'Bluewave Maritime',
    vehicle: 'Feeder Vessel',
    distance: '1,180 nm',
  },
  {
    id: 't6',
    origin: 'Phoenix, AZ',
    destination: 'Kansas City, MO',
    price: 1980,
    capacity: 15000,
    type: 'truck',
    date: '2025-09-23',
    time: '13:30',
    rating: 4.9,
    carrier: 'Horizon Haulers',
    vehicle: '48\' Dry Van',
    distance: '1,267 mi',
  },
  {
    id: 't7',
    origin: 'Boston, MA',
    destination: 'Detroit, MI',
    price: 1890,
    capacity: 8000,
    type: 'truck',
    date: '2025-09-19',
    time: '07:45',
    rating: 4.8,
    carrier: 'Quantum Freight',
    vehicle: 'Box Truck',
    distance: '713 mi',
  },
];

const cityCoordinates = {
  'Dallas, TX': { lat: 32.7767, lon: -96.797 },
  'Atlanta, GA': { lat: 33.749, lon: -84.388 },
  'Chicago, IL': { lat: 41.8781, lon: -87.6298 },
  'New York, NY': { lat: 40.7128, lon: -74.006 },
  'Los Angeles, CA': { lat: 34.0522, lon: -118.2437 },
  'Denver, CO': { lat: 39.7392, lon: -104.9903 },
  'Seattle, WA': { lat: 47.6062, lon: -122.3321 },
  'San Francisco, CA': { lat: 37.7749, lon: -122.4194 },
  'Houston, TX': { lat: 29.7604, lon: -95.3698 },
  'Miami, FL': { lat: 25.7617, lon: -80.1918 },
  'Phoenix, AZ': { lat: 33.4484, lon: -112.074 },
  'Kansas City, MO': { lat: 39.0997, lon: -94.5786 },
  'Boston, MA': { lat: 42.3601, lon: -71.0589 },
  'Detroit, MI': { lat: 42.3314, lon: -83.0458 },
  'Nashville, TN': { lat: 36.1627, lon: -86.7816 },
  'Portland, OR': { lat: 45.5152, lon: -122.6784 },
  'Las Vegas, NV': { lat: 36.1699, lon: -115.1398 },
  'Charlotte, NC': { lat: 35.2271, lon: -80.8431 },
  'Minneapolis, MN': { lat: 44.9778, lon: -93.265 },
  'Salt Lake City, UT': { lat: 40.7608, lon: -111.891 },
};

const carrierActiveTripsData = [
  { route: 'Dallas → Atlanta', status: 'In transit', badge: 'en route', eta: 'ETA 10:45' },
  { route: 'Chicago → NYC', status: 'Loading', badge: 'loading', eta: 'Gate 24B' },
  { route: 'Seattle → SF', status: 'Delayed weather', badge: 'delay', eta: '2h hold' },
];

const shipperBookingsData = [
  { reference: 'BH-4821', route: 'Houston → Miami', status: 'Confirmed', badge: 'confirmed', date: 'Sep 27' },
  { reference: 'BH-4739', route: 'Dallas → Atlanta', status: 'Dispatched', badge: 'en route', date: 'Sep 22' },
  { reference: 'BH-4715', route: 'Chicago → NYC', status: 'Arrived', badge: 'delivered', date: 'Sep 18' },
];

const shipperTimelineData = [
  { time: 'Today 10:00', event: 'BH-4739 loading Dallas terminal' },
  { time: 'Today 18:00', event: 'BH-4715 delivered at Newark crossdock' },
  { time: 'Tomorrow 09:00', event: 'BH-4821 departs Port Houston' },
];

const demandCapacityData = [78, 64, 92, 88, 74, 96, 82];

let currentFilters = {
  origin: '',
  destination: '',
  date: '',
  vehicle: 'all',
  capacity: 0,
};

let selectedTripId = null;
let bookingState = { step: 1, trip: null, form: {} };

const mapContainer = document.getElementById('mapContainer');
const detailDrawer = document.getElementById('detailDrawer');
const drawerContent = document.getElementById('drawerContent');
const bookingModal = document.getElementById('bookingModal');
const bookingSteps = document.getElementById('bookingSteps');
const capacityRange = document.getElementById('capacityRange');
const capacityLabel = document.getElementById('capacityLabel');
const heroGlobeCanvas = document.getElementById('heroGlobe');
const scrollProgressBar = document.getElementById('scrollProgress');

let map;
let mapReady = false;
const mapMarkers = [];
const routeSourceId = 'selected-route';
const routeLayerId = 'selected-route-layer';
const emptyRouteGeoJSON = { type: 'FeatureCollection', features: [] };
let heroGlobeContext = null;

function getCityCoordinate(city) {
  return cityCoordinates[city] || null;
}

function computeMarkerPosition(trip) {
  const origin = getCityCoordinate(trip.origin);
  const destination = getCityCoordinate(trip.destination);
  if (!origin || !destination) return null;
  return {
    lat: (origin.lat + destination.lat) / 2,
    lon: (origin.lon + destination.lon) / 2,
  };
}

function getGlobeArcs() {
  return trips
    .map((trip) => {
      const origin = getCityCoordinate(trip.origin);
      const destination = getCityCoordinate(trip.destination);
      if (!origin || !destination) return null;
      return {
        startLat: origin.lat,
        startLng: origin.lon,
        endLat: destination.lat,
        endLng: destination.lon,
        highlight: Boolean(trip.highlight),
      };
    })
    .filter(Boolean);
}

function clearMarkers() {
  while (mapMarkers.length) {
    const marker = mapMarkers.pop();
    marker.remove();
  }
}

async function ensureCityCoordinate(city) {
  if (!city) return null;
  if (cityCoordinates[city]) return cityCoordinates[city];

  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&limit=1&apiKey=${GEOAPIFY_API_KEY}`
    );
    if (!response.ok) throw new Error('Geoapify geocoding failed');
    const data = await response.json();
    const feature = data.features && data.features[0];
    if (!feature) return null;
    const { lat, lon } = feature.properties;
    const latNum = Number(lat);
    const lonNum = Number(lon);
    if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) return null;
    cityCoordinates[city] = { lat: latNum, lon: lonNum };
    return cityCoordinates[city];
  } catch (error) {
    console.error('Failed to geocode city', city, error);
    return null;
  }
}

function formatPrice(amount) {
  return `$${amount.toLocaleString()}`;
}

function applyFilters(trip) {
  const { origin, destination, date, vehicle, capacity } = currentFilters;
  if (origin && !trip.origin.toLowerCase().includes(origin.toLowerCase())) return false;
  if (destination && !trip.destination.toLowerCase().includes(destination.toLowerCase())) return false;
  if (date && trip.date < date) return false;
  if (vehicle !== 'all' && trip.type !== vehicle) return false;
  if (capacity && trip.capacity < capacity) return false;
  return true;
}

function renderMarkers() {
  if (!mapReady) return;
  clearMarkers();

  const filteredTrips = trips.filter(applyFilters);
  let selectionVisible = false;

  filteredTrips.forEach((trip) => {
    const position = computeMarkerPosition(trip);
    if (!position) return;

    const markerElement = document.createElement('button');
    markerElement.className = 'map-marker';
    markerElement.dataset.id = trip.id;
    markerElement.dataset.type = trip.type;
    markerElement.innerHTML = `<span class="price">${formatPrice(trip.price)}</span><span>${trip.destination.split(',')[0]}</span>`;

    if (trip.highlight) {
      markerElement.classList.add('new');
    }

    if (trip.id === selectedTripId) {
      markerElement.classList.add('active');
      selectionVisible = true;
    }

    markerElement.addEventListener('click', (event) => {
      event.stopPropagation();
      selectedTripId = trip.id;
      renderMarkers();
      openDrawer(trip);
    });

    const mapMarker = new maplibregl.Marker({ element: markerElement, anchor: 'bottom' })
      .setLngLat([position.lon, position.lat])
      .addTo(map);

    mapMarkers.push(mapMarker);
  });

  if (selectedTripId && !selectionVisible) {
    selectedTripId = null;
    detailDrawer.classList.remove('open');
    drawerContent.innerHTML = '<p>Select a route to see details.</p>';
    clearRoute();
  }

  updateHeroGlobeArcs();
}

function focusOnTrip(trip) {
  if (!mapReady) return;
  const origin = getCityCoordinate(trip.origin);
  const destination = getCityCoordinate(trip.destination);
  if (!origin || !destination) return;

  const bounds = new maplibregl.LngLatBounds(
    [origin.lon, origin.lat],
    [origin.lon, origin.lat]
  );
  bounds.extend([destination.lon, destination.lat]);

  if (Math.abs(origin.lat - destination.lat) < 0.01 && Math.abs(origin.lon - destination.lon) < 0.01) {
    map.flyTo({ center: [origin.lon, origin.lat], zoom: 7.2, essential: true });
    return;
  }

  map.fitBounds(bounds, { padding: 100, duration: 1200, maxZoom: 7.5 });
}

function highlightRoute(trip) {
  if (!mapReady || !map.getSource(routeSourceId)) return;
  const origin = getCityCoordinate(trip.origin);
  const destination = getCityCoordinate(trip.destination);
  if (!origin || !destination) return;

  const featureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [origin.lon, origin.lat],
            [destination.lon, destination.lat],
          ],
        },
      },
    ],
  };

  map.getSource(routeSourceId).setData(featureCollection);
}

function clearRoute() {
  if (!mapReady || !map.getSource(routeSourceId)) return;
  map.getSource(routeSourceId).setData(emptyRouteGeoJSON);
}

function openDrawer(trip) {
  drawerContent.innerHTML = `
    <div class="trip-summary">
      <div><span>Carrier</span><strong>${trip.carrier}</strong></div>
      <div><span>Rating</span><strong>${trip.rating.toFixed(1)} ★</strong></div>
      <div><span>Equipment</span><strong>${trip.vehicle}</strong></div>
      <div><span>Capacity left</span><strong>${trip.capacity.toLocaleString()} lbs</strong></div>
    </div>
    <div class="detail-grid">
      <div>
        <span>From</span>
        <strong>${trip.origin}</strong>
      </div>
      <div>
        <span>To</span>
        <strong>${trip.destination}</strong>
      </div>
      <div>
        <span>Departure</span>
        <strong>${trip.date} · ${trip.time}</strong>
      </div>
      <div>
        <span>Rate</span>
        <strong>${formatPrice(trip.price)}</strong>
      </div>
      <div>
        <span>Distance</span>
        <strong>${trip.distance}</strong>
      </div>
    </div>
    <p>Smart contract generated instantly. Payment released on proof of delivery.</p>
    <button class="btn accent" id="bookNow">Book Now</button>
  `;
  detailDrawer.classList.add('open');
  drawerContent.querySelector('#bookNow').addEventListener('click', () => openBookingModal(trip));
  highlightRoute(trip);
  focusOnTrip(trip);
}

function closeDrawer() {
  detailDrawer.classList.remove('open');
  selectedTripId = null;
  drawerContent.innerHTML = '<p>Select a route to see details.</p>';
  clearRoute();
  renderMarkers();
}

document.getElementById('closeDrawer').addEventListener('click', closeDrawer);

capacityRange.addEventListener('input', (event) => {
  const value = Number(event.target.value);
  currentFilters.capacity = value;
  capacityLabel.textContent = `${value.toLocaleString()} lbs`;
  renderMarkers();
});

['origin', 'destination'].forEach((field) => {
  const input = document.getElementById(`${field}Input`);
  input.addEventListener('input', (event) => {
    currentFilters[field] = event.target.value.trim();
    renderMarkers();
  });
});

document.getElementById('dateInput').addEventListener('change', (event) => {
  currentFilters.date = event.target.value;
  renderMarkers();
});

const vehicleFilter = document.getElementById('vehicleFilter');
vehicleFilter.addEventListener('click', (event) => {
  if (!event.target.matches('.chip')) return;
  vehicleFilter.querySelectorAll('.chip').forEach((chip) => chip.classList.remove('active'));
  event.target.classList.add('active');
  currentFilters.vehicle = event.target.dataset.type;
  renderMarkers();
});

document.getElementById('clearFilters').addEventListener('click', () => {
  currentFilters = { origin: '', destination: '', date: '', vehicle: 'all', capacity: 0 };
  document.getElementById('originInput').value = '';
  document.getElementById('destinationInput').value = '';
  document.getElementById('dateInput').value = '';
  capacityRange.value = 0;
  capacityLabel.textContent = '0 lbs';
  vehicleFilter.querySelectorAll('.chip').forEach((chip) => chip.classList.toggle('active', chip.dataset.type === 'all'));
  closeDrawer();
});

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
  }
}

function closeModal(modal) {
  modal.classList.remove('open');
}

document.querySelectorAll('[data-open]').forEach((trigger) => {
  trigger.addEventListener('click', () => openModal(trigger.dataset.open));
});

document.querySelectorAll('.modal').forEach((modal) => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.hasAttribute('data-close')) {
      closeModal(modal);
    }
  });
});

function openBookingModal(trip) {
  bookingState = { step: 1, trip, form: {} };
  updateBookingModal();
  openModal('bookingModal');
}

function updateBookingModal() {
  const { step, trip, form } = bookingState;
  if (!trip) return;
  if (step === 1) {
    bookingSteps.innerHTML = `
      <h3 class="step-title">Confirm your backhaul</h3>
      <div class="detail-grid">
        <div><span>Route</span><strong>${trip.origin} → ${trip.destination}</strong></div>
        <div><span>Departure</span><strong>${trip.date} · ${trip.time}</strong></div>
        <div><span>Rate</span><strong>${formatPrice(trip.price)}</strong></div>
        <div><span>Capacity available</span><strong>${trip.capacity.toLocaleString()} lbs</strong></div>
      </div>
      <button class="btn accent" id="bookingStepContinue">Add shipment details</button>
    `;
    document.getElementById('bookingStepContinue').addEventListener('click', () => {
      bookingState.step = 2;
      updateBookingModal();
    });
    return;
  }

  if (step === 2) {
    bookingSteps.innerHTML = `
      <h3 class="step-title">Shipment details</h3>
      <form id="bookingForm" class="stacked-form">
        <label>Cargo type<input name="cargo" required placeholder="e.g. Consumer electronics" /></label>
        <label>Total weight (lbs)<input name="weight" type="number" min="100" required /></label>
        <label>Dimensions (L × W × H)<input name="dimensions" placeholder="e.g. 48 × 40 × 60 in" /></label>
        <label>Special instructions<textarea name="instructions" rows="3" placeholder="Dock hours, handling, etc."></textarea></label>
        <div class="form-actions">
          <button class="btn ghost" type="button" id="bookingBack">Back</button>
          <button class="btn accent" type="submit">Review booking</button>
        </div>
      </form>
    `;
    document.getElementById('bookingBack').addEventListener('click', () => {
      bookingState.step = 1;
      updateBookingModal();
    });
    document.getElementById('bookingForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.target).entries());
      bookingState.form = data;
      bookingState.step = 3;
      updateBookingModal();
    });
    return;
  }

  if (step === 3) {
    bookingSteps.innerHTML = `
      <h3 class="step-title">Confirm booking</h3>
      <div class="detail-grid">
        <div><span>Cargo</span><strong>${form.cargo}</strong></div>
        <div><span>Weight</span><strong>${Number(form.weight).toLocaleString()} lbs</strong></div>
        <div><span>Dimensions</span><strong>${form.dimensions || 'Standard pallets'}</strong></div>
        <div><span>Special instructions</span><strong>${form.instructions || 'None'}</strong></div>
      </div>
      <div class="confirm-card">
        <p>Total due</p>
        <p class="price">${formatPrice(trip.price)}</p>
        <button class="btn accent" id="confirmBooking">Confirm Booking</button>
      </div>
    `;
    document.getElementById('confirmBooking').addEventListener('click', () => {
      recordBooking(trip, form);
      bookingState.step = 4;
      updateBookingModal();
    });
    return;
  }

  if (step === 4) {
    bookingSteps.innerHTML = `
      <div class="confirm-card">
        <div class="success-icon">✓</div>
        <h3>Your Backhaul is confirmed!</h3>
        <p>We just reserved ${formatPrice(trip.price)} for ${trip.origin} → ${trip.destination}. Documents and tracking are live in your shipper workspace.</p>
        <button class="btn secondary" id="closeSuccess">Close</button>
      </div>
    `;
    document.getElementById('closeSuccess').addEventListener('click', () => closeModal(bookingModal));
  }
}

function recordBooking(trip, form) {
  const reference = `BH-${Math.floor(4000 + Math.random() * 1000)}`;
  shipperBookingsData.unshift({
    reference,
    route: `${trip.origin.split(',')[0]} → ${trip.destination.split(',')[0]}`,
    status: 'Confirmed',
    badge: 'confirmed',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  });
  renderShipperBookings();
  shipperTimelineData.unshift({
    time: 'Now',
    event: `${reference} booked for ${trip.date}`,
  });
  renderShipperTimeline();
}

function renderCarrierActiveTrips() {
  const list = document.getElementById('carrierActiveTrips');
  list.innerHTML = '';
  carrierActiveTripsData.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'status-item';
    const badgeClass = item.badge === 'delay' ? 'badge warning' : 'badge';
    li.innerHTML = `<div><strong>${item.route}</strong><div class="metric-sub">${item.status}</div></div><span class="${badgeClass}">${item.badge}</span>`;
    list.appendChild(li);
  });
}

function renderShipperBookings() {
  const list = document.getElementById('shipperBookings');
  list.innerHTML = '';
  shipperBookingsData.slice(0, 6).forEach((item) => {
    const li = document.createElement('li');
    li.className = 'status-item';
    let badgeClass = 'badge';
    if (item.badge === 'delivered') badgeClass += ' success';
    if (item.badge === 'confirmed') badgeClass += '';
    li.innerHTML = `<div><strong>${item.reference}</strong><div class="metric-sub">${item.route} · ${item.date}</div></div><span class="${badgeClass}">${item.badge}</span>`;
    list.appendChild(li);
  });
}

function renderShipperTimeline() {
  const timeline = document.getElementById('shipperTimeline');
  timeline.innerHTML = '';
  shipperTimelineData.slice(0, 5).forEach((item) => {
    const div = document.createElement('div');
    div.className = 'timeline-item';
    div.innerHTML = `<div class="metric-sub">${item.time}</div><div><strong>${item.event}</strong></div>`;
    timeline.appendChild(div);
  });
}

function renderDemandChart() {
  const container = document.getElementById('demandChart');
  container.innerHTML = '';
  demandCapacityData.forEach((value) => {
    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    bar.style.height = `${value}%`;
    container.appendChild(bar);
  });
}

function handleCarrierForm() {
  const form = document.getElementById('carrierForm');
  const note = document.getElementById('carrierFormNote');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    note.textContent = 'Publishing your backhaul…';
    note.style.color = 'var(--text-muted)';

    const [originCoords, destinationCoords] = await Promise.all([
      ensureCityCoordinate(data.origin),
      ensureCityCoordinate(data.destination),
    ]);

    if (!originCoords || !destinationCoords) {
      note.textContent = 'We could not locate one of those cities. Please verify spelling or include the state.';
      note.style.color = '#ff6b6b';
      return;
    }

    const id = `t${trips.length + 1}`;
    const newTrip = {
      id,
      origin: data.origin,
      destination: data.destination,
      price: Number(data.price),
      capacity: Number(data.capacity),
      type: data.vehicle,
      date: data.date,
      time: data.time,
      rating: 4.6,
      carrier: 'Your Fleet',
      vehicle: 'Custom equipment',
      distance: `${Math.floor(Math.random() * 800) + 400} mi`,
      highlight: true,
    };
    trips.push(newTrip);
    selectedTripId = newTrip.id;
    renderMarkers();
    openDrawer(newTrip);
    note.textContent = `Backhaul ${data.origin} → ${data.destination} published to map.`;
    note.style.color = 'var(--green-light)';
    form.reset();
    setTimeout(() => {
      newTrip.highlight = false;
      renderMarkers();
    }, 6000);
  });
}

function initializeMap() {
  if (map) return;

  map = new maplibregl.Map({
    container: mapContainer,
    style: `https://maps.geoapify.com/v1/styles/dark-matter/style.json?apiKey=${GEOAPIFY_API_KEY}`,
    center: [-98.5795, 39.8283],
    zoom: 4,
    pitch: 0,
    attributionControl: true,
  });

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

  window.addEventListener('resize', () => {
    if (mapReady) {
      map.resize();
    }
  });

  map.on('load', () => {
    mapReady = true;
    map.resize();
    if (!map.getSource(routeSourceId)) {
      map.addSource(routeSourceId, { type: 'geojson', data: emptyRouteGeoJSON });
    }
    if (!map.getLayer(routeLayerId)) {
      map.addLayer({
        id: routeLayerId,
        type: 'line',
        source: routeSourceId,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#2FB24C',
          'line-width': 4,
          'line-opacity': 0.85,
          'line-blur': 0.5,
        },
      });
    }
    renderMarkers();
  });
}

function attachFormHandlers() {
  document.getElementById('contactForm').addEventListener('submit', (event) => {
    event.preventDefault();
    event.target.reset();
    alert('Thanks for reaching out! A strategist will respond shortly.');
  });

  document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Login successful. Redirecting to your dashboard...');
  });

  document.getElementById('signupForm').addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Account created! Check your inbox for verification.');
  });

  document.getElementById('resetForm').addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Reset instructions sent to your email.');
  });
}

function initHeroGlobe() {
  if (!heroGlobeCanvas || typeof THREE === 'undefined' || typeof ThreeGlobe === 'undefined') {
    return;
  }

  const container = heroGlobeCanvas.parentElement;
  const renderer = new THREE.WebGLRenderer({ canvas: heroGlobeCanvas, alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 1000);
  camera.position.z = 240;

  const globe = new ThreeGlobe()
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
    .showAtmosphere(true)
    .atmosphereColor('#2fb24c')
    .atmosphereAltitude(0.18)
    .arcsData(getGlobeArcs())
    .arcColor((d) => (d.highlight ? ['#54D66C', '#2FB24C'] : ['#2FB24C', '#1552A2']))
    .arcAltitude((d) => (d.highlight ? 0.28 : 0.18))
    .arcStroke((d) => (d.highlight ? 1.6 : 1.1))
    .arcDashLength(0.85)
    .arcDashGap(1.7)
    .arcDashAnimateTime(2600)
    .pointsData([]);

  globe.rotation.y = Math.PI * 1.1;
  globe.globeMaterial().color = new THREE.Color('#0b3c8a');
  scene.add(globe);

  const ambient = new THREE.AmbientLight(0xffffff, 0.85);
  const hemisphere = new THREE.HemisphereLight(0x2fb24c, 0x050f20, 0.6);
  const directional = new THREE.DirectionalLight(0x72ffc2, 0.8);
  directional.position.set(-60, 70, 160);
  scene.add(ambient, hemisphere, directional);

  const stars = (() => {
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 420; i += 1) {
      const radius = 260 + Math.random() * 140;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * 2 * Math.PI;
      starVertices.push(
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      );
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: new THREE.Color('#54d66c'),
      size: 2.2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
    });
    return new THREE.Points(starGeometry, starMaterial);
  })();

  scene.add(stars);

  const resize = () => {
    if (!container) return;
    const bounds = container.getBoundingClientRect();
    const width = Math.max(1, bounds.width);
    const height = Math.max(1, bounds.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    heroGlobeCanvas.style.width = `${width}px`;
    heroGlobeCanvas.style.height = `${height}px`;
  };

  resize();
  window.addEventListener('resize', resize);

  const animate = () => {
    globe.rotation.y += 0.0016;
    stars.rotation.y += 0.0006;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();

  heroGlobeContext = { globe, renderer, camera, scene, stars, resize };
  updateHeroGlobeArcs();
}

function updateHeroGlobeArcs() {
  if (!heroGlobeContext || !heroGlobeContext.globe) return;
  heroGlobeContext.globe.arcsData(getGlobeArcs());
}

function smoothScrollTo(target, offset = 0) {
  const start = window.scrollY || window.pageYOffset;
  const end = target.getBoundingClientRect().top + start - offset;
  const change = end - start;
  const duration = Math.min(1400, Math.max(600, Math.abs(change) * 0.5));
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    window.scrollTo(0, start + change * eased);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

function initSmoothScroll() {
  const navLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  if (!navLinks.length) return;
  const header = document.querySelector('.top-nav');
  const offset = header ? header.getBoundingClientRect().height + 16 : 96;

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      event.preventDefault();
      smoothScrollTo(target, offset);
      history.pushState(null, '', hash);
    });
  });
}

function initScrollProgress() {
  if (!scrollProgressBar) return;
  const update = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0;
    scrollProgressBar.style.transform = `scaleX(${progress})`;
  };
  update();
  document.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

function initActiveNavTracking() {
  if (typeof IntersectionObserver === 'undefined') return;
  const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
  if (!navLinks.length) return;
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute('href').slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);
  if (!sections.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const match = link.getAttribute('href').slice(1) === id;
      link.classList.toggle('active', match);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length) {
        setActive(visible[0].target.id);
      }
    },
    { threshold: 0.35 }
  );

  sections.forEach((section) => observer.observe(section));
  setActive(sections[0].id);
}

function initCursorComet() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const comet = document.createElement('div');
  comet.className = 'cursor-comet';
  document.body.appendChild(comet);

  let targetX = 0;
  let targetY = 0;
  let rafId = null;
  let currentX = -100;
  let currentY = -100;

  const render = () => {
    currentX += (targetX - currentX) * 0.22;
    currentY += (targetY - currentY) * 0.22;
    comet.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    comet.style.opacity = '1';
    if (Math.abs(currentX - targetX) > 0.5 || Math.abs(currentY - targetY) > 0.5) {
      rafId = requestAnimationFrame(render);
    } else {
      rafId = null;
    }
  };

  document.addEventListener('pointermove', (event) => {
    targetX = event.clientX - comet.offsetWidth / 2;
    targetY = event.clientY - comet.offsetHeight / 2;
    if (!rafId) {
      rafId = requestAnimationFrame(render);
    }
  });

  document.addEventListener('pointerleave', () => {
    comet.style.opacity = '0';
  });
}

function init() {
  initializeMap();
  renderCarrierActiveTrips();
  renderShipperBookings();
  renderShipperTimeline();
  renderDemandChart();
  handleCarrierForm();
  attachFormHandlers();
  initHeroGlobe();
  initSmoothScroll();
  initScrollProgress();
  initActiveNavTracking();
  initCursorComet();
}

init();
