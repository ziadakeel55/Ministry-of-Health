// Function to fill the username and password fields if they exist
function fillCredentials() {
    const usernameField = document.getElementById('j_username');
    const passwordField = document.getElementById('j_password');

    if (usernameField && passwordField) {
        usernameField.value = 'MH-H551161'; // Set the username
        passwordField.value = 'ASHE@12345'; // Set the password
        console.log('Filled username and password fields.');
    } else {
        console.log('Username or password field not found.');
    }
}

// Function to check for "Waiting Confirmation Referral Requests" and click the link
function checkAndClickWaitingConfirmation() {
    const waitingConfirmationLink = document.querySelector("a[onclick^=\"populateNotificationsMOHTable('fnc_waiting_confirmation_referral'\"]");

    if (waitingConfirmationLink) {
        waitingConfirmationLink.click();
        console.log("Clicked the Waiting Confirmation Referral Requests link.");

        setTimeout(() => {
            const viewButton = Array.from(document.querySelectorAll("a")).find(link => link.textContent.trim() === "View");
            if (viewButton) {
                viewButton.click();
                console.log("Clicked the View button.");
                observeViewDocuments(); // Call the observer function after clicking "View"
            } else {
                console.log("View button not found. Retrying...");
                setTimeout(checkAndClickWaitingConfirmation, 500); // Retry after some time if the button isn't found
            }
        }, 1000); // Wait a second after clicking the link
    } else {
        console.log("Waiting Confirmation Referral Requests link not found, retrying...");
        setTimeout(checkAndClickWaitingConfirmation, 500); // Retry after some time
    }
}

// Function to observe for the presence of "View documents" text and refresh the page
function observeViewDocuments() {
    const observer = new MutationObserver(() => {
        const viewDocumentsText = Array.from(document.querySelectorAll("a")).find(link => link.textContent.trim() === "View documents");

        if (viewDocumentsText) {
            console.log("Found 'View documents' text. Refreshing the page.");
            location.reload(); // Reload the page if "View documents" is found
            observer.disconnect(); // Stop observing once the condition is met
        } else {
            console.log("'View documents' text not found.");
        }
    });

    // Start observing the body for child list changes
    observer.observe(document.body, { childList: true, subtree: true });
}

// Function to observe for "Link documents" text and refresh a specific tab
let hasRefreshedSpecificTab = false; // Track if the specific tab has already been refreshed

function observeLinkDocuments() {
    const observer = new MutationObserver(() => {
        const linkDocumentsText = Array.from(document.querySelectorAll("a")).find(link => link.textContent.trim() === "Link documents");

        if (linkDocumentsText && !hasRefreshedSpecificTab) {
            console.log("Found 'Link documents' text. Requesting to refresh the specific tab.");
            refreshSpecificTab(); // Refresh the specific tab
            hasRefreshedSpecificTab = true; // Mark that the tab has been refreshed
            observer.disconnect(); // Stop observing once the condition is met
        } else {
            console.log("'Link documents' text not found or tab already refreshed.");
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Function to refresh the specific tab
function refreshSpecificTab() {
    chrome.runtime.sendMessage({ action: "refreshTab" }, (response) => {
        if (response && response.success) {
            console.log("Specific tab refreshed successfully.");
        } else {
            console.log("Failed to refresh specific tab.");
        }
    });
}

// Function to fill the form after navigating to attach.cfm
function fillForm() {
    const titleInput = document.getElementById("Title");
    const typeSelect = document.getElementById("Type1");

    if (titleInput && typeSelect) {
        titleInput.value = "Al Salalm Hospital Acceptance"; // Update the Title value
        console.log("Filled Title input with 'Al Salalm Hospital Acceptance'.");

        // Select option 11 in the dropdown (Acceptance)
        const optionToSelect = typeSelect.querySelector("option[value='11']");
        if (optionToSelect) {
            typeSelect.value = "11"; // Select option 11 (Acceptance)
            console.log("Selected option 11 (Acceptance) in Type dropdown.");
        } else {
            console.log("Option 11 not found in the dropdown.");
        }
    } else {
        console.log("Form elements not found, retrying...");
        setTimeout(fillForm, 1000); // Retry after a short delay if the form elements are not found
    }
}

// Function to track and click the Close button and Accept button
function trackAndClickButtons() {
    const closeButtons = document.querySelectorAll("button.ui-button.ui-corner-all.ui-widget");
    const acceptButton = document.querySelector("input[name='accept']");

    // Check for Close buttons
    closeButtons.forEach((closeButton) => {
        if (closeButton) {
            closeButton.click();
            console.log("Clicked the Close button.");
        }
    });

    // Check for Accept button
    if (acceptButton) {
        acceptButton.click();
        console.log("Clicked the Accept button.");
    }
}

// Start checking for buttons every second
setInterval(trackAndClickButtons, 1000); // Check every second

// Start the appropriate function based on the current page
window.addEventListener('load', function() {
    console.log('Page loaded: ' + window.location.href);
    
    // Fill credentials if on the login page
    fillCredentials(); // Call the function to fill credentials

    // Check and click the waiting confirmation link
    checkAndClickWaitingConfirmation(); // Call the function to check and click

    // Start observing for View and Link documents after page load
    observeViewDocuments(); // Observe for 'View documents' text
    observeLinkDocuments(); // Observe for 'Link documents' text

    // Execute tracking for buttons immediately after page load
    trackAndClickButtons(); // Call the function to check and click buttons

    // Call the form filler if on the attach.cfm page
    if (window.location.href.includes("attach.cfm")) {
        fillForm(); // Fill the form if on the correct page
    }
});
