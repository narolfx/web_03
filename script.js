const totalImages = 61; // Total number of images in the slideshow
let currentIndex = 1; // Start from the first image
const fps = 18; // Frames per second for automatic rotation
const intervalTime = 1000 / fps; // Calculate interval time in milliseconds for the slideshow
const slideshowImage = document.getElementById('slideshow-image'); // Get the image element to display images
const playButton = document.getElementById('play-button'); // Get the play/pause button element
const imageSlider = document.getElementById('image-slider'); // Get the slider element for manual image control
const zoomButton = document.getElementById('zoom-button'); // Get the zoom button element

let slideshowInterval; // Variable to store the slideshow interval ID
let isPlaying = false; // Boolean to track if the slideshow is playing
let isZoomedIn = false; // Boolean to track the zoom state of the image

// Variables for touch events
let startX = 0; // Starting X position of a touch event
const minSwipeDistance = 8; // Minimum distance required to detect a swipe

// Function to update the image source based on the current index
const updateImage = () => {
  slideshowImage.src = `${currentIndex}.jpg`; // Set the image source to the current index
  imageSlider.value = currentIndex; // Update the slider to match the current image
};

// Function to start the automatic slideshow
const startSlideshow = () => {
  isPlaying = true; // Set the playing state to true
  playButton.innerHTML = '<i class="fas fa-pause"></i>'; // Change the button icon to "pause"
  slideshowInterval = setInterval(nextImage, intervalTime); // Start the interval to automatically change images
};

// Function to stop the automatic slideshow
const stopSlideshow = () => {
  isPlaying = false; // Set the playing state to false
  playButton.innerHTML = '<i class="fas fa-play"></i>'; // Change the button icon to "play"
  clearInterval(slideshowInterval); // Clear the interval to stop changing images automatically
};

// Function to toggle play/stop button functionality
playButton.addEventListener('click', () => {
  isPlaying ? stopSlideshow() : startSlideshow(); // Toggle between playing and stopping the slideshow
});

// Function to toggle zoom in/out
zoomButton.addEventListener('click', () => {
  isZoomedIn = !isZoomedIn; // Toggle the zoom state
  slideshowImage.style.transform = isZoomedIn ? 'scale(1.5)' : 'scale(1)'; // Zoom in or reset based on the zoom state
  zoomButton.innerHTML = isZoomedIn ? '<i class="fas fa-search-minus"></i>' : '<i class="fas fa-search-plus"></i>'; // Change the button icon based on the zoom state
});

// Function to handle orientation check
const checkOrientation = () => {
  const isLandscape = window.matchMedia("(orientation: landscape)").matches; // Check if the device is in landscape mode
  document.querySelector('.slideshow-container').style.display = isLandscape ? 'block' : 'none'; // Show or hide the slideshow based on orientation
  document.querySelector('.portrait-message').style.display = isLandscape ? 'none' : 'flex'; // Show or hide the portrait message based on orientation
  if (!isLandscape) stopSlideshow(); // Stop the slideshow if the device is not in landscape mode
};

// Function to navigate to the next image
const nextImage = () => {
  currentIndex = (currentIndex % totalImages) + 1; // Increment the index and loop back to the first image if necessary
  updateImage(); // Update the displayed image
};

// Function to navigate to the previous image
const prevImage = () => {
  currentIndex = (currentIndex - 2 + totalImages) % totalImages + 1; // Decrement the index and loop back to the last image if necessary
  updateImage(); // Update the displayed image
};

// Touch event handlers
slideshowImage.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX; // Record the starting X position of the touch
});

slideshowImage.addEventListener('touchmove', (e) => {
  const swipeDistance = e.touches[0].clientX - startX; // Calculate the swipe distance
  if (Math.abs(swipeDistance) > minSwipeDistance) { // Check if the swipe distance is greater than the minimum threshold
    swipeDistance < 0 ? nextImage() : prevImage(); // Determine swipe direction and navigate images accordingly
    startX = e.touches[0].clientX; // Reset startX for continuous swipe detection
  }
});

// Reset swipe state on touch end
slideshowImage.addEventListener('touchend', () => {
  isSwiping = false; // Reset swipe state when the touch ends
});

// Event listener for image slider control
imageSlider.addEventListener('input', (e) => {
  stopSlideshow(); // Stop automatic slideshow when the user interacts with the slider
  currentIndex = parseInt(e.target.value); // Update the current index based on the slider value
  updateImage(); // Update the displayed image
});

// Event listeners to detect orientation change
window.addEventListener('resize', checkOrientation); // Check orientation on window resize
window.addEventListener('orientationchange', checkOrientation); // Check orientation when the device orientation changes

// Initial orientation check
checkOrientation(); // Perform an initial check of the device orientation
