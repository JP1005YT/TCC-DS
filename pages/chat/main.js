const socket = io();

const queryString = window.location.search
const params = new URLSearchParams(queryString)
const Id_Chat = params.get("id")

function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = String(data.getFullYear()).slice(-2);
    const hora = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${ano} ${hora}:${minutos}`;
}
// Manipuladores de eventos do formulário de envio de mensagens
document.getElementById('message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('input-message');
    const dataAgora = new Date()
    const message = [input.value,formatarData(dataAgora)];
    socket.emit("chat",Id_Chat,message);
    input.value = '';
});

// Manipulador de eventos para exibir novas mensagens recebidas
socket.on(Id_Chat, (message) => {
    const messagesList = document.getElementById('messages');
    const li = document.createElement('li');
    li.textContent = message;
    messagesList.appendChild(li);
});