// Function to create and style the floating Auto Login button
function createLoginButton() {
    if (document.getElementById('floatingLoginButton')) {
        console.log('Floating Login Button already exists.');
        return; // Prevent creating another button if it already exists
    }

    const button = document.createElement('button');
    button.id = 'floatingLoginButton';
    button.innerText = 'Auto Login';
    button.style.position = 'fixed';
    button.style.backgroundColor = 'black';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';
    button.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.5)';
    button.style.opacity = '0.9';

    button.style.transition = 'transform 0.2s'; // Faster transition for responsiveness
    button.onmouseover = () => button.style.transform = 'scale(1.1)';
    button.onmouseout = () => button.style.transform = 'scale(1)';

    document.body.appendChild(button);
    positionButtonTopLeft();

    // Add event listener to the button
    button.addEventListener('click', fillAndSubmitLogin);
    console.log('Floating Login Button created and added to the document.');
}

function positionButtonTopLeft() {
    const floatingButton = document.getElementById('floatingLoginButton');
    floatingButton.style.top = '10px';
    floatingButton.style.left = '10px';
}

function fillAndSubmitLogin() {
    const username = 'MH-H551161'; // Your username
    const password = 'ASHE@12345'; // Your password

    const usernameField = document.getElementById('j_username');
    const passwordField = document.getElementById('j_password');
    const loginButton = document.getElementById('btnLogin');

    if (usernameField && passwordField && loginButton) {
        usernameField.value = username;
        passwordField.value = password;

        console.log('Attempting to login...');

        loginButton.click();
        document.getElementById('floatingLoginButton').style.display = 'none';
    } else {
        console.log('Login fields or button not found.');
    }
}

// Function to check span value and click required links
function checkAndClick() {
    const spanElement = document.getElementById("spfnc_waiting_confirmation_referral");

    if (spanElement && parseInt(spanElement.textContent) > 0) {
        const firstLink = document.querySelector("a[onclick^='populateNotificationsMOHTable']");
        if (firstLink) {
            firstLink.click();
            console.log("Clicked the Waiting Confirmation Referral Requests link.");

            setTimeout(() => {
                const viewButton = Array.from(document.querySelectorAll("a")).find(link => link.textContent.trim() === "View");
                if (viewButton) {
                    viewButton.click();
                    console.log("Clicked the View button.");
                    searchForLinkDocuments();
                } else {
                    console.log("View button not found.");
                }
            }, 500);
        } else {
            console.log("First link not found, retrying...");
            setTimeout(checkAndClick, 100);
        }
    } else {
        console.log("Value is 0 or element not found.");
        setTimeout(checkAndClick, 100);
    }
}

// Function to fill the form after navigating to attach.cfm
function fillForm() {
    const titleInput = document.getElementById("Title");
    const typeSelect = document.getElementById("Type1");

    if (titleInput && typeSelect) {
        titleInput.value = "Al Salalm Hospital Acceptance"; // Update the Title value
        console.log("Filled Title input with 'Al Salalm Hospital Acceptance'.");

        typeSelect.value = "11"; // Select option 11 (Acceptance)
        console.log("Selected option 11 (Acceptance) in Type dropdown.");
    } else {
        console.log("Form elements not found, retrying...");
        setTimeout(fillForm, 100); // Retry after shorter delay
    }
}

// Function to track and click the Close button and Accept button
function trackAndClickButtons() {
    const closeButton = document.querySelector("button.ui-button.ui-corner-all.ui-widget");
    const acceptButton = document.querySelector("input[name='accept']");

    if (closeButton) {
        closeButton.click();
        console.log("Clicked the Close button.");
    }

    if (acceptButton) {
        acceptButton.click();
        console.log("Clicked the Accept button.");
    }

    setTimeout(trackAndClickButtons, 1000); // Repeat every second
}

// Start the appropriate function based on the current page
window.addEventListener('load', function() {
    console.log('Page loaded: ' + window.location.href);
    
    // Create the Auto Login button only if we are on the Index page
    if (window.location.href.includes("Index.cfm") || (window.location.href.includes("purchasingprogramsaudi.com") && !window.location.href.includes("attach.cfm"))) {
        createLoginButton();
        checkAndClick(); // Start checking and clicking upon loading the page
    }

    // Execute link checking and clicking for the attach.cfm page
    if (window.location.href.includes("attach.cfm")) {
        fillForm();
        trackAndClickButtons(); // Start tracking buttons on this page
    }
});

window.addEventListener('resize', positionButtonTopLeft); // Adjust button position on window resize
