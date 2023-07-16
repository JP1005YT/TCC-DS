const socket = io();

const queryString = window.location.search
const params = new URLSearchParams(queryString)
const Id_Chat = params.get("id")

let conversa
let u_infos

async function obterdados(){
    const dados = await fetch('../../ChatAll?id=' + Id_Chat,{
        method: "POST",
        headers: {
            teste: "true",
            "token": localStorage.getItem("token")
        }
    });
    conversa = await dados.json();
    carregarMensagems()
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
}
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
    const message = [input.value,formatarData(dataAgora),u_infos.id];
    socket.emit("chat",Id_Chat,message);
    input.value = '';
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
        console.log(hora)
        div.appendChild(span)
        li.appendChild(div)

        if(mensagem.id_user === u_infos.id){
            li.setAttribute("class","me")
        }else{
            li.setAttribute("class","another")
        }
        messagesList.appendChild(li);
});

function carregarMensagems(){
    let dia = new Date()
    let primeiro = true
    conversa.historico.forEach(mensagem => {
        console.log(mensagem)
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
        
        console.log(dia)
        console.log(dataPerData)
        console.log('---')
        
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
    })
}
function back(){
    window.location.href = "../../pages/social/"
}

Query_Alguem_Logado()
obterdados()