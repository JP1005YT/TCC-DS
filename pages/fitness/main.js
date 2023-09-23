document.querySelector("#logohere").addEventListener("click",function(){
    window.location.href = "../../"
})
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
    let i = 0
    Data.Exercicios.forEach((element,index) => {
        const item = document.createElement('div')
        item.setAttribute("class","card")
        item.setAttribute("id",`card_${index}`)
        const title = document.createElement('h1')
        title.setAttribute("class","title")
        title.innerHTML = element.name
        const type = document.createElement('span')
        type.setAttribute("class","type")
        type.innerHTML = element.tipo
        const about = document.createElement('p')
        about.setAttribute("class","about")
        about.innerHTML = element.sobre
        if(i < 3){
            item.classList.add('flex')
            i++
        }else{
            item.classList.add('inv')
            i++
        }
        item.appendChild(title)
        item.appendChild(type)
        item.appendChild(about)
        document.querySelector("#items-here").appendChild(item)
    });
}
LoadEx()

let u_infos
function Troca_Pagina(e){
    if(u_infos && e == "acess"){
        window.location.href = `../../pages/profile/`
    }else if(e == "acess"){
        window.location.href = `../../pages/${e}/?pag=fitness`
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
document.querySelector("#Tr_esq").addEventListener("click",function(){
    ChangeCarrousel(0)
})
document.querySelector("#Tr_dir").addEventListener("click",function(){
    ChangeCarrousel(1)
})

const deixar = [
    [0,1,2],
    [3,4,6],
    [6,7,8]
]
let atual = 1

function ChangeCarrousel(lado){
    let cards = document.querySelectorAll(".card");
    cards = Array.from(cards); // Convertendo NodeList para Array
    cards.forEach(card => {
        card.classList.remove("flex")
        card.classList.add("inv");
    });

    switch (lado) {
        case 0:
            if(atual === 0){
                atual = 2
            }else{
                atual--
            }
        break;
        case 1:
            if(atual === 2){
                atual = 0
            }else{
                atual++
            }
        break;
    }

    

    deixar[atual].forEach(id => {
        document.querySelector("#card_" + id).classList.remove("inv")
        document.querySelector("#card_" + id).classList.add("flex")
    });
}

Carregar_Foto()