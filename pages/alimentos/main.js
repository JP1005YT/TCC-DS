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

// let container = document.querySelectorAll('#container');
// let imagemAtual = 0;
// let intervalo = 2000;

// function hideSlider(){
//     container.forEach(item => item.idList.remove('on'));
// }

// function showSlider(){
//     container[imagemAtual].idList.add('on');
// }

// function trocaimg(){
//     hideSlider();
//     if(imagemAtual == container.length -1){
//         imagemAtual = 0;
//     }
//     else{
//         imagemAtual++;
//     }
//     showSlider();
// }


// setInterval(trocaimg(), intervalo, trocaimg());

// // var images = document.querySelectorl('#carrosel .on');
// // var currentImageIndex = 0;
// // var interval = 3000;

// // function changeImage() {
// //   images[currentImageIndex].style.opacity = 0;
// //   currentImageIndex = (currentImageIndex + 1) % images.length;
// //   images[currentImageIndex].style.opacity = 1;
// // }

// // setInterval(changeImage, interval);