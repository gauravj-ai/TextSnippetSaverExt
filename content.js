let editorVisible = false; // Tracks if the editor is visible
let editorElement = null; // Stores a reference to the editor element

// Function to create and attach the editor
function createEditor() {
    // Create editor container
    const container = document.createElement("div");
    container.id = "qtss-editor-container";

    // Style the editor container
    container.style.position = "fixed";
    container.style.top = "0"; // Align to the top of the viewport
    container.style.right = "0"; // Align to the right of the viewport
    container.style.width = "200px";
    container.style.height = "100vh"; // Full height of the browser
    container.style.backgroundColor = "#fff";
    container.style.borderLeft = "1px solid #ccc"; // Separator from the webpage
    container.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    container.style.zIndex = "2147483647"; // Ensure it's above other elements
    container.style.display = "none"; // Initially hidden
    container.style.overflow = "hidden";

    // Add a close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.cursor = "pointer";
    closeButton.addEventListener("click", () => {
        hideEditor();
    });

    // Add a textarea
    const textarea = document.createElement("textarea");
    textarea.id = "qtss-editor";
    textarea.style.width = "100%";
    textarea.style.height = "calc(100% - 40px)"; // Leave space for the close button
    textarea.style.resize = "none"; // Prevent resizing
    textarea.style.padding = "10px";
    textarea.style.fontSize = "14px";
    textarea.style.boxSizing = "border-box";

    // Append the close button and textarea to the container
    container.appendChild(closeButton);
    container.appendChild(textarea);

    // Append the container to the document body
    document.body.appendChild(container);

    editorElement = container; // Save reference for later use
}

// Function to show the editor and resize the webpage
function showEditor() {
    if (!editorElement) {
        createEditor();
    }

    // Display the editor
    editorElement.style.display = "block";
    editorVisible = true;

    // Apply padding to the webpage content
    document.documentElement.style.marginRight = "200px";
    document.documentElement.style.transition = "margin-right 0.3s ease-in-out";
}

// Function to hide the editor and reset the webpage
function hideEditor() {
    if (editorElement) {
        editorElement.style.display = "none";
    }
    editorVisible = false;

    // Reset the webpage content padding
    document.documentElement.style.marginRight = "0";
}

// Toggle the editor's visibility
function toggleEditor() {
    if (editorVisible) {
        hideEditor();
    } else {
        showEditor();
    }
}

// Listen for messages from the background script to toggle the editor
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "toggleEditor") {
        toggleEditor();
    }
});
