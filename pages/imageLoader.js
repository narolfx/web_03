// imageLoader.js

const totalImages = 61; // Total number of images in the slideshow
let currentIndex = 1; // Start from the first image
const cache = {}; // Cache to store preloaded images

// Function to preload images and cache them
export const preloadImage = (index) => {
  if (index < 1 || index > totalImages || cache[index]) return; // Ignore out-of-bounds indices and already cached images
  const img = new Image();
  img.src = `images/${index}.jpg`;
  cache[index] = img; // Cache the preloaded image
};

// Function to load and display images from the cache or directly if not cached
export const loadImage = (index) => {
  currentIndex = index; // Update current index
  const $imageContainer = $('.slideshow-container');
  const imageElement = $('#slideshow-image');

  if (cache[index]) {
    imageElement.attr('src', cache[index].src); // Use cached image if available
  } else {
    const newImage = `images/${index}.jpg`;
    imageElement.attr('src', newImage);
    preloadImage(index); // Preload the current image to cache it
  }

  // Preload next and previous images
  preloadImage(currentIndex + 1);
  preloadImage(currentIndex + 2);
  preloadImage(currentIndex - 1);
  preloadImage(currentIndex - 2);
};

// Export utility functions
export const getTotalImages = () => totalImages;
export const getCurrentIndex = () => currentIndex;
