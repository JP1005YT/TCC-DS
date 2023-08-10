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