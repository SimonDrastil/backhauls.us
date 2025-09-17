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

const cityPositions = {
  'Dallas, TX': { top: 61, left: 47 },
  'Atlanta, GA': { top: 63, left: 55 },
  'Chicago, IL': { top: 44, left: 52 },
  'New York, NY': { top: 43, left: 64 },
  'Los Angeles, CA': { top: 65, left: 14 },
  'Denver, CO': { top: 52, left: 33 },
  'Seattle, WA': { top: 21, left: 12 },
  'San Francisco, CA': { top: 52, left: 14 },
  'Houston, TX': { top: 68, left: 47 },
  'Miami, FL': { top: 75, left: 60 },
  'Phoenix, AZ': { top: 60, left: 22 },
  'Kansas City, MO': { top: 52, left: 45 },
  'Boston, MA': { top: 39, left: 67 },
  'Detroit, MI': { top: 44, left: 54 },
  'Nashville, TN': { top: 58, left: 52 },
  'Portland, OR': { top: 24, left: 10 },
  'Las Vegas, NV': { top: 60, left: 19 },
  'Charlotte, NC': { top: 59, left: 57 },
  'Minneapolis, MN': { top: 37, left: 46 },
  'Salt Lake City, UT': { top: 53, left: 26 },
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

function getCityPosition(city) {
  return cityPositions[city] || { top: 50, left: 50 };
}

function computeMarkerPosition(trip) {
  const origin = getCityPosition(trip.origin);
  const destination = getCityPosition(trip.destination);
  return {
    top: (origin.top + destination.top) / 2,
    left: (origin.left + destination.left) / 2,
  };
}

function clearMarkers() {
  mapContainer.querySelectorAll('.map-marker').forEach((marker) => marker.remove());
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
  clearMarkers();
  const filteredTrips = trips.filter(applyFilters);
  filteredTrips.forEach((trip) => {
    const marker = document.createElement('button');
    marker.className = 'map-marker';
    marker.dataset.id = trip.id;
    marker.dataset.type = trip.type;
    const { top, left } = computeMarkerPosition(trip);
    marker.style.top = `${top}%`;
    marker.style.left = `${left}%`;
    marker.innerHTML = `<span class="price">${formatPrice(trip.price)}</span><span>${trip.destination.split(',')[0]}</span>`;

    if (trip.highlight) {
      marker.classList.add('new');
    }

    if (trip.id === selectedTripId) {
      marker.classList.add('active');
    }

    marker.addEventListener('click', () => {
      selectedTripId = trip.id;
      renderMarkers();
      openDrawer(trip);
    });

    mapContainer.appendChild(marker);
  });
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
}

function closeDrawer() {
  detailDrawer.classList.remove('open');
  selectedTripId = null;
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
  renderMarkers();
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
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
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

function init() {
  renderMarkers();
  renderCarrierActiveTrips();
  renderShipperBookings();
  renderShipperTimeline();
  renderDemandChart();
  handleCarrierForm();
  attachFormHandlers();
}

init();
