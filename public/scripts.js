/**
 * @type {HTMLTextAreaElement}
 */
const promptInputElement = document.getElementById("prompt-input");

/**
 * @type {HTMLButtonElement}
 */
const sendBtnElement = document.getElementById("send-btn");

/**
 * @type {HTMLButtonElement}
 */
const clearBtnElement = document.getElementById("clear-btn");

/**
 * @type {HTMLButtonElement}
 */
const debugToggleBtnElement = document.getElementById("debug-toggle-btn");

/**
 * @type {HTMLDivElement}
 */
const displayerElement = document.getElementById("displayer");

// Debug mode state
let debugModeEnabled = false;

// Initialize the UI
function initUI() {
    // Disable send button if input is empty
    promptInputElement.addEventListener("input", () => {
        sendBtnElement.disabled = !promptInputElement.value.trim();
    });
    
    // Initial state
    sendBtnElement.disabled = true;
    
    // Add welcome message
    appendMessage("Welcome to Supa Coda! Describe what you want to build, and I'll help you create it.", "message");
}

function appendMessage(message, type) {
    console.log("Type:", type)

    let msgContainerElement = document.createElement("div");
    let roleIndicateElement = document.createElement("p");
    msgContainerElement.append(roleIndicateElement);

    if (type == "debug_message") {
        roleIndicateElement.innerHTML = "Debug >"
        msgContainerElement.classList.add("debug-message");
        
        // Add hide-debug class if debug mode is disabled
        if (!debugModeEnabled) {
            msgContainerElement.classList.add("hide-debug");
        }

        const preContent = document.createElement("pre");
        const codeContent = document.createElement("code");
        codeContent.classList.add("debug-code");
        try {
            // Try to parse as JSON for better formatting
            const jsonData = JSON.parse(message);
            codeContent.innerHTML = JSON.stringify(jsonData, null, 2);
        } catch (e) {
            // If not valid JSON, display as is
            codeContent.innerHTML = message;
        }
        preContent.append(codeContent);
        msgContainerElement.append(preContent);

        displayerElement.append(msgContainerElement);
        return;
    }

    if (type == "json_message") {
        roleIndicateElement.innerHTML = "Supa Coda >"
        const preContent = document.createElement("pre");
        const codeContent = document.createElement("code");
        codeContent.innerHTML = message;
        preContent.append(codeContent);
        msgContainerElement.append(preContent);

        displayerElement.append(msgContainerElement)
        return;
    }

    if (type == "code_message") {
        console.log("Code message:", JSON.parse(message))

        roleIndicateElement.innerHTML = "Supa Coda >"
        const preContent = document.createElement("pre");
        const codeContent = document.createElement("code");
        codeContent.innerHTML = JSON.parse(message);
        preContent.append(codeContent);
        msgContainerElement.append(preContent);

        displayerElement.append(msgContainerElement)
        return;
    }

    if (type == "message") {
        roleIndicateElement.innerHTML = "Supa Coda >"

        message.split("\n").forEach((line) => {
            const p = document.createElement("p");
            p.innerHTML = line;
            msgContainerElement.append(p);
        })
        displayerElement.append(msgContainerElement)
        return;
    }

    roleIndicateElement.innerHTML = "User >"
    message.split("\n").forEach((line) => {
        const p = document.createElement("p");
        p.innerHTML = line;
        msgContainerElement.append(p);
    })

    displayerElement.append(msgContainerElement);
    
    // Scroll to the bottom
    displayerElement.scrollTop = displayerElement.scrollHeight;
}

async function handleSend() {
    const userPrompt = promptInputElement.value.trim();
    if (!userPrompt) return;
    
    // Disable the send button during processing
    sendBtnElement.disabled = true;
    
    appendMessage(userPrompt);
    
    // Clear the input after sending
    promptInputElement.value = "";
    
    try {
        const response = await fetch("/api/agents/message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: userPrompt
            })
        });
        
        // Handle the event stream response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            
            // Process complete events in the buffer
            const lines = buffer.split('\n\n');
            buffer = lines.pop() || ''; // Keep the last incomplete chunk in the buffer
            
            for (const line of lines) {
                if (!line.trim()) continue;
                
                // Parse the event
                const eventLines = line.split('\n');
                let eventType = 'message';
                let eventData = '';
                
                for (const eventLine of eventLines) {
                    if (eventLine.startsWith('event:')) {
                        eventType = eventLine.substring(6).trim();
                    } else if (eventLine.startsWith('data:')) {
                        eventData = eventLine.substring(5).trim();
                    }
                }
                
                // Handle the event based on its type
                if (eventData) {
                    appendMessage(eventData, eventType);
                }
            }
        }
    } catch (error) {
        console.error("Error:", error);
        appendMessage("An error occurred while communicating with the server.", "message");
    } finally {
        // Re-enable the send button after processing
        sendBtnElement.disabled = false;
    }
}

function clearConversation() {
    // Clear all messages except the welcome message
    while (displayerElement.childNodes.length > 1) {
        displayerElement.removeChild(displayerElement.lastChild);
    }
}

// Toggle debug mode
function toggleDebugMode() {
    debugModeEnabled = !debugModeEnabled;
    
    // Update button appearance
    if (debugModeEnabled) {
        debugToggleBtnElement.classList.remove("debug-toggle-off");
        debugToggleBtnElement.classList.add("debug-toggle-on");
    } else {
        debugToggleBtnElement.classList.remove("debug-toggle-on");
        debugToggleBtnElement.classList.add("debug-toggle-off");
    }
    
    // Show/hide existing debug messages
    const debugMessages = document.querySelectorAll(".debug-message");
    debugMessages.forEach(msg => {
        if (debugModeEnabled) {
            msg.classList.remove("hide-debug");
        } else {
            msg.classList.add("hide-debug");
        }
    });
}

// Event listeners
sendBtnElement.addEventListener("click", handleSend);
clearBtnElement.addEventListener("click", clearConversation);
debugToggleBtnElement.addEventListener("click", toggleDebugMode);

// Allow sending with Enter key (Shift+Enter for new line)
promptInputElement.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!sendBtnElement.disabled) {
            handleSend();
        }
    }
});

// Initialize the UI
initUI();