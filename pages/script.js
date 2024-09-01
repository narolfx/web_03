// script.js

import { loadImage, preloadImage, getTotalImages, getCurrentIndex } from './imageLoader.js';

$(document).ready(function () {
  const totalImages = getTotalImages();
  let currentIndex = getCurrentIndex();
  let isPlaying = false;
  let playInterval;
  let isZoomedIn = false;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  const rotationSensitivity = 0.2; // Sensitivity for the rotation speed
  const imageChangeThreshold = 30; // Minimum distance in pixels to change the image

  const $slider = $('#image-slider');
  $slider.attr('max', totalImages);
  $slider.val(currentIndex);

  // Initial image load
  loadImage(currentIndex);

  // Function to handle orientation change
  const checkOrientation = () => {
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    $('.slideshow-container').css('display', isLandscape ? 'block' : 'none');
    $('.portrait-message').css('display', isLandscape ? 'none' : 'flex');
    if (isLandscape) {
      $('.loading-overlay').removeClass('hidden'); // Show loading overlay in landscape
      setTimeout(() => {
        $('.loading-overlay').addClass('hidden'); // Hide loading overlay after 4 seconds
      }, 3000);
    }
  };

  // Check orientation on load
  checkOrientation();

  // Handle resizing or orientation change
  $(window).on('resize orientationchange', checkOrientation);

  const nextImage = () => {
    currentIndex = (currentIndex % totalImages) + 1;
    loadImage(currentIndex);
    $slider.val(currentIndex);
  };

  const prevImage = () => {
    currentIndex = (currentIndex - 2 + totalImages) % totalImages + 1;
    loadImage(currentIndex);
    $slider.val(currentIndex);
  };

  $slider.on('input', function () {
    const newIndex = parseInt($(this).val());
    loadImage(newIndex);
  });

  const startSlideshow = () => {
    isPlaying = true;
    $('#play-button').html('<i class="fas fa-pause"></i>');
    playInterval = setInterval(nextImage, 60);
  };

  const stopSlideshow = () => {
    isPlaying = false;
    $('#play-button').html('<i class="fas fa-play"></i>');
    clearInterval(playInterval);
  };

  $('#play-button').on('click', function () {
    if (isPlaying) {
      stopSlideshow();
    } else {
      startSlideshow();
    }
  });

  $('#zoom-button').on('click', function () {
    isZoomedIn = !isZoomedIn;
    $('#slideshow-image').css('transform', isZoomedIn ? 'scale(1.5)' : 'scale(1)');
    $(this).html(isZoomedIn ? '<i class="fas fa-search-minus"></i>' : '<i class="fas fa-search-plus"></i>');
  });

  $('.slideshow-container').on('mousedown', function (e) {
    if (e.button !== 0) return; // Only respond to left mouse button
    startX = e.clientX;
    currentX = startX;
    isDragging = true;
    $(this).css('cursor', 'grabbing'); // Change cursor to grabbing
  });

  $(document).on('mousemove', function (e) {
    if (!isDragging) return;

    currentX = e.clientX;
    const distanceMoved = currentX - startX;

    if (Math.abs(distanceMoved) > imageChangeThreshold) {
      if (distanceMoved > 0) {
        prevImage();
      } else {
        nextImage();
      }
      startX = currentX; // Reset startX to current position after image change
    }
  });

  $(document).on('mouseup', function () {
    if (isDragging) {
      isDragging = false;
      $('.slideshow-container').css('cursor', 'grab'); // Change cursor back to grab
    }
  });

  $(document).on('mouseleave', function () {
    if (isDragging) {
      isDragging = false;
      $('.slideshow-container').css('cursor', 'grab'); // Change cursor back to grab
    }
  });

  $('.slideshow-container').on('touchstart', function (e) {
    startX = e.touches[0].clientX;
    currentX = startX;
    isDragging = true;
  });

  $('.slideshow-container').on('touchmove', function (e) {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const distanceMoved = currentX - startX;

    if (Math.abs(distanceMoved) > imageChangeThreshold) {
      if (distanceMoved > 0) {
        prevImage();
      } else {
        nextImage();
      }
      startX = currentX; // Reset startX to current position after image change
    }
  });

  $(document).on('touchend touchcancel', function () {
    isDragging = false;
  });
});
