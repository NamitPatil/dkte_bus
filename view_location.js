
mapboxgl.accessToken = 'pk.eyJ1IjoibmFtaXQxMDA4IiwiYSI6ImNtMWh4Z2M5ODBrdGsybHF5OHV3NDN4eXgifQ.G47Bvkwkwa9raAqjRqI4Nw'; // Replace with your Mapbox access token
let driverMarker; // Declare marker outside the function so it can be reused

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [77.5946, 12.9716], // Default center (Bangalore)
    zoom: 12
});

function fetchDriverLocation() {
    fetch('/api/get-location')
        .then(response => response.json())
        .then(location => {
            console.log('Driver location:', location); // Log location to see what's coming from the server

            if (location.latitude && location.longitude) {
                // Add or update the marker for the driver's location
                if (!driverMarker) {
                    driverMarker = new mapboxgl.Marker().setLngLat([location.longitude, location.latitude]).addTo(map);
                } else {
                    driverMarker.setLngLat([location.longitude, location.latitude]);
                }

                // Recenter the map on the driver's location
                map.setCenter([location.longitude, location.latitude]);
            } else {
                alert('No location available');
            }
        })
        .catch(error => {
            console.error('Error fetching location:', error);
        });
}

// Fetch driver's location every 5 seconds
setInterval(fetchDriverLocation, 5000);
