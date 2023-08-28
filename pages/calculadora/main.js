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
    document.querySelector(".infos").classList.remove("inative")
    document.querySelector(".infos").style.display = 'flex'
    document.querySelector("body").classList.remove("off")
    desativado = false
    CarregaContas()
})
const valoresporGrama = {
    "Maca" : 0.53,
    "Granola" : 3.70,
    "Pizza" : 4.50
}
const exerciosporHora = {
    "corrida" : 1176,
    "pular" : 735,
    "polichinelo" : 588
}
const obj = {
    "displaysDaCalc" : document.querySelectorAll("#num_calc"),
    "displayMaca" : document.querySelector("#val_maca"),
    "displayGranola" : document.querySelector("#val_granola"),
    "displayPizza" : document.querySelector("#val_pizza"),
    "displayCorrida" : document.querySelector("#val_corr"),
    "displayPular" : document.querySelector("#val_pula"),
    "displayPoli" : document.querySelector("#val_poli"),
    
}
function CarregaContas(){
    let valorDoDisplay = document.querySelector("#numRo").value
    obj.displaysDaCalc.forEach(ele => {
        ele.innerHTML = valorDoDisplay
    })

    obj.displayMaca.innerHTML = Math.floor(valorDoDisplay / valoresporGrama.Maca)
    obj.displayGranola.innerHTML = Math.floor(valorDoDisplay / valoresporGrama.Granola)
    obj.displayPizza.innerHTML = Math.floor(valorDoDisplay / valoresporGrama.Pizza)
    obj.displayCorrida.innerHTML = Math.floor((valorDoDisplay * 60) / exerciosporHora.corrida)
    obj.displayPular.innerHTML = Math.floor((valorDoDisplay * 60) / exerciosporHora.pular)
    obj.displayPoli.innerHTML = Math.floor((valorDoDisplay * 60) / exerciosporHora.polichinelo)
}

// Função para atualizar a exibição da posição do scroll
let posAnterior = 0
let desativado = true
function updateScrollPosition() {
    if(desativado){
        window.scroll(0,0)
    }else{
        const scrollPosition = window.scrollY
    
        while(posAnterior <= scrollPosition){
            let obj = document.querySelector(".h-"+posAnterior)
            if(obj){
                console.log(obj)
                obj.classList.remove("inative")
                obj.style.display = 'flex'
            }
            posAnterior++
        }
    
        posAnterior = scrollPosition
    }
}
  
  // Atualiza a posição do scroll quando o usuário faz o scroll
  window.addEventListener('scroll', updateScrollPosition);
  