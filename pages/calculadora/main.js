let u_infos
function Troca_Pagina(e){
    if(u_infos && e == "acess"){
        window.location.href = `../../pages/profile/`
    }else if(e == "acess"){
        window.location.href = `../../pages/${e}/?pag=calculadora`
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

document.querySelector("#btnCalc").addEventListener("click",function(){
    document.querySelector(".infos1").classList.remove("inative")
})

// Função para atualizar a exibição da posição do scroll
let posAnterior = 0
function updateScrollPosition() {
    const scrollPosition = window.scrollY
    
    while(posAnterior <= scrollPosition){
        let obj = document.querySelector(".h-"+posAnterior)
        if(obj){
            console.log(obj)
            obj.classList.remove("inative")
        }
        posAnterior++
    }

    posAnterior = scrollPosition
}
  
  // Atualiza a posição do scroll quando o usuário faz o scroll
  window.addEventListener('scroll', updateScrollPosition);
  