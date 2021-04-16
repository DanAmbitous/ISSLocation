const distanceUnitOptions = document.getElementById('inputs');
const speedDistance = document.getElementById('speed-inputs');

let distanceUnit;
let velocityUnit;

const toRound = (value) => {
  return value.toFixed(2);
}

const unitConverterDistance = (value) => {
  if (distanceUnitOptions.selectedIndex === 0) {
    distanceUnit = 'km';
  } else if (distanceUnitOptions.selectedIndex === 1) {
    distanceUnit = 'm';
  } else if (distanceUnitOptions.selectedIndex === 2) {
    distanceUnit = 'mi';
  } else if (distanceUnitOptions.selectedIndex === 3) {
    distanceUnit = 'ft';
  } else if (distanceUnitOptions.selectedIndex === 4) {
    distanceUnit = 'in';
  }

  if (distanceUnitOptions.selectedIndex === 0) {
    return value;
  } else if (distanceUnitOptions.selectedIndex === 1) {
    return value * 1000;
  } else if (distanceUnitOptions.selectedIndex === 2) {
    return value / 1.609;
  } else if (distanceUnitOptions.selectedIndex === 3) {
    return value * 3281;
  } else if (distanceUnitOptions.selectedIndex === 4) {
    return value * 39370
  }

  toRound(value);
}

const unitConverterVelocity = (value) => {  
  if (speedDistance.selectedIndex === 0) {
    velocityUnit = 'kph';
  } else if (speedDistance.selectedIndex === 1) {
    velocityUnit = 'm/h';
  } else if (speedDistance.selectedIndex === 2) {
    velocityUnit = 'mph';
  } else if (speedDistance.selectedIndex === 3) {
    velocityUnit = 'ft/h';
  } else if (speedDistance.selectedIndex === 4) {
    velocityUnit = 'in/h';
  }

  if (speedDistance.selectedIndex === 0) {
    return value;
  } else if (speedDistance.selectedIndex === 1) {
    return value / 1000;
  } else if (speedDistance.selectedIndex === 2) {
    return value / 1.609;
  } else if (speedDistance.selectedIndex === 3) {
    return value * 3281;
  } else if (speedDistance.selectedIndex === 4) {
    return value * 39370
  }

  toRound(value);
}

distanceUnitOptions.addEventListener('input', unitConverterDistance, true);

speedDistance.addEventListener('input', unitConverterVelocity, true);

const worldMap = L.map('map').setView([0, 0], 1);

const issImage = L.icon({
  iconUrl: '200px-International_Space_Station.svg.png',

  iconSize:     [50, 32], 
  iconAnchor:   [22, 16]
});

const issLocation = L.marker([0, 0], {icon: issImage}).addTo(worldMap);

const titleUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

const title = L.tileLayer(titleUrl, { attribution });

title.addTo(worldMap);

const apiUrl = `https://api.wheretheiss.at/v1/satellites/25544`;

let issData = async (apiUrl, distanceSymbol, speedUnit) => {
  const responseFlow = await fetch(apiUrl);
  const dataObject = await responseFlow.json();

  let { latitude, longitude, velocity , altitude, visibility } = dataObject;

  latitude = toRound(latitude);
  longitude = toRound(longitude);
  velocity = toRound(velocity);
  altitude = toRound(altitude);

  altitude = unitConverterDistance(altitude);
  velocity = unitConverterVelocity(velocity);

  issLocation.setLatLng([latitude, longitude]);

  document.getElementById('latitude').textContent = `${latitude}°`;
  document.getElementById('longitude').textContent = `${longitude}°`;
  document.getElementById('velocity').textContent = `${velocity} ${speedUnit}`;
  document.getElementById('altitude').textContent = `${altitude} ${distanceSymbol}`;
  document.getElementById('visibility').textContent = visibility;
}

unitConverterDistance();
unitConverterVelocity();
issData(apiUrl, distanceUnit, velocityUnit);

setInterval(() => {
  issData(apiUrl, distanceUnit, velocityUnit);
}, 1000)