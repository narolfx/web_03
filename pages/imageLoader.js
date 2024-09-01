const totalImages = 61; // Total number of images in the slideshow
let currentIndex = 1; // Start from the first image
const cache = {}; // Cache to store preloaded images

// Function to preload images in batches
const preloadImagesBatch = (startIndex, endIndex) => {
  for (let i = startIndex; i <= endIndex; i++) {
    preloadImage(i);
  }
};

// Function to preload a single image and cache it
export const preloadImage = (index) => {
  if (index < 1 || index > totalImages || cache[index]) return; // Ignore out-of-bounds indices and already cached images
  const img = new Image();
  img.src = `images/${index}.jpg`;
  cache[index] = img; // Cache the preloaded image
};

// Function to load and display images with a loading icon
export const loadImage = (index) => {
  if (index < 1 || index > totalImages) return; // Ignore out-of-bounds indices

  currentIndex = index; // Update current index
  const $imageContainer = $('.slideshow-container');
  const imageElement = $('#slideshow-image');
  const loadingIcon = $('#loading-icon'); // Assume there's a loading icon element in the HTML

  // Show loading icon
  loadingIcon.show();

  if (cache[index]) {
    // Use cached image if available
    imageElement.attr('src', cache[index].src);
    loadingIcon.hide(); // Hide loading icon when image is loaded from cache
  } else {
    const newImage = new Image();
    newImage.src = `images/${index}.jpg`;

    // When image loads, update the src and hide loading icon
    newImage.onload = () => {
      imageElement.attr('src', newImage.src);
      loadingIcon.hide(); // Hide loading icon when image is fully loaded
    };

    preloadImage(index); // Preload the current image to cache it
  }

  // Preload a batch of images ahead of time for smoother user experience
  preloadImagesBatch(currentIndex + 1, Math.min(currentIndex + 5, totalImages));
};

// Initial batch preloading
preloadImagesBatch(1, 5); // Preload the first 5 images initially

// Export utility functions
export const getTotalImages = () => totalImages;
export const getCurrentIndex = () => currentIndex;
