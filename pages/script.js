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
  let swipeVelocity = 0;
  let lastTime = 0;
  const minSwipeDistance = 50; // Minimum distance for swipe detection
  const swipeThreshold = 0.3; // Speed threshold for swipe to register

  const $slider = $('#image-slider');
  $slider.attr('max', totalImages);
  $slider.val(currentIndex);

  // Initial image load
  loadImage(currentIndex);

  // Hide loading overlay after 3 seconds
  setTimeout(() => {
    $('.loading-overlay').addClass('hidden');
  }, 3000); // 3 seconds delay

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

  const calculateSwipeVelocity = (distance, time) => {
    return distance / time;
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
    if (e.button !== 0) return;
    startX = e.clientX;
    currentX = startX;
    isDragging = true;
    lastTime = Date.now();
  });

  $('.slideshow-container').on('mousemove', function (e) {
    if (!isDragging) return;
    const swipeDistance = e.clientX - currentX;
    currentX = e.clientX;
    const currentTime = Date.now();
    const timeDiff = currentTime - lastTime;
    lastTime = currentTime;

    swipeVelocity = calculateSwipeVelocity(swipeDistance, timeDiff);

    if (Math.abs(swipeDistance) > minSwipeDistance || Math.abs(swipeVelocity) > swipeThreshold) {
      if (swipeDistance < 0) {
        nextImage();
      } else {
        prevImage();
      }
      startX = e.clientX;
    }
  });

  $(document).on('mouseup mouseleave', function () {
    isDragging = false;
  });

  $('.slideshow-container').on('touchstart', function (e) {
    startX = e.touches[0].clientX;
    currentX = startX;
    isDragging = true;
    lastTime = Date.now();
  });

  $('.slideshow-container').on('touchmove', function (e) {
    if (!isDragging) return;
    const swipeDistance = e.touches[0].clientX - currentX;
    currentX = e.touches[0].clientX;
    const currentTime = Date.now();
    const timeDiff = currentTime - lastTime;
    lastTime = currentTime;

    swipeVelocity = calculateSwipeVelocity(swipeDistance, timeDiff);

    if (Math.abs(swipeDistance) > minSwipeDistance || Math.abs(swipeVelocity) > swipeThreshold) {
      if (swipeDistance < 0) {
        nextImage();
      } else {
        prevImage();
      }
      startX = e.touches[0].clientX;
    }
  });

  $(document).on('touchend', function () {
    isDragging = false;
  });

  const checkOrientation = () => {
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    $('.slideshow-container').css('display', isLandscape ? 'block' : 'none');
    $('.portrait-message').css('display', isLandscape ? 'none' : 'flex');
  };

  $(window).on('resize orientationchange', checkOrientation);
  checkOrientation();
});
