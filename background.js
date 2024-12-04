// Create context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveText",
    title: "Send to QTSS",
    contexts: ["selection"] // Show only when text is selected
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveText") {
    const selectedText = info.selectionText.trim();
    const url = new URL(tab.url).hostname; // Use hostname to identify the webpage

    if (selectedText) {
      chrome.storage.local.get("savedData", (data) => {
        const savedData = data.savedData || {};
        const pageData = savedData[url] || [];
        pageData.push(selectedText);
        savedData[url] = pageData;
        chrome.storage.local.set({ savedData });
      });
    }
  }
});
