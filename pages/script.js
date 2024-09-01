// Configuration for image loading
const config = {
    imageCount: 61, // Total number of images
    path: 'images/', // Path to the images folder
    containerClass: 'slideshow-container', // Class of the container where images will be dynamically loaded
    sliderId: 'image-slider' // ID of the slider element for manual image control
};

// Initialize variables for image handling
let currentIndex = 1; // Start from the first image
const imageSlider = document.getElementById(config.sliderId); // Get the slider element
const zoomButton = document.getElementById('zoom-button'); // Get the zoom button element
const playButton = document.getElementById('play-button'); // Get the play button element

let isZoomedIn = false; // Boolean to track the zoom state of the image
let isPlaying = false; // Boolean to track if the slideshow is playing
let playInterval; // Variable to store the setInterval reference for the slideshow

// Variables for touch and mouse events
let startX = 0; // Starting X position of a touch or mouse event
const minSwipeDistance = 8; // Minimum distance required to detect a swipe
let isDragging = false; // Boolean to track if dragging is active

// Function to dynamically load images into the viewer
function loadImages() {
    const viewer = document.querySelector(`.${config.containerClass}`);
    viewer.innerHTML = ''; // Clear any existing content

    // Create img elements dynamically
    for (let i = 1; i <= config.imageCount; i++) {
        const imgElement = document.createElement('img');
        imgElement.src = `${config.path}${i}.jpg`; // Set the source for each image
        imgElement.alt = `Product Image ${i}`;
        imgElement.style.display = 'none'; // Hide initially
        imgElement.classList.add('slideshow-image'); // Add a class for easier manipulation
        viewer.appendChild(imgElement);
    }

    // Set the first image to be visible
    viewer.querySelector('img').style.display = 'block';
}

// Function to update the displayed image
function updateImage() {
    const images = document.querySelectorAll('.slideshow-image');
    images.forEach(img => img.style.display = 'none'); // Hide all images
    images[currentIndex - 1].style.display = 'block'; // Show the current image
    imageSlider.value = currentIndex; // Update the slider to match the current image
}

// Function to handle orientation check
function checkOrientation() {
    const isLandscape = window.matchMedia("(orientation: landscape)").matches; // Check if the device is in landscape mode
    document.querySelector(`.${config.containerClass}`).style.display = isLandscape ? 'block' : 'none'; // Show or hide the slideshow based on orientation
    document.querySelector('.portrait-message').style.display = isLandscape ? 'none' : 'flex'; // Show or hide the portrait message based on orientation
}

// Function to navigate to the next image
function nextImage() {
    currentIndex = (currentIndex % config.imageCount) + 1; // Increment the index and loop back to the first image if necessary
    updateImage(); // Update the displayed image
}

// Function to navigate to the previous image
function prevImage() {
    currentIndex = (currentIndex - 2 + config.imageCount) % config.imageCount + 1; // Decrement the index and loop back to the last image if necessary
    updateImage(); // Update the displayed image
}

// Touch event handlers
document.querySelector(`.${config.containerClass}`).addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX; // Record the starting X position of the touch
});

document.querySelector(`.${config.containerClass}`).addEventListener('touchmove', (e) => {
    const swipeDistance = e.touches[0].clientX - startX; // Calculate the swipe distance
    if (Math.abs(swipeDistance) > minSwipeDistance) { // Check if the swipe distance is greater than the minimum threshold
        swipeDistance < 0 ? nextImage() : prevImage(); // Determine swipe direction and navigate images accordingly
        startX = e.touches[0].clientX; // Reset startX for continuous swipe detection
    }
});

// Mouse drag event handlers for desktops
document.querySelector(`.${config.containerClass}`).addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    e.preventDefault(); // Prevent text selection while dragging
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const moveX = e.pageX - startX;
        if (Math.abs(moveX) > minSwipeDistance) { // Check if the drag distance is greater than the minimum threshold
            moveX < 0 ? nextImage() : prevImage(); // Determine drag direction and navigate images accordingly
            startX = e.pageX; // Reset startX for continuous drag detection
        }
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false; // Stop dragging when mouse button is released
});

// Event listener for image slider control
imageSlider.addEventListener('input', (e) => {
    currentIndex = parseInt(e.target.value); // Update the current index based on the slider value
    updateImage(); // Update the displayed image
});

// Event listener for zoom button
zoomButton.addEventListener('click', () => {
    isZoomedIn = !isZoomedIn; // Toggle the zoom state

    // Select all images inside the slideshow container
    const allImages = document.querySelectorAll('.slideshow-container img');

    // Apply zoom or reset based on the zoom state to all images
    allImages.forEach((img) => {
        img.style.transform = isZoomedIn ? 'scale(1.5)' : 'scale(1)';
    });

    // Change the button icon based on the zoom state
    zoomButton.innerHTML = isZoomedIn ? '<i class="fas fa-search-minus"></i>' : '<i class="fas fa-search-plus"></i>';
});


// Event listener for play button
playButton.addEventListener('click', () => {
    if (isPlaying) {
        clearInterval(playInterval); // Stop the slideshow
        playButton.innerHTML = '<i class="fas fa-play"></i>'; // Change the button icon to play
    } else {
        playInterval = setInterval(nextImage, 60); // Start the slideshow and change images every 2 seconds
        playButton.innerHTML = '<i class="fas fa-pause"></i>'; // Change the button icon to pause
    }
    isPlaying = !isPlaying; // Toggle the play state
});

// Event listeners to detect orientation change
window.addEventListener('resize', checkOrientation); // Check orientation on window resize
window.addEventListener('orientationchange', checkOrientation); // Check orientation when the device orientation changes

// Initial setup
loadImages(); // Load images dynamically
checkOrientation(); // Perform an initial check of the device orientation
updateImage(); // Initialize the image display
