async function LoadEx(){
    const dados = await fetch('../../fitness',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
    resposta = await dados.json()
    Constructor(resposta)
}
function Constructor(Data){
    Data.Exercicios.forEach(element => {
        const item = document.createElement('div')
        item.setAttribute("class","card")

        const title = document.createElement('h1')
        title.setAttribute("class","title")
        title.innerHTML = element.name
        const type = document.createElement('span')
        type.setAttribute("class","type")
        type.innerHTML = element.tipo
        const about = document.createElement('p')
        about.setAttribute("class","about")
        about.innerHTML = element.sobre
        
        item.appendChild(title)
        item.appendChild(type)
        item.appendChild(about)
        document.querySelector("#items-here").appendChild(item)
    });
}
LoadEx()

const scrollableDiv = document.querySelector('.scrollable-div');

scrollableDiv.addEventListener('focus', () => {
    scrollableDiv.style.overflow = 'auto'; // Ativa as barras de rolagem
});

scrollableDiv.addEventListener('blur', () => {
    scrollableDiv.style.overflow = 'hidden'; // Desativa as barras de rolagem
});

let u_infos
function Troca_Pagina(e){
    if(u_infos && e == "acess"){
        window.location.href = `../../pages/profile/`
    }else{
        window.location.href = `../../pages/${e}/`
    }
}
async function Query_Alguem_Logado(json){
    const dados = await fetch('../../check',{
        method: "POST",
        body: JSON.stringify(json),
        headers: {
            "token": localStorage.getItem("token")
        }
    });
    resposta = await dados.json();
    console.log(resposta)
    u_infos = resposta
}
async function Carregar_Foto(){
    esperar = await Query_Alguem_Logado()
    if(u_infos.profile_photo){
            document.querySelector('.img_profile').setAttribute('src',`../../profile_images/${u_infos.profile_photo}`)
            document.querySelector('#text-entry').style.display = 'none'
            document.querySelector('#icon_remove').style.display = 'none'
        }else if(u_infos){
            document.querySelector('.img_profile').setAttribute('src',`../../resources/assets/defaut.png`)
            document.querySelector('#icon_remove').style.display = 'none'
            document.querySelector('#text-entry').style.display = 'none'
        }else{
            document.querySelector('.img_profile').style.display = 'none'
        }
}

Carregar_Foto()