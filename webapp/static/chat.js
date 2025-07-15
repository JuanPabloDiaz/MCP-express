const inputField = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
inputField.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        sendRequest();
    }
});
const chatHistory = document.getElementById('chatHistory');
window.onload = function () {
    inputField.focus();
};

let requestInProcess = false;
async function sendRequest() {
    if (requestInProcess) {
        return;
    }
    setBusy(true);
    const question = inputField.value;
    inputField.value = "";
    const questionElement = document.createElement("div");
    questionElement.classList.add('chat-entry');
    questionElement.classList.add('user');
    questionElement.innerText = question;
    chatHistory.appendChild(questionElement);

    const answerElement = document.createElement("div");
    answerElement.classList.add('chat-entry');
    answerElement.classList.add('bot');
    const loadingIndicator = document.createElement("div");
    loadingIndicator.classList.add('loadingIndicator');
    answerElement.appendChild(loadingIndicator);
    chatHistory.appendChild(answerElement);
    chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to the bottom

    try {
        const response = await fetch('/api/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: question })
        });

        if (!response.ok) {
            throw new Error('Request failed. Did you start Ollama?');
        }

        // Stream the response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let content = '';
        setBusy(false);
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            content += chunk;
            answerElement.innerText = content;
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    } catch (error) {
        answerElement.innerText = error.message;
        alert(error.message);
    } finally {
        setBusy(false);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        inputField.focus();
    }
}
function setBusy(busy) {
    inputField.disabled = busy;
    sendButton.disabled = busy;
    if (busy) {
        sendButton.classList.add('disabled');
    } else {
        sendButton.classList.remove('disabled');
    }
    requestInProcess = busy;
}

