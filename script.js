document.addEventListener('DOMContentLoaded', () => {
    const desktopImage = document.getElementById('image-desktop');
    const mobileImage = document.getElementById('image-mobile');
    const sliderDesktop = document.getElementById('slider-desktop');
    const sliderMobile = document.getElementById('slider-mobile');

    // Function to update desktop image based on slider value
    function updateDesktopImage() {
        const imageIndex = sliderDesktop.value; // Get current slider value
        desktopImage.src = `desktop-images/${imageIndex}.jpg`;
    }

    // Function to update mobile image based on slider value
    function updateMobileImage() {
        const imageIndex = sliderMobile.value; // Get current slider value
        mobileImage.src = `mobile-images/${imageIndex}.jpg`;
    }

    // Initial image load
    updateDesktopImage();
    updateMobileImage();

    // Update images on slider change
    sliderDesktop.addEventListener('input', updateDesktopImage);
    sliderMobile.addEventListener('input', updateMobileImage);
});
