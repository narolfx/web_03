// Get the play button element
const playButton = document.getElementById('play-button');

let isPlaying = false; // Boolean to track if the slideshow is playing
let lastFrameTime = 0; // To track the time of the last frame
const frameRate = 18; // Frames per second
const frameInterval = 1000 / frameRate; // Interval time in milliseconds for each frame

// Function to update the play button icon
const updatePlayButton = () => {
  playButton.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
};

// Function to start the slideshow animation
const startSlideshow = () => {
  isPlaying = true; // Set the playing state to true
  updatePlayButton(); // Update the button icon
  requestAnimationFrame(playSlideshow); // Start the slideshow animation
};

// Function to stop the slideshow animation
const stopSlideshow = () => {
  isPlaying = false; // Set the playing state to false
  updatePlayButton(); // Update the button icon
};

// Function to play the slideshow using requestAnimationFrame
const playSlideshow = (currentTime) => {
  if (!isPlaying) return; // If not playing, stop the animation

  if (currentTime - lastFrameTime >= frameInterval) {
    lastFrameTime = currentTime; // Update the last frame time

    // Dispatch a custom event to play the next image
    const event = new Event('playNextImage');
    window.dispatchEvent(event);
  }

  requestAnimationFrame(playSlideshow); // Request the next frame
};

// Event listener to toggle play/stop button functionality
playButton.addEventListener('click', () => {
  isPlaying ? stopSlideshow() : startSlideshow(); // Toggle between playing and stopping the slideshow
});
