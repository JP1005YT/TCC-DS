const queryString = window.location.search
const params = new URLSearchParams(queryString)
let u_infos
let u_infos2

async function flag(Usuario){
    const dados = await fetch('https://restcountries.com/v3.1/all', {
        method: "GET",
        headers: {
            "Accept": "application/json"
          }
    });
    resposta = await dados.json();
    let bandeira    
    resposta.forEach(element => {
        if(element.name.common == Usuario.pais){
            bandeira = element.flags.svg
        }
    });
    document.querySelector("#flag").setAttribute('src',bandeira)
}


function volta(){
    if(params.has("id")){
    window.location.href = `../../pages/social/`;
    }else{
        window.location.href = `../../`;
    }
}
document.querySelector("#configBtn").addEventListener("click",setting_screen)

function setting_screen(){
    document.querySelector('#configuracoes_screen').classList.toggle('ativo') 
}
document.querySelector("#sendDirect").addEventListener("click",async function(){
    const dados = await fetch('../../newchat', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'id1' : u_infos.id,
            'id2' : u_infos2.id
        })
    });
    resposta = await dados.json();
    window.location.href = `../../pages/chat/?id=${resposta.id}`
})
async function Query_Alguem_Logado(json){
    const dados = await fetch('../../check',{
        method: "POST",
        body: JSON.stringify(json),
        headers: {
            teste: "true",
            "token": localStorage.getItem("token")
        }
    });
    resposta = await dados.json();
    console.log(resposta)
    u_infos = resposta
    if(params.has("id") && params.get("id") != u_infos.id){
        ConstruirProfile(params.get("id"))
        document.querySelector("#exitBtn").style.display = 'none'
        document.querySelector("#configBtn").style.display = 'none'
        document.querySelector(".imc-infos").style.display = 'none'
        document.querySelector(".profile_image").setAttribute("onclick","")
        document.querySelector(".profile_image").setAttribute("class","profile_imag")
    }else{
        ConstruirProfile()
    }
}

let element = document.getElementById('file')
element.addEventListener("change", Query_Image);
let nome_arquivo

async function Query_Image(event) {
    const arquivo = event.target.files[0];
    const formData = new FormData();
    formData.append('image', arquivo);
    formData.append('id', u_infos.id);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '../../upimage');
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('Arquivo enviado com sucesso!');
            ConstruirProfile()
            MudarImagem()
        } else {
        console.error('Ocorreu um erro ao enviar o arquivo.');
        }
    };
    xhr.send(formData);
    window.location.href = "../../pages/profile/"
}
function MudarImagem(){
    document.querySelector('#troca_imagem_screen').classList.toggle('ativo') 
}
async function Sair(){
    const dados = await fetch('../../sair',{
        method: "POST",
        headers: {
            "token": localStorage.getItem("token")
        }
    });
    if(dados){
        localStorage.removeItem("token")
    }
    volta()
}
async function ConstruirProfile(another){
    let user_profile= document.querySelector("#screen_username")
    if(another){
        const dados = await fetch('../../puxausuario',{
            method: "POST",
            headers: {
                "id": another,
                "token": localStorage.getItem("token")
            }
        });
        resposta = await dados.json();
        u_infos2 = resposta
        flag(u_infos2)
        user_profile.innerHTML = u_infos2['nome']
        if(u_infos2.profile_photo){
            document.getElementById('img_profile').setAttribute('src', `../../profile_images/${u_infos2.profile_photo}`);
        }else{
            document.getElementById('img_profile').setAttribute('src',`../../resources/assets/defaut.png`)
        }
        document.querySelector("#p_user").innerHTML = u_infos2.user
        document.querySelector("#p_email").innerHTML = u_infos2.email
        let dn = u_infos2.data.split("-")
        document.querySelector("#p_datanasc").innerHTML = `${dn[2]}/${dn[1]}/${dn[0]}`
        document.querySelector("#p_sexo").innerHTML = u_infos2.sexo
        if(u_infos2.peso){
            let IMC = u_infos2.peso / (u_infos2.altura * u_infos2.altura)
            document.querySelector("#imchere").innerHTML = IMC.toFixed(1)
        }
    }else{

        user_profile.innerHTML = u_infos['nome']
        flag(u_infos)
        if(u_infos.profile_photo){
            document.getElementById('img_profile').setAttribute('src', `../../profile_images/${u_infos.profile_photo}`);
        }else{
            document.getElementById('img_profile').setAttribute('src',`../../resources/assets/defaut.png`)
        }
        document.querySelector("#p_user").innerHTML = u_infos.user
        document.querySelector("#p_email").innerHTML = u_infos.email
        let dn = u_infos.data.split("-")
        document.querySelector("#p_datanasc").innerHTML = `${dn[2]}/${dn[1]}/${dn[0]}`
        document.querySelector("#p_sexo").innerHTML = u_infos.sexo
        document.querySelector("#sendDirect").style.display = 'none'
        if(u_infos.peso){
            document.querySelector("#winput").value = u_infos.peso
            document.querySelector("#winput").readOnly = true
        }
        if(u_infos.altura){
            document.querySelector("#hinput").value = u_infos.altura
            document.querySelector("#hinput").readOnly = true
        }
        if(u_infos.peso && u_infos.altura){
            let IMC = u_infos.peso / (u_infos.altura * u_infos.altura)
            document.querySelector("#imchere").innerHTML = IMC.toFixed(1)
            document.querySelector("#btnImc").innerHTML = "Editar"
        }
    }
}
async function enviarArquivo() {
    const arquivo = document.querySelector('input[type="file"]').files[0];
    const formData = new FormData();
    formData.append('arquivo', arquivo);
  
    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
      });
    
}
async function ConcluirPerfil(){
    if(!u_infos.altura){
        const altura = document.querySelector("#hinput").value
        const peso = document.querySelector("#winput").value
        let json = {
            "id" : u_infos.id,
            "altura" : altura,
            "peso" : peso
        }

        const dados = await fetch('../../cadastrar/imc',{
            method: "POST",
            body: JSON.stringify(json),
            headers: {
                "Content-Type": "application/json"
              },
    });
    resposta = await dados.json();
    if(resposta){
        Query_Alguem_Logado()
    }
    }else{
        document.querySelector("#hinput").readOnly = false
        document.querySelector("#hinput").focus()
        document.querySelector("#winput").readOnly = false
        document.querySelector("#btnImc").innerHTML = "Concluir"
    }
    if(document.querySelector("#hinput").value != u_infos.altura || document.querySelector("#winput").value != u_infos.peso){
        let json = {
            "id" : u_infos.id,
            "altura" : document.querySelector("#hinput").value,
            "peso" : document.querySelector("#winput").value
        }
        const dados = await fetch('../../cadastrar/imc',{
            method: "POST",
            body: JSON.stringify(json),
            headers: {
                "Content-Type": "application/json"
              },
        });
        resposta = await dados.json();
        if(resposta){
            Query_Alguem_Logado()
        }
    }
}

Query_Alguem_Logado()
