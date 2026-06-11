const chat = document.getElementById("chat");
const input = document.getElementById("message");
const button = document.getElementById("send");

function addMessage(content, type) {
    const div = document.createElement("div");
    div.classList.add("msg", type); 
    div.innerHTML = content;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    // Añadir mensaje del usuario
    addMessage(text, "user");
    input.value = "";

    // Crear el indicador de carga
    const loading = document.createElement("div");
    loading.classList.add("msg", "ai");
    loading.innerHTML = "Echo está escribiendo...";
    chat.appendChild(loading);
    chat.scrollTop = chat.scrollHeight;

    try {
        // CORRECCIÓN 1: Usamos ruta relativa '/api/mensaje' para que se conecte bien en Render
        const res = await fetch("/api/mensaje", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // CORRECCIÓN 2: Enviamos 'mensaje' (en español) que es lo que lee tu server.js
            body: JSON.stringify({ mensaje: text })
        });

        if (!res.ok) throw new Error("Error en la respuesta del servidor");

        const data = await res.json();
        
        // CORRECCIÓN 3: Leemos 'data.respuesta' que es el formato que devuelve tu servidor
        loading.innerHTML = data.respuesta;

    } catch (err) {
        console.error(err);
        loading.classList.remove("ai");
        loading.classList.add("error"); 
        loading.innerHTML = "⚠️ Error conectando con Echo";
    }
    
    chat.scrollTop = chat.scrollHeight;
}

button.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});