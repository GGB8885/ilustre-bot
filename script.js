const chat = document.getElementById("chat");
const input = document.getElementById("message");
const button = document.getElementById("send");

function addMessage(content, type) {
    const div = document.createElement("div");
    div.classList.add("msg", type); // Puedes pasar múltiples clases en una sola línea
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
        // 🌟 CAMBIO AQUÍ: Ahora apunta a tu servidor público en Render en lugar de tu PC local
        const res = await fetch("https://echo-bot-wqppb.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });

        if (!res.ok) throw new Error("Error en la respuesta del servidor");

        const data = await res.json();
        loading.innerHTML = data.reply;

    } catch (err) {
        console.error(err);
        // Quitamos la apariencia de Echo y le damos una de error del sistema
        loading.classList.remove("ai");
        loading.classList.add("error"); // Asegúrate de darle estilo a .error en tu CSS
        loading.innerHTML = "⚠️ Error conectando con Echo";
    }
    
    // Un único scroll final por si la respuesta de la IA es muy larga
    chat.scrollTop = chat.scrollHeight;
}

button.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});