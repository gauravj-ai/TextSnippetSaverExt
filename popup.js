document.addEventListener("DOMContentLoaded", () => {
    const editor = document.getElementById("editor");
    
    const clearButton = document.getElementById("clearPage");    
    const downloadPageButton = document.getElementById("downloadPage");
    
    const clearAllButton = document.getElementById("clearAll");
    const downloadAllButton = document.getElementById("downloadAll");
    
    //downloadAllButton.textContent = "Download All Notes"; // Change label
    //downloadPageButton.textContent = "Download Notes - This Page"; // Add new button
    //downloadAllButton.parentNode.insertBefore(downloadPageButton, downloadAllButton);

    console.log("Popup loaded, buttons initialized.");

    // Get the URL of the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = new URL(tabs[0].url).hostname; // Get the hostname of the page
        console.log("Current URL:", url);

        // Retrieve and display saved data for the current page
        chrome.storage.local.get("savedData", (data) => {
            const savedData = data.savedData || {};
            const pageData = savedData[url] || [];
            editor.value = pageData.join("\n\n"); // Display saved text
            console.log("Loaded saved data for current page:", pageData);
        });
    });

    // Save edits made to the text editor
    editor.addEventListener("input", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = new URL(tabs[0].url).hostname;
            console.log("Saving data for URL:", url);

            chrome.storage.local.get("savedData", (data) => {
                const savedData = data.savedData || {};
                savedData[url] = editor.value.split("\n\n"); // Save changes as an array of lines
                chrome.storage.local.set({ savedData }, () => {
                    console.log("Data saved successfully.");
                });
            });
        });
    });

    // Clear all text for the current page
    clearButton.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = new URL(tabs[0].url).hostname;
            console.log("Clearing data for URL:", url);

            chrome.storage.local.get("savedData", (data) => {
                const savedData = data.savedData || {};
                savedData[url] = []; // Clear only for the current page
                chrome.storage.local.set({ savedData }, () => {
                    editor.value = ""; // Clear the editor
                    console.log("Data cleared for URL:", url);
                });
            });
        });
    });


    // Download notes for the current page
    downloadPageButton.addEventListener("click", () => {
        console.log("Download Notes - This Page button clicked.");
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = new URL(tabs[0].url).hostname;
            console.log("Retrieving data for current page:", url);

            chrome.storage.local.get("savedData", (data) => {
                const savedData = data.savedData || {};
                const pageData = savedData[url] || [];
                
                if (pageData.length === 0) {
                    alert("No notes for this page to download.");
                    return;
                }

                // Generate file content
                const fileContent = `URL: ${url}\nNote:\n${pageData.join("\n\n")}\n`;

                // Generate file name: Notes_<Website Domain>_<Date>_<Time>.txt
                
function getFormattedTimestamp() {
    const now = new Date();
    const pad = (num) => String(num).padStart(2, "0"); // Ensure two digits
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const hour12 = hours % 12 || 12; // Convert to 12-hour format, ensuring '0' becomes '12'

    return `${pad(now.getMonth() + 1)}_${pad(now.getDate())}_${now.getFullYear()}_${pad(hour12)}_${pad(minutes)}_${ampm}`;
}

            const timestamp = getFormattedTimestamp();


                const filename = `Notes_${url}_${timestamp}.txt`;

                // Create a blob and a temporary link to download the file
                const blob = new Blob([fileContent], { type: "text/plain" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.click();
                URL.revokeObjectURL(link.href); // Cleanup
                console.log("Notes for current page downloaded.");
            });
        });
    });


// Clear notes for all pages
    clearAllButton.addEventListener("click", () => {
        console.log("Clearing all notes...");
        chrome.storage.local.set({ savedData: {} }, () => {
            alert("All notes have been cleared.");
        });
    });


// Download all saved notes
downloadAllButton.addEventListener("click", () => {
    console.log("Download All Notes button clicked.");
    chrome.storage.local.get("savedData", (data) => {
        const savedData = data.savedData || {};
        console.log("Saved data retrieved for download:", savedData);

        // Check if there is any data to download
        const hasData = Object.keys(savedData).some((url) => savedData[url].length > 0);

        if (!hasData) {
            alert("No notes to download.");
            return;
        }

        let fileContent = "";

        for (const [url, notes] of Object.entries(savedData)) {
            if (notes.length > 0) { // Only include URLs with notes
                fileContent += `URL: ${url}\nNote:\n${notes.join("\n\n")}\n\n`;
            }
        }

        // Generate file name: All_Notes_<Date>_<Time>.txt

function getFormattedTimestamp() {
    const now = new Date();
    const pad = (num) => String(num).padStart(2, "0"); // Ensure two digits
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const hour12 = hours % 12 || 12; // Convert to 12-hour format, ensuring '0' becomes '12'

    return `${pad(now.getMonth() + 1)}_${pad(now.getDate())}_${now.getFullYear()}_${pad(hour12)}_${pad(minutes)}_${ampm}`;
}


        const timestamp = getFormattedTimestamp();
        const filename = `All_Notes_${timestamp}.txt`;

        // Create a blob and a temporary link to download the file
        const blob = new Blob([fileContent], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href); // Cleanup
        console.log("All notes file downloaded.");
    });
});

});



    


    
