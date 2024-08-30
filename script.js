const totalImages = 61; // Total number of images
let currentIndex = 1; // Start from the first image
const fps = 15; // Frames per second for automatic rotation
const intervalTime = 1000 / fps; // Interval time in milliseconds
const slideshowImage = document.getElementById('slideshow-image');
const playButton = document.getElementById('play-button');
const imageSlider = document.getElementById('image-slider');
const zoomButton = document.getElementById('zoom-button');

let slideshowInterval;
let isPlaying = false; // Track whether the slideshow is playing
let isZoomedIn = false; // Track zoom state

// Variables for touch events
let startX = 0;
let endX = 0;
let isSwiping = false;

// Function to update the image source based on the current index
function updateImage() {
    slideshowImage.src = `${currentIndex}.jpg`;
    imageSlider.value = currentIndex; // Update slider to match current image
}

// Function to start the automatic slideshow
function startSlideshow() {
    isPlaying = true;
    playButton.innerHTML = '<i class="fas fa-pause"></i>'; // Change icon to "pause"
    slideshowInterval = setInterval(() => {
        nextImage(); // Use nextImage() for seamless looping
    }, intervalTime);
}

// Function to stop the automatic slideshow
function stopSlideshow() {
    isPlaying = false;
    playButton.innerHTML = '<i class="fas fa-play"></i>'; // Change icon to "play"
    clearInterval(slideshowInterval);
}

// Function to toggle play/stop button functionality
function toggleSlideshow() {
    if (isPlaying) {
        stopSlideshow();
    } else {
        startSlideshow();
    }
}

// Function to toggle zoom in/out
function toggleZoom() {
    if (isZoomedIn) {
        slideshowImage.style.transform = 'scale(1)'; // Reset to original size
        zoomButton.innerHTML = '<i class="fas fa-search-plus"></i>'; // Change icon to "zoom in"
    } else {
        slideshowImage.style.transform = 'scale(1.5)'; // Zoom in
        zoomButton.innerHTML = '<i class="fas fa-search-minus"></i>'; // Change icon to "zoom out"
    }
    isZoomedIn = !isZoomedIn; // Toggle zoom state
}

// Function to handle orientation check
function checkOrientation() {
    if (window.matchMedia("(orientation: landscape)").matches) {
        document.querySelector('.slideshow-container').style.display = 'block';
        document.querySelector('.portrait-message').style.display = 'none';
    } else {
        document.querySelector('.slideshow-container').style.display = 'none';
        document.querySelector('.portrait-message').style.display = 'block';
        stopSlideshow(); // Stop slideshow if in portrait mode
    }
}

// Helper functions to navigate images manually
function nextImage() {
    currentIndex++;
    if (currentIndex > totalImages) {
        currentIndex = 1; // Loop back to the first image
    }
    updateImage();
}

function prevImage() {
    currentIndex--;
    if (currentIndex < 1) {
        currentIndex = totalImages; // Loop back to the last image
    }
    updateImage();
}

// Improved touch swipe handlers
slideshowImage.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
});

slideshowImage.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    endX = e.touches[0].clientX;
    let swipeDistance = endX - startX;
    
    // Update slider based on swipe distance
    if (Math.abs(swipeDistance) > 30) { // If swipe is significant
        if (swipeDistance > 0) { // Swipe right
            prevImage();
        } else { // Swipe left
            nextImage();
        }
        startX = endX; // Reset start position for continuous swipe
    }
});

slideshowImage.addEventListener('touchend', () => {
    isSwiping = false; // Reset swiping state
});

// Event listeners for play/stop button
playButton.addEventListener('click', toggleSlideshow);

// Event listener for zoom button
zoomButton.addEventListener('click', toggleZoom);

// Event listener for image slider control
imageSlider.addEventListener('input', (e) => {
    stopSlideshow(); // Stop automatic slideshow when user controls manually
    currentIndex = parseInt(e.target.value); // Update index based on slider value
    updateImage();
});

// Event listeners to detect orientation change
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);

// Initial orientation check
checkOrientation();
