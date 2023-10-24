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

document.querySelector("#logohere").addEventListener("click",function(){
    window.location.href = "../../"
})

Carregar_Foto()

let slider = document.querySelectorAll(".slider")
let slideronstage = 0


function troca(dir){
    slider.forEach(slide => {
        slide.classList.value = 'slider'
    })
    
    slider[slideronstage].classList.toggle("on")
    
    if(dir){
        if(slideronstage === 0){
            slideronstage = 2
        }else{
            slideronstage -= 1
        }
    }else{
        if(slideronstage === 2){
            slideronstage = 0
        }else{
            slideronstage += 1
        }
    }
}
setInterval(troca,3000)