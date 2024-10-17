// Function to get access to the browser's location services
function shareLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Send the location to the server
            fetch('/api/share-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ latitude, longitude })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                alert('Location shared successfully!');
            })
            .catch(error => {
                console.error('Error sharing location:', error);
                alert('Failed to share location.');
            });
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Automatically share location every 10 seconds
setInterval(shareLocation, 10000);

// Trigger share location immediately when the button is clicked
document.getElementById('shareButton').addEventListener('click', shareLocation);
