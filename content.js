// Function to create and style the floating Auto Login button
function createLoginButton() {
    if (document.getElementById('floatingLoginButton')) return;

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
                verifyAndClickView();
            }, 100); // Reduced delay for faster response
        } else {
            console.log("First link not found, retrying...");
            setTimeout(checkAndClick, 100); // Retry after shorter delay
        }
    } else {
        console.log("Value is 0 or element not found.");
        setTimeout(checkAndClick, 100); // Retry after shorter delay
    }
}

// Function to verify the referral ID and click the View button if it matches
function verifyAndClickView() {
    // Get the stored referral ID from chrome.storage
    chrome.storage.local.get(['referralNumber'], function(result) {
        const storedReferralID = result.referralNumber;
        let foundMatch = false;

        const rows = document.querySelectorAll("tr[role='row']");
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const referralID = cells[0]?.textContent.trim(); // Get the referral ID from the first cell

            if (referralID === storedReferralID) {
                const viewButton = row.querySelector("a.input_btn");
                if (viewButton) {
                    viewButton.click();
                    foundMatch = true;
                    console.log("Clicked the View button for referral ID:", referralID);

                    // Check for Accept button
                    monitorAcceptButton();

                    // Check for the 15-minute message after clicking the View button
                    setTimeout(checkFor15MinuteMessage, 100); // Reduced delay for faster checking
                }
            }
        });

        if (!foundMatch) {
            console.log("No matching referral ID found. Retrying...");
            setTimeout(verifyAndClickView, 100); // Retry after shorter delay
        }
    });
}

// Function to check for the 15-minute message and close the dialog
function checkFor15MinuteMessage() {
    const messageDialog = document.querySelector("#msgdialog.ui-dialog-content");
    if (messageDialog && messageDialog.textContent.includes("You cannot perform any update before 15 minutes from the referral date creation")) {
        console.log("15-minute wait message found.");

        // Find the Close button and click it
        const closeButton = document.querySelector("button.ui-button.ui-corner-all.ui-widget");
        if (closeButton) {
            closeButton.click();
            console.log("Clicked the Close button.");
        } else {
            console.log("Close button not found.");
        }
    } else {
        console.log("15-minute wait message not found.");
    }
}

// Function to check for the Accept button and handle it
function monitorAcceptButton() {
    const acceptButton = document.getElementById("accept");

    if (acceptButton) {
        acceptButton.click();
        console.log("Clicked the 'Accept' button.");
    } else {
        console.log("'Accept' button not found, refreshing page...");
        setTimeout(() => {
            location.reload(); // Refresh the page
        }, 100); // Reduced delay before refresh
    }
}

// Function to automatically monitor for the Close button and click it whenever it appears
function monitorCloseButton() {
    const closeButton = document.querySelector("button.ui-button.ui-corner-all.ui-widget");

    if (closeButton) {
        closeButton.click();
        console.log("Clicked the Close button.");
    } else {
        console.log("Close button not found, checking again...");
    }

    // Keep checking for the Close button every 100ms
    setTimeout(monitorCloseButton, 100); // Reduced delay for faster checking
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

// Start the appropriate function based on the current page
window.addEventListener('load', function() {
    // Create the Auto Login button only if we are on the Index page
    if (window.location.href.includes("Index.cfm") || window.location.href.includes("purchasingprogramsaudi.com") && !window.location.href.includes("attach.cfm")) {
        createLoginButton();
    }
    // Execute link checking and clicking for the Index page
    if (window.location.href.includes("Index.cfm")) {
        checkAndClick();
    } else if (window.location.href.includes("attach.cfm")) {
        fillForm();
    }

    // Start monitoring for the Close button on any page
    monitorCloseButton();
});

window.addEventListener('resize', positionButtonTopLeft);
