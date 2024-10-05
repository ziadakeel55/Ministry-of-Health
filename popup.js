document.addEventListener('DOMContentLoaded', function () {
    const autoRefreshToggle = document.getElementById('autoRefreshToggle');
    const autoRefreshTime = document.getElementById('autoRefreshTime');

    // Load auto-refresh state on popup open
    chrome.storage.local.get(['autoRefreshState', 'autoRefreshTimeValue'], function (result) {
        autoRefreshToggle.checked = result.autoRefreshState || false;
        autoRefreshTime.value = result.autoRefreshTimeValue || 1; // Default to 1 second if not set
    });

    // Close button functionality
    document.getElementById('closeButton').addEventListener('click', function () {
        window.close();
    });

    // Refresh button functionality
    document.getElementById('refreshButton').addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: () => location.reload()
            });
        });
    });

    // Open Attachments button functionality
    document.getElementById('openAttach').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default link behavior
        chrome.tabs.create({ url: 'https://www.purchasingprogramsaudi.com/common/attach.cfm' });
    });

    // Auto-refresh toggle functionality
    autoRefreshToggle.addEventListener('change', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const activeTabId = tabs[0].id;

            if (this.checked) {
                startAutoRefresh(activeTabId);
            } else {
                stopAutoRefresh(activeTabId);
            }
            // Store auto-refresh state
            chrome.storage.local.set({ autoRefreshState: this.checked });
        }.bind(this)); // Bind 'this' to maintain context
    });

    // Auto-refresh time input functionality
    autoRefreshTime.addEventListener('input', function () {
        const seconds = parseFloat(this.value);
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const activeTabId = tabs[0].id;

            if (autoRefreshToggle.checked && seconds > 0) {
                stopAutoRefresh(activeTabId);
                startAutoRefresh(activeTabId); // Restart the auto-refresh with the new time
            }
            // Store the auto-refresh time value
            chrome.storage.local.set({ autoRefreshTimeValue: seconds });
        });
    });

    function startAutoRefresh(tabId) {
        const seconds = parseFloat(autoRefreshTime.value);
        if (isNaN(seconds) || seconds <= 0) {
            alert('Please enter a valid number of seconds greater than 0.');
            autoRefreshToggle.checked = false; // Uncheck the toggle if invalid time is provided
            chrome.storage.local.set({ autoRefreshState: false });
            return;
        }

        chrome.runtime.sendMessage({ action: "startAutoRefresh", tabId: tabId, seconds: seconds });
    }

    function stopAutoRefresh(tabId) {
        chrome.runtime.sendMessage({ action: "stopAutoRefresh", tabId: tabId });
    }

    // Check for updates button functionality
    document.getElementById('checkForUpdates').addEventListener('click', function () {
        checkVersion(); // Directly check the version
    });

    function checkVersion() {
        const manifest = chrome.runtime.getManifest();
        const localVersion = manifest.version;

        fetch('https://raw.githubusercontent.com/ziadakeel55/Ministry-of-Health/main/manifest.json')
            .then(response => response.json())
            .then(remoteManifest => {
                const remoteVersion = remoteManifest.version;

                if (localVersion !== remoteVersion) {
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
