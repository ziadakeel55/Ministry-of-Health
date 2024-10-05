let autoRefreshIntervals = {}; // To store intervals for each tab

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startAutoRefresh") {
        const { tabId, seconds } = request;

        if (autoRefreshIntervals[tabId]) {
            clearInterval(autoRefreshIntervals[tabId]); // Clear any existing interval
        }

        autoRefreshIntervals[tabId] = setInterval(() => {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: () => {
                    let resources = document.querySelectorAll('img, iframe, script');
                    resources.forEach(resource => resource.remove());
                    location.reload();
                }
            });
        }, seconds * 1000); // Convert seconds to milliseconds
    }

    if (request.action === "stopAutoRefresh") {
        const { tabId } = request;

        if (autoRefreshIntervals[tabId]) {
            clearInterval(autoRefreshIntervals[tabId]);
            delete autoRefreshIntervals[tabId]; // Remove the interval reference
        }
    }
});
