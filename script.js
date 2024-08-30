// Adjust container height to fit within the visible viewport
function adjustHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.querySelector('.slideshow-container').style.height = `${window.innerHeight}px`; // Adjust height dynamically
}

// Event listeners to adjust on resize or orientation change
window.addEventListener('resize', adjustHeight);
window.addEventListener('orientationchange', adjustHeight);

// Initial adjustment
adjustHeight();

// Existing JavaScript code remains unchanged
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
let isDragging = false; // Track if the user is dragging the image
let startX; // Store the initial X position when dragging starts
let currentX; // Store the current X position during dragging
let initialIndex; // Store the initial image index when dragging starts

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

// Function to handle touch start
function handleTouchStart(e) {
    stopSlideshow(); // Stop automatic slideshow on manual control
    isDragging = true;
    startX = e.touches[0].clientX;
    initialIndex = currentIndex;
}

// Function to handle touch move
function handleTouchMove(e) {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    let deltaX = startX - currentX;
    let imageChangeThreshold = window.innerWidth / totalImages; // Adjust for smoother transitions

    if (Math.abs(deltaX) > imageChangeThreshold) {
        if (deltaX > 0) {
            currentIndex = initialIndex + Math.ceil(deltaX / imageChangeThreshold);
        } else {
            currentIndex = initialIndex + Math.floor(deltaX / imageChangeThreshold);
        }

        // Make rotation continuous
        if (currentIndex > totalImages) {
            currentIndex = ((currentIndex - 1) % totalImages) + 1; // Loop back to first image
        } else if (currentIndex < 1) {
            currentIndex = totalImages - ((-currentIndex) % totalImages); // Loop back to last image
        }

        updateImage();
    }
}

// Function to handle touch end
function handleTouchEnd() {
    isDragging = false;
}

// Function to handle mouse down
function handleMouseDown(e) {
    stopSlideshow(); // Stop automatic slideshow on manual control
    isDragging = true;
    startX = e.clientX;
    initialIndex = currentIndex;
}

// Function to handle mouse move
function handleMouseMove(e) {
    if (!isDragging) return;
    currentX = e.clientX;
    let deltaX = startX - currentX;
    let imageChangeThreshold = window.innerWidth / totalImages; // Adjust for smoother transitions

    if (Math.abs(deltaX) > imageChangeThreshold) {
        if (deltaX > 0) {
            currentIndex = initialIndex + Math.ceil(deltaX / imageChangeThreshold);
        } else {
            currentIndex = initialIndex + Math.floor(deltaX / imageChangeThreshold);
        }

        // Make rotation continuous
        if (currentIndex > totalImages) {
            currentIndex = ((currentIndex - 1) % totalImages) + 1; // Loop back to first image
        } else if (currentIndex < 1) {
            currentIndex = totalImages - ((-currentIndex) % totalImages); // Loop back to last image
        }

        updateImage();
    }
}

// Function to handle mouse up
function handleMouseUp() {
    isDragging = false;
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

// Event listeners for touchscreen control
slideshowImage.addEventListener('touchstart', handleTouchStart);
slideshowImage.addEventListener('touchmove', handleTouchMove);
slideshowImage.addEventListener('touchend', handleTouchEnd);

// Event listeners for mouse control
slideshowImage.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);

// Event listeners to detect orientation change
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);

// Initial orientation check
checkOrientation();
