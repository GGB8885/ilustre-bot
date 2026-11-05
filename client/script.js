const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const mensajeTexto = userInput.value.trim();
    if (!mensajeTexto) return;

    // Mostrar mensaje del usuario
    appendMessage(mensajeTexto, 'user-message');
    userInput.value = '';

    // Crear mensaje temporal de espera
    const loadingMessage = appendMessage('Consultando a los filósofos...', 'bot-message');

    try {
        const response = await fetch('/api/mensaje', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mensaje: mensajeTexto })
        });

        const data = await response.json();
        
        // Reemplazar texto del mensaje de carga con la respuesta real
        loadingMessage.innerHTML = data.respuesta.replace(/\n/g, '<br>');

    } catch (error) {
        console.error('Error:', error);
        loadingMessage.textContent = '⚠️ Ha ocurrido un error al conectar con Ilustre-Bot.';
    }

    // Scroll automático hacia abajo
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

function appendMessage(text, className) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageElement;
}