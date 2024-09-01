// script.js

$(document).ready(function () {
  const totalImages = 61; // Total number of images in the slideshow
  let currentIndex = 1; // Start from the first image
  let isPlaying = false; // Boolean to track if the slideshow is playing
  let playInterval; // Variable to store the interval ID
  let isZoomedIn = false; // Boolean to track the zoom state of the image
  let isDragging = false; // Boolean to check if the mouse is being dragged
  let startX = 0; // Starting X position of a touch or mouse event
  const minSwipeDistance = 8; // Minimum distance required to detect a swipe
  const cache = {}; // Cache to store preloaded images

  // Initialize the slider
  const $slider = $('#image-slider');
  $slider.attr('max', totalImages); // Set slider max value
  $slider.val(currentIndex); // Set initial slider value

  // Function to preload images and cache them
  const preloadImage = (index) => {
    if (index < 1 || index > totalImages || cache[index]) return; // Ignore out-of-bounds indices and already cached images
    const img = new Image();
    img.src = `images/${index}.jpg`;
    cache[index] = img; // Cache the preloaded image
  };

  // Function to load and display images from the cache or directly if not cached
  const loadImage = (index) => {
    currentIndex = index; // Update current index
    const $imageContainer = $('.slideshow-container');
    $imageContainer.find('#slideshow-image').attr('src', cache[index]?.src || `images/${index}.jpg`); // Use cached image or direct load

    // Preload next and previous images
    preloadImage(currentIndex + 1);
    preloadImage(currentIndex + 2);
    preloadImage(currentIndex - 1);
    preloadImage(currentIndex - 2);
  };

  // Load the first image initially and preload subsequent images
  loadImage(currentIndex);

  // Function to navigate to the next image
  const nextImage = () => {
    currentIndex = (currentIndex % totalImages) + 1;
    loadImage(currentIndex);
    $slider.val(currentIndex); // Update the slider to match the current image
  };

  // Function to navigate to the previous image
  const prevImage = () => {
    currentIndex = (currentIndex - 2 + totalImages) % totalImages + 1;
    loadImage(currentIndex);
    $slider.val(currentIndex); // Update the slider to match the current image
  };

  // Event listener for slider input
  $slider.on('input', function () {
    const newIndex = parseInt($(this).val());
    loadImage(newIndex);
  });

  // Function to start the slideshow
  const startSlideshow = () => {
    isPlaying = true;
    $('#play-button').html('<i class="fas fa-pause"></i>'); // Update the button icon to pause
    playInterval = setInterval(nextImage, 60); // Change images every 500 milliseconds for smoother transition
  };

  // Function to stop the slideshow
  const stopSlideshow = () => {
    isPlaying = false;
    $('#play-button').html('<i class="fas fa-play"></i>'); // Update the button icon to play
    clearInterval(playInterval); // Clear the interval
  };

  // Event listener for play button
  $('#play-button').on('click', function () {
    if (isPlaying) {
      stopSlideshow();
    } else {
      startSlideshow();
    }
  });

  // Event listener for zoom button
  $('#zoom-button').on('click', function () {
    isZoomedIn = !isZoomedIn; // Toggle the zoom state
    $('#slideshow-image').css('transform', isZoomedIn ? 'scale(1.5)' : 'scale(1)'); // Zoom in or reset based on the zoom state
    $(this).html(isZoomedIn ? '<i class="fas fa-search-minus"></i>' : '<i class="fas fa-search-plus"></i>'); // Change the button icon based on the zoom state
  });

  // Mouse event handlers for desktop rotation
  $('.slideshow-container').on('mousedown', function (e) {
    if (e.button !== 0) return; // Ensure it's the left mouse button
    startX = e.clientX;
    isDragging = true;
  });

  $('.slideshow-container').on('mousemove', function (e) {
    if (!isDragging) return;
    const swipeDistance = e.clientX - startX;
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      swipeDistance < 0 ? nextImage() : prevImage();
      startX = e.clientX;
    }
  });

  $(document).on('mouseup mouseleave', function () {
    isDragging = false;
  });

  // Touch event handlers for mobile
  $('.slideshow-container').on('touchstart', function (e) {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  $('.slideshow-container').on('touchmove', function (e) {
    if (!isDragging) return;
    const swipeDistance = e.touches[0].clientX - startX;
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      swipeDistance < 0 ? nextImage() : prevImage();
      startX = e.touches[0].clientX;
    }
  });

  $(document).on('touchend', function () {
    isDragging = false;
  });

  // Function to handle orientation check
  const checkOrientation = () => {
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    $('.slideshow-container').css('display', isLandscape ? 'block' : 'none');
    $('.portrait-message').css('display', isLandscape ? 'none' : 'flex');
  };

  // Event listeners to detect orientation change
  $(window).on('resize orientationchange', checkOrientation);

  // Initial orientation check
  checkOrientation();
});
