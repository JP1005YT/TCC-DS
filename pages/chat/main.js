const socket = io();

const queryString = window.location.search
const params = new URLSearchParams(queryString)
const Id_Chat = params.get("id")

let conversa
let u_infos
function emitirSomDeNotificacao() {
    // Obter o elemento de áudio
    const audioElement = document.getElementById('notificationSound');
    
    // Reproduzir o som
    audioElement.play();
  }

async function obterdados(){
    const dados = await fetch('../../ChatAll?id=' + Id_Chat + '&id_user=' + u_infos.id,{
        method: "POST",
        headers: {
            teste: "true",
            "token": localStorage.getItem("token")
        }
    });
    conversa = await dados.json();
    if(conversa){
        carregarMensagems()
    }else{
        window.location.href = `../../`;
    }
}
async function Query_Alguem_Logado(){
    const dados = await fetch('../../check',{
        method: "POST",
        headers: {
            "token": localStorage.getItem("token")
        }
    });
    resposta = await dados.json();
    u_infos = resposta
    obterdados()
}
// Manipuladores de eventos do formulário de envio de mensagens
document.getElementById('message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('input-message');
    if(input.value){
        const message = [input.value,u_infos.id];
        socket.emit("chat",Id_Chat,message);
        input.value = '';
    }
});

// Manipulador de eventos para exibir novas mensagens recebidas
socket.on(Id_Chat, (mensagem) => {
    const messagesList = document.getElementById('messages');
        let li = document.createElement('li')
        let div = document.createElement('div')
        let span = document.createElement('span')
        
        const partes = mensagem.date.split(" ");
        
        const data = partes[0];
        const hora = partes[1];
        
        const dataPartes = data.split("/");
        
        div.textContent = mensagem.msg;
        span.textContent = hora
        div.appendChild(span)
        li.appendChild(div)

        if(mensagem.id_user === u_infos.id){
            li.setAttribute("class","me")
        }else{
            li.setAttribute("class","another")
            emitirSomDeNotificacao()
        }
        messagesList.appendChild(li);
        messagesList.scrollTop = messagesList.scrollHeight;
});

function carregarMensagems(){
    let dia = new Date()
    let primeiro = true
    conversa.historico.forEach(mensagem => {
        const messagesList = document.getElementById('messages');
        let li = document.createElement('li')
        let div = document.createElement('div')
        let span = document.createElement('span')
        
        const partes = mensagem.date.split(" ");
        
        const data = partes[0];
        const hora = partes[1];
        
        const dataPartes = data.split("/");

        const anog = parseInt(dataPartes[2]) + 2000;
        const mesg = parseInt(dataPartes[1]) - 1;
        const diag = parseInt(dataPartes[0]);

        const dataPerData = new Date(anog, mesg, diag);
        const dataAtual = new Date();

        dia.setHours(0, 0, 0, 0);
        dataAtual.setHours(0, 0, 0, 0);
        
        if(dia.getDay() !== dataPerData.getDay()){
            dia = dataPerData
            if (dia < dataAtual) {
                let li = document.createElement('li')
                let div = document.createElement('div')
                div.innerHTML = `${dia.getDate()}/${dia.getMonth() + 1}`

                li.appendChild(div)
                li.setAttribute("class","title")
                messagesList.appendChild(li)
              } else {
                let li = document.createElement('li')
                let div = document.createElement('div')
                div.innerHTML = "Hoje"
                li.appendChild(div)
                li.setAttribute("class","title")
                messagesList.appendChild(li)
              }
        }


        
        div.textContent = mensagem.msg;
        span.textContent = hora
        div.appendChild(span)
        li.appendChild(div)

        if(mensagem.id_user === u_infos.id){
            li.setAttribute("class","me")
        }else{
            li.setAttribute("class","another")
        }
        messagesList.appendChild(li);
        messagesList.scrollTop = messagesList.scrollHeight;
    })
}

function back(){
    window.location.href = "../../pages/social/"
}

Query_Alguem_Logado()