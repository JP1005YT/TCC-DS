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
        window.location.href = `pages/profile/`
    }else{
        window.location.href = `pages/${e}/`
    }
}
// Funções de Back-End
// Ex: Processamento de dados e encaminhamento para o banco

async function Query_Alguem_Logado(json){
    const dados = await fetch('http://localhost:3333/check',{
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
    // if(u_infos){
    //     nome_arquivo =  u_infos.id
    //     const dados = await fetch('server/extencao.php',{
    //         method: "POST",
    //     });
    //     resposta = await dados.json()
    //     if(resposta){
    //         document.querySelector('.img_profile').setAttribute('src',`resources/profile_photos/${u_infos.id}.${resposta}?cache=${Math.random() * 10}`)
    //         document.querySelector('#icon_remove').style.display = 'none'
    //     }else{
    //         document.querySelector('.img_profile').style.display = 'none'
    //     }
    // }else{
        document.querySelector('.img_profile').style.display = 'none'
    // }
}

Carregar_Foto() 