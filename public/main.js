// Variaveis Globais
let u_infos

// Funções de Front-End
// ex:Troca de cores e paginas e objetos
function l(e){
    console.log(e)
}
function troca_menu(){
    let menu = document.querySelector('#menu')
    let leftside = document.querySelector('.leftside')
    menu.classList.toggle('ativo')
    leftside.classList.toggle('ativo')
}
function Troca_Pagina(e){
    if(u_infos && e == "acess"){
        window.location.href = `./pages/profile/`
    }else{
        window.location.href = `./pages/${e}/`
    }
}

// Funções de Back-End
// Ex: Processamento de dados e encaminhamento para o banco

async function Query_Alguem_Logado(json){
    const dados = await fetch('./check',{
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

const slider = document.querySelectorAll('.slider')
const btnPrev = document.getElementById("prev-button")
const btnNext = document.getElementById("next-button")

let currentSlide = 0

function hideSlider(){
    slider.forEach(item => item.classList.remove('on'))
}

function showSlider(){
    slider[currentSlide].classList.add('on')
}

function nextSlider(){
    hideSlider()
    if(currentSlide == slider.length -1){
        currentSlide = 0
    }
    else{
        currentSlide++
    }
    showSlider()
}

function prevSlider(){
    hideSlider()
    if(currentSlide == 0){
        currentSlide = slider.length -1
    }
    else{
        currentSlide--
    }
    showSlider()
}


setInterval(() => {
    nextSlider()
}, 5000);

btnNext.addEventListener('click', nextSlider)
btnPrev.addEventListener('click', prevSlider)

function receita(e){
    const quadros = document.querySelectorAll(".recipe")
    console.log(quadros)
    quadros[e].classList.toggle("on")
    document.querySelector("body").style.overflow = "hidden"
}
function close(){
    let quadros = document.querySelectorAll(".recipe")
    quadros.forEach(quadro => {
        quadro.classList.value = "recipe"
    })
    document.querySelector("body").style.overflow = "scroll"
    document.querySelector("body").style.overflowX = "hidden"
}

document.querySelector(".btnactive1").addEventListener("click",function(){close()})
document.querySelector(".btnactive2").addEventListener("click",function(){close()})
document.querySelector(".btnactive3").addEventListener("click",function(){close()})