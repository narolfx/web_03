// Get the play button element
const playButton = document.getElementById('play-button'); 

let isPlaying = false; // Boolean to track if the slideshow is playing
let slideshowInterval; // Variable to store the slideshow interval ID
const intervalTime = 1000 / 18; // Interval time in milliseconds for the slideshow

// Function to start the automatic slideshow
const startSlideshow = () => {
  isPlaying = true; // Set the playing state to true
  playButton.innerHTML = '<i class="fas fa-pause"></i>'; // Change the button icon to "pause"
  slideshowInterval = setInterval(() => {
    const event = new Event('playNextImage');
    window.dispatchEvent(event); // Dispatch a custom event to play the next image
  }, intervalTime);
};

// Function to stop the automatic slideshow
const stopSlideshow = () => {
  isPlaying = false; // Set the playing state to false
  playButton.innerHTML = '<i class="fas fa-play"></i>'; // Change the button icon to "play"
  clearInterval(slideshowInterval); // Clear the interval to stop changing images automatically
};

// Event listener to toggle play/stop button functionality
playButton.addEventListener('click', () => {
  isPlaying ? stopSlideshow() : startSlideshow(); // Toggle between playing and stopping the slideshow
});
