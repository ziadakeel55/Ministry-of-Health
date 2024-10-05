document.addEventListener('DOMContentLoaded', function () {
    // Open Attachments button functionality
    document.getElementById('openAttach').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default link behavior
        chrome.tabs.create({ url: 'https://www.purchasingprogramsaudi.com/common/attach.cfm' });
    });
});
