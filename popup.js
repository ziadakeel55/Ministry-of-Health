document.addEventListener('DOMContentLoaded', function() {
    const referralInput = document.getElementById('referralInput');
    const savedMessage = document.getElementById('savedMessage');
    const lastUpdated = document.getElementById('lastUpdated');
    const autoRefreshToggle = document.getElementById('autoRefreshToggle');
    const autoRefreshTime = document.getElementById('autoRefreshTime');
    let autoRefreshInterval;

    // Load saved Referral Number and last updated time
    chrome.storage.local.get(['referralNumber', 'lastUpdated'], function(result) {
        if (result.referralNumber) {
            referralInput.value = result.referralNumber;
        }
        if (result.lastUpdated) {
            lastUpdated.innerText = 'Last updated: ' + result.lastUpdated;
        }
    });

    // Hide the saved message initially
    savedMessage.style.display = 'none';

    // Prevent spaces in Referral ID input
    referralInput.addEventListener('input', function() {
        this.value = this.value.replace(/\s/g, '');
    });

    // Save button functionality
    document.getElementById('saveButton').addEventListener('click', function() {
        const referralInputValue = referralInput.value.trim();
        if (referralInputValue && !/^\d+$/.test(referralInputValue)) {
            alert('Referral Number must contain only numbers.');
            return;
        }
        chrome.storage.local.set({ referralNumber: referralInputValue, lastUpdated: new Date().toLocaleString() }, function() {
            console.log('Referral Number saved:', referralInputValue);
            savedMessage.style.display = 'block';
            savedMessage.style.opacity = 1;
            savedMessage.classList.add('fade-in');
            setTimeout(() => {
                savedMessage.classList.remove('fade-in');
                savedMessage.style.opacity = 0;
                setTimeout(() => {
                    savedMessage.style.display = 'none';
                }, 500);
            }, 2000);
            lastUpdated.innerText = 'Last updated: ' + new Date().toLocaleString();
        });
    });

    // Clear button functionality
    document.getElementById('clearButton').addEventListener('click', function() {
        referralInput.value = '';
        chrome.storage.local.remove(['referralNumber', 'lastUpdated'], function() {
            console.log('Referral Number cleared.');
            lastUpdated.innerText = 'Last updated: Not saved yet';
        });
    });

    // Refresh button functionality
    document.getElementById('refreshButton').addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: () => location.reload()
            });
        });
    });

    // Auto-refresh toggle functionality
    autoRefreshToggle.addEventListener('change', function() {
        if (this.checked) {
            startAutoRefresh();
        } else {
            stopAutoRefresh();
        }
    });

    // Auto-refresh time input functionality
    autoRefreshTime.addEventListener('input', function() {
        const seconds = parseFloat(this.value);
        if (autoRefreshToggle.checked && seconds > 0) {
            stopAutoRefresh();
            startAutoRefresh(); // Restart the auto-refresh with the new time
        }
    });

    function startAutoRefresh() {
        const seconds = parseFloat(autoRefreshTime.value); // Parse decimal values for seconds
        if (isNaN(seconds) || seconds <= 0) {
            alert('Please enter a valid number of seconds greater than 0.');
            autoRefreshToggle.checked = false; // Uncheck the toggle if invalid time is provided
            return;
        }
        
        // Using fetch or XMLHttpRequest to load content without full page reload
        autoRefreshInterval = setInterval(() => {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: () => {
                        // Remove unnecessary resources to speed up reload
                        let resources = document.querySelectorAll('img,iframe,script');
                        resources.forEach(resource => resource.remove());
                        location.reload();
                    }
                });
            });
        }, seconds * 1000); // Convert seconds to milliseconds
    }

    function stopAutoRefresh() {
        clearInterval(autoRefreshInterval);
    }

    // Close button functionality
    document.getElementById('closeButton').addEventListener('click', function() {
        window.close();
    });
});
