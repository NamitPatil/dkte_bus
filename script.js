// script.js
window.addEventListener('load', function () {
    // Splash screen duration (in milliseconds)
    setTimeout(function () {
        // Fade out the splash screen
        document.getElementById('splash-screen').style.animation = "fadeOut 1s forwards";
        
        // Hide the splash screen and show the main content after the fade-out
        setTimeout(function() {
            document.getElementById('splash-screen').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
        }, 1000); // Match this time with fadeOut duration
    }, 1000); // Time the splash screen is visible
});