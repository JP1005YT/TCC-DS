//Guarda Imagem
let u_infos
function volta(){
    window.location.href = `../../`;
}
async function Query_Alguem_Logado(json){
    const dados = await fetch('http://localhost:3333/check',{
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
    xhr.open('POST', 'http://localhost:3333/upimage');
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
}
function MudarImagem(){
    document.querySelector('#troca_imagem_screen').classList.toggle('ativo') 
}
async function Sair(){
    const dados = await fetch('http://localhost:3333/sair',{
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
async function ConstruirProfile(){
    esperar = await Query_Alguem_Logado()
    let user_profile= document.querySelector("#screen_username")
    user_profile.innerHTML = u_infos['nome']
    if(u_infos.profile_photo){
        document.getElementById('img_profile').setAttribute('src', `http://localhost:3333/profile_images/${u_infos.profile_photo}`);
    }else{
        document.getElementById('img_profile').setAttribute('src',`../../resources/profile_photos/default.png`)
    }
    document.querySelector("#p_user").innerHTML = u_infos.user
    document.querySelector("#p_email").innerHTML = u_infos.email
    let dn = u_infos.data.split("-")
    document.querySelector("#p_datanasc").innerHTML = `${dn[2]}/${dn[1]}/${dn[0]}`
    document.querySelector("#p_sexo").innerHTML = u_infos.sexo
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

ConstruirProfile()