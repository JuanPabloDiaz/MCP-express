const socket = new WebSocket(`ws://${location.host}`);

socket.onopen = function (event) {
    console.log('WebSocket is open now.');
};

socket.onclose = function (event) {
    alert('WebSocket is closed now. Refreshing the browser...');
    reloadPage();
};

socket.onerror = function (error) {
    alert('WebSocket error:', error);
    reloadPage();
};

function reloadPage() {
    if (window.parent) {
        window.parent.location.reload()
    } else {
        location.reload();
    }
}

socket.onmessage = function (event) {
    const message = JSON.parse(event.data);
    console.log('Message from server:', event.data);
    socket.send(JSON.stringify({
        correlationId: message.correlationId,
        data: handleMessage(message)
    }));
};

function handleMessage(message) {
    const messageData = JSON.parse(message.data);
    switch (messageData.action) {
        case "getButtons":
            return getButtons();
        case "pressButton":
            return pressButton(messageData.buttonId);
        default:
            return "Action not found" + action;
    }
}

function getButtons() {
    const buttons = document.querySelectorAll('#target-app button');
    return Array.from(buttons).map(button => `${button.id}: ${button.textContent}`).join(', ');
}

function pressButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.click();
        return `Button with ID ${buttonId} clicked`;
    } else {
        return `Button with ID '${buttonId}' not found.`;
    }
}

let toast;
let toastTimeOut;

function showToast(message, textColor, backgroundColor) {
    // Show toast
    if (toast) {
        toast.remove();
        toast = null;
    }
    if (toastTimeOut) {
        clearTimeout(toastTimeOut);
        toastTimeOut = null;
    }
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = backgroundColor;
    toast.style.color = textColor;
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '1000';
    document.body.appendChild(toast);
}

function showSparkleEffect(button) {
    const buttonRect = button.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
        const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        star.setAttribute('viewBox', '0 0 784.11 815.53');
        star.setAttribute('style', 'position: absolute; width: 20px; height: 20px; pointer-events: none;');
        star.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
        star.style.top = `${buttonRect.top + buttonRect.height / 2}px`;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z');
        path.setAttribute('class', 'fil0');
        path.setAttribute('fill', 'gold');

        star.appendChild(path);
        document.body.appendChild(star);

        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 100 + 50;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        star.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${x}px, ${y}px)`, opacity: 0 }
        ], {
            duration: 3000,
            easing: 'ease-out'
        });

        setTimeout(() => star.remove(), 3000);
    }
}


document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function () {
        // Remove border from all buttons
        document.querySelectorAll('button').forEach(btn => {
            btn.style.border = '';
        });
        // Add border to clicked button
        button.style.border = '2px solid black';
        showSparkleEffect(button);
        showToast(button.innerText + " clicked", button.style.color, button.style.backgroundColor);
    });
});