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

        autoRefreshInterval = setInterval(() => {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: () => {
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

    // Open Attachments link functionality
    document.getElementById('openAttach').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default link behavior
      chrome.tabs.create({ url: 'https://www.purchasingprogramsaudi.com/common/attach.cfm' });
    });

    // Check for updates button functionality
    document.getElementById('checkForUpdates').addEventListener('click', function() {
        checkVersion(); // Directly check the version
    });

    function checkVersion() {
        // Fetch local version from manifest
        const manifest = chrome.runtime.getManifest();
        const localVersion = manifest.version;

        // Fetch remote manifest from GitHub
        fetch('https://raw.githubusercontent.com/ziadakeel55/Ministry-of-Health/main/manifest.json')
            .then(response => response.json())
            .then(remoteManifest => {
                const remoteVersion = remoteManifest.version;

                // Compare versions and take action if they differ
                if (localVersion !== remoteVersion) {
                    // Automatically download the ZIP file
                    const zipUrl = 'https://github.com/ziadakeel55/Ministry-of-Health/archive/refs/heads/main.zip';
                    const anchor = document.createElement('a');
                    anchor.href = zipUrl;
                    document.body.appendChild(anchor);
                    anchor.click();
                    document.body.removeChild(anchor);

                    alert('A new version has been downloaded. Please extract the ZIP file and load it as an unpacked extension.');
                } else {
                    alert('Your extension is already up to date.');
                }
            })
            .catch(error => {
                console.error('Error fetching remote manifest:', error);
                alert('Failed to check for updates.');
            });
    }
});
