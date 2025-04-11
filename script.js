/**
 * EcoDrive Website Functionality
 *
 * Includes:
 * - Theme Toggle (Light/Dark Mode) with localStorage persistence
 * - Mobile Menu Toggle
 * - Emission Counter Animation on Scroll
 * - Contact Form Submission Simulation with Validation
 * - Smooth Scrolling for Anchor Links
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement; // Target the <html> element

    /**
     * Sets the theme (dark or light) by adding/removing the 'dark' class
     * from the HTML element and updating the toggle icon.
     * @param {boolean} isDark - True to set dark mode, false for light mode.
     */
    const setTheme = (isDark) => {
        if (isDark) {
            htmlElement.classList.add('dark'); // Add 'dark' class to <html>
            if (themeIcon) themeIcon.textContent = 'sun'; // Lucide icon name for sun
            localStorage.setItem('theme', 'dark'); // Save preference
        } else {
            htmlElement.classList.remove('dark'); // Remove 'dark' class from <html>
            if (themeIcon) themeIcon.textContent = 'moon'; // Lucide icon name for moon
            localStorage.setItem('theme', 'light'); // Save preference
        }
    };

    // Check initial theme preference on page load
    try {
        // 1. Check localStorage first
        const savedTheme = localStorage.getItem('theme');
        // 2. If no localStorage, check OS preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        // Determine initial state: localStorage > OS preference > default (light)
        let initialDark = false;
        if (savedTheme) {
            initialDark = savedTheme === 'dark';
        } else {
            initialDark = prefersDark;
        }
        // Apply the initial theme
        setTheme(initialDark);
    } catch (error) {
        console.error("Error setting initial theme:", error);
        // Fallback to light theme if error occurs
        setTheme(false);
    }


    // Add click listener for the theme toggle button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            // Toggle based on the current state of the <html> element
            setTheme(!htmlElement.classList.contains('dark'));
        });
    } else {
        console.error("Theme toggle button (#theme-toggle) not found.");
    }

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('.lucide') : null;
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('.mobile-link') : [];

    if (mobileMenuBtn && mobileMenu && mobileMenuIcon) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            // Toggle icon between 'menu' and 'x' (close)
            mobileMenuIcon.textContent = isHidden ? 'menu' : 'x';
        });

        // Add click listener to each mobile menu link to close the menu
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden'); // Hide the menu
                mobileMenuIcon.textContent = 'menu'; // Reset icon to 'menu'
            });
        });
    } else {
         console.error("Mobile menu elements (#mobile-menu-button, #mobile-menu) not found.");
    }


    // --- Emission Counter Animation ---
    const counterElement = document.getElementById('emission-counter');
    if (counterElement) {
        const targetValue = parseInt(counterElement.getAttribute('data-target'), 10);
        const animationDuration = 2000; // Animation duration in milliseconds

        /**
         * Animates a number incrementing from start to end over a duration.
         * @param {HTMLElement} element - The HTML element to update.
         * @param {number} start - The starting number.
         * @param {number} end - The target number.
         * @param {number} duration - Animation duration in milliseconds.
         */
        const animateCounter = (element, start, end, duration) => {
            let startTime = null;

            // The step function uses requestAnimationFrame for smooth animation
            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const currentValue = Math.floor(progress * (end - start) + start);
                // Format number with commas for readability
                element.textContent = currentValue.toLocaleString();

                // Continue animation if progress is less than 1
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    // Ensure the final value is exactly the target
                    element.textContent = end.toLocaleString();
                }
            };
            // Start the animation
            window.requestAnimationFrame(step);
        };

        // Use Intersection Observer API to trigger the animation
        // only when the counter element scrolls into view.
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Check if the element is intersecting (visible) and hasn't been animated yet
                if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
                    entry.target.classList.add('visible'); // Mark as animated
                    animateCounter(entry.target, 0, targetValue, animationDuration);
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, {
            threshold: 0.5 // Trigger when at least 50% of the element is visible
        });

        // Start observing the counter element
        observer.observe(counterElement);
    } else {
        console.error("Emission counter element (#emission-counter) not found.");
    }


    // --- Contact Form Simulation ---
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success-message');
    // Get the paragraph tag designated for error messages within the form
    const formErrorMessage = contactForm ? contactForm.querySelector('.form-error-message') : null;

    if (contactForm && successMessage && formErrorMessage) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent the default browser form submission
            formErrorMessage.classList.add('hidden'); // Hide error message initially
            formErrorMessage.textContent = '';       // Clear previous error message

            let isValid = true;
            // Check each required field within the form
            contactForm.querySelectorAll('[required]').forEach(input => {
                // Reset specific error styling first
                input.classList.remove('border-red-500', 'dark:border-red-400', 'focus:ring-red-500');
                input.classList.add('focus:ring-green-500'); // Restore default focus style

                // Check if the input (or textarea) value is empty after trimming whitespace
                if (!input.value.trim()) {
                    isValid = false;
                    // Apply error styling
                    input.classList.add('border-red-500', 'dark:border-red-400');
                    // Change focus ring color to indicate error
                    input.classList.remove('focus:ring-green-500');
                    input.classList.add('focus:ring-red-500');
                }
            });

            if (isValid) {
                // --- Form is valid ---
                // Simulate sending data (log to console)
                // In a real application, you would send this data to a server here.
                console.log('Form data (simulation):', {
                    name: contactForm.name.value,
                    email: contactForm.email.value,
                    subject: contactForm.subject.value,
                    message: contactForm.message.value,
                });

                // Hide the form and display the success message
                contactForm.classList.add('hidden');
                successMessage.classList.remove('hidden');

                // Optional: Reset the form and hide success message after a delay
                // setTimeout(() => {
                //     contactForm.reset();
                //     // Reset error styles on all required fields before showing form again
                //     contactForm.querySelectorAll('[required]').forEach(input => {
                //         input.classList.remove('border-red-500', 'dark:border-red-400', 'focus:ring-red-500');
                //         input.classList.add('focus:ring-green-500');
                //     });
                //     contactForm.classList.remove('hidden');
                //     successMessage.classList.add('hidden');
                // }, 5000); // Reset after 5 seconds

            } else {
                // --- Form is invalid ---
                // Find the first field with an error and focus it for better UX
                const firstInvalid = contactForm.querySelector('.border-red-500');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                // Display the error message in the designated paragraph
                formErrorMessage.textContent = 'Please fill in all required fields.';
                formErrorMessage.classList.remove('hidden'); // Make error message visible
            }
        });
    } else {
         console.error("Contact form elements (#contact-form, #form-success-message, .form-error-message) not found.");
    }

     // --- Smooth Scroll for Anchor Links ---
     // Handles smooth scrolling when clicking links like <a href="#features">...</a>
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Ensure it's a valid internal link
            if (href && href.startsWith('#') && href.length > 1) {
                const targetElement = document.querySelector(href);
                // Ensure the target element exists on the page
                if (targetElement) {
                    e.preventDefault(); // Prevent default jump behavior

                    // Calculate offset for sticky header (if exists)
                    const header = document.querySelector('header');
                    const headerOffset = header ? header.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    // Calculate final scroll position, accounting for header height
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    // Perform smooth scroll
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

}); // End DOMContentLoaded
