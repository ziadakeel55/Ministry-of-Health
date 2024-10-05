// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "refreshTab") {
        const urlToRefresh = "https://www.purchasingprogramsaudi.com/common/attach.cfm";

        chrome.tabs.query({}, (tabs) => {
            const tabToRefresh = tabs.find(tab => tab.url === urlToRefresh);
            if (tabToRefresh) {
                chrome.tabs.reload(tabToRefresh.id, { bypassCache: true });
                console.log("Refreshed the tab with URL:", urlToRefresh);
                sendResponse({ success: true });
            } else {
                console.log("No tab found with the URL:", urlToRefresh);
                sendResponse({ success: false });
            }
        });
        return true; // Indicate that we will send a response asynchronously
    }
});
