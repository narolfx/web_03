// script.js

let currentIndex = 1; // Initialize currentIndex with a starting value
const totalImages = 61; // Total number of images in the slideshow
let isPlaying = false; // Boolean to track if the slideshow is playing
let playInterval; // Variable to store the interval ID
let isZoomedIn = false; // Boolean to track the zoom state of the image
let startX = 0; // Starting X position of a touch or mouse event
let isDragging = false; // Boolean to check if the mouse is being dragged
const minSwipeDistance = 8; // Minimum distance required to detect a swipe

document.addEventListener("DOMContentLoaded", () => {
  const slideshowImage = document.getElementById('slideshow-image'); // Get the image element to display images
  const zoomButton = document.getElementById('zoom-button'); // Get the zoom button element
  const playButton = document.getElementById('play-button'); // Get the play button element
  const slider = document.getElementById('image-slider'); // Get the slider element

  if (!slideshowImage || !zoomButton || !playButton || !slider) {
    console.error('One or more elements not found! Ensure all elements are present.');
    return;
  }

  // Initialize the slider's maximum value and current value
  slider.max = totalImages; // Set the maximum number of images
  slider.value = currentIndex; // Set the initial slider value

  // Function to update the image source based on the current index
  const updateImage = (index) => {
    if (index) currentIndex = index; // Update currentIndex with the new index if provided
    slideshowImage.src = `images/${currentIndex}.jpg`; // Set the image source to the current index in the images folder
    slider.value = currentIndex; // Sync slider with current index
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

  // Event listener for slider input
  slider.addEventListener('input', (e) => {
    const newIndex = parseInt(e.target.value); // Get the new index from the slider value
    updateImage(newIndex); // Update the image based on the new index
  });

  // Function to start the slideshow with faster speed
  const startSlideshow = () => {
    isPlaying = true;
    playButton.innerHTML = '<i class="fas fa-pause"></i>'; // Update the button icon to pause
    playInterval = setInterval(nextImage, 60); // Change images every 100 milliseconds for faster speed
  };

  // Function to stop the slideshow
  const stopSlideshow = () => {
    isPlaying = false;
    playButton.innerHTML = '<i class="fas fa-play"></i>'; // Update the button icon to play
    clearInterval(playInterval); // Clear the interval
  };

  // Event listener for play button
  playButton.addEventListener('click', () => {
    if (isPlaying) {
      stopSlideshow();
    } else {
      startSlideshow();
    }
  });

  // Event listener for zoom button
  zoomButton.addEventListener('click', () => {
    isZoomedIn = !isZoomedIn; // Toggle the zoom state
    slideshowImage.style.transform = isZoomedIn ? 'scale(1.5)' : 'scale(1)'; // Zoom in or reset based on the zoom state
    zoomButton.innerHTML = isZoomedIn ? '<i class="fas fa-search-minus"></i>' : '<i class="fas fa-search-plus"></i>'; // Change the button icon based on the zoom state
  });

  // Mouse event handlers for desktop rotation
  slideshowImage.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Ensure it's the left mouse button
    startX = e.clientX; // Record the starting X position of the mouse
    isDragging = true; // Set dragging to true
  });

  slideshowImage.addEventListener('mousemove', (e) => {
    if (!isDragging) return; // Exit if not dragging
    const swipeDistance = e.clientX - startX; // Calculate the swipe distance
    if (Math.abs(swipeDistance) > minSwipeDistance) { // Check if the swipe distance is greater than the minimum threshold
      swipeDistance < 0 ? nextImage() : prevImage(); // Determine swipe direction and navigate images accordingly
      startX = e.clientX; // Reset startX for continuous swipe detection
    }
  });

  slideshowImage.addEventListener('mouseup', () => {
    isDragging = false; // Reset dragging state
  });

  slideshowImage.addEventListener('mouseleave', () => {
    isDragging = false; // Reset dragging state if the mouse leaves the image area
  });

  // Touch event handlers for mobile
  slideshowImage.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX; // Record the starting X position of the touch
    isDragging = true; // Set dragging to true
  });

  slideshowImage.addEventListener('touchmove', (e) => {
    if (!isDragging) return; // Exit if not dragging
    const swipeDistance = e.touches[0].clientX - startX; // Calculate the swipe distance
    if (Math.abs(swipeDistance) > minSwipeDistance) { // Check if the swipe distance is greater than the minimum threshold
      swipeDistance < 0 ? nextImage() : prevImage(); // Determine swipe direction and navigate images accordingly
      startX = e.touches[0].clientX; // Reset startX for continuous swipe detection
    }
  });

  slideshowImage.addEventListener('touchend', () => {
    isDragging = false; // Reset dragging state
  });

  // Function to handle orientation check
  const checkOrientation = () => {
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    document.querySelector('.slideshow-container').style.display = isLandscape ? 'block' : 'none';
    document.querySelector('.portrait-message').style.display = isLandscape ? 'none' : 'flex';
  };

  // Event listeners to detect orientation change
  window.addEventListener('resize', checkOrientation);
  window.addEventListener('orientationchange', checkOrientation);

  // Initial orientation check
  checkOrientation();
});
