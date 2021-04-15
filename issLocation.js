const unitOptions = document.getElementById('inputs');

let theUnit;

const unitType = () => {
  if (unitOptions.selectedIndex === 0) {
    theUnit = 'km';
  } else if (unitOptions.selectedIndex === 1) {
    theUnit = 'm';
  } else if (unitOptions.selectedIndex === 2) {
    theUnit = 'mi';
  } else if (unitOptions.selectedIndex === 3) {
    theUnit = 'ft';
  } else if (unitOptions.selectedIndex === 4) {
    theUnit = 'in';
  }

  console.log(theUnit, unitOptions.selectedIndex);
}

unitOptions.addEventListener('input', unitType, true);

const toRound = (value) => {
  return value.toFixed(2);
}

const unitConverter = (value) => {
  if (unitOptions.selectedIndex === 0) {
    return value;
  } else if (unitOptions.selectedIndex === 1) {
    return value * 1000;
  } else if (unitOptions.selectedIndex === 2) {
    return value / 1.609;
  } else if (unitOptions.selectedIndex === 3) {
    return value * 3281;
  } else if (unitOptions.selectedIndex === 4) {
    return value * 39370;
  }
}

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

let issData = async (apiUrl, distanceSymbol) => {
  const responseFlow = await fetch(apiUrl);
  const dataObject = await responseFlow.json();

  let { latitude, longitude, velocity , altitude, units, visibility } = dataObject;

  altitude = unitConverter(altitude);

  latitude = toRound(latitude);
  longitude = toRound(longitude);
  velocity = toRound(velocity);
  altitude = toRound(altitude);

  issLocation.setLatLng([latitude, longitude]);

  document.getElementById('latitude').textContent = latitude;
  document.getElementById('longitude').textContent = longitude;
  document.getElementById('velocity').textContent = velocity;
  document.getElementById('altitude').textContent = `${altitude} ${distanceSymbol}`;
  document.getElementById('units').textContent = units;
  document.getElementById('visibility').textContent = visibility;
}

unitType();
issData(apiUrl, theUnit);

setInterval(() => {
  issData(apiUrl, theUnit);
}, 1000)