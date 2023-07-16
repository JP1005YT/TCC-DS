function Checa_Senha(key){
    let senha_s = document.getElementById('senha_s')
    let senhac_s = document.getElementById('senhac_s')
    switch (key) {
        case 0:
            if(senha_s.value.length < 8){
                senha_s.value = ""
                senha_s.focus()
                alert('Atenção sua senha deve conter mais que 8 caracteres')
            }
        break;
        case 1:
            if(senha_s.value != senhac_s.value){
                senhac_s.focus()
                senhac_s.value = ""
                alert('Senha Não Batem')
            }
        break;
    }
    
}
function Processar_Cadastro(){
    let nome_s = document.getElementById('nome_s').value
    let user_s = document.getElementById('user_s').value
    let email_s = document.getElementById('email_s').value
    let senha_s = document.getElementById('senha_s').value
    let senhac_s = document.getElementById('senhac_s').value
    let date_s = document.getElementById('date_s').value
    let sexo_s = document.querySelectorAll('input[type="radio"][name="opc"]')
    let endereco_s = document.getElementById('paisinput').value
    let sexo_val = ""
    sexo_s.forEach(radio => {
        if (radio.checked) {
            sexo_val = radio.value;
        }
    });
    if(nome_s && user_s && email_s && senha_s && senhac_s && date_s && sexo_val && endereco_s) {
        let JSON = {
            "nome" : nome_s,
            "user" : user_s,
            "email" : email_s,
            "senha" : senha_s,
            "data" : date_s,
            "sexo" : sexo_val,
            "pais" : endereco_s
        }
        Query_Cadastrar(JSON);

        document.querySelectorAll("input").forEach(element => {
            element.value = ""
        })

        // volta()
      } else {  
        alert('Preencha TODOS os campos')
      }
      
}
function Processar_Login(){
    let email_l = document.getElementById('email_l').value
    let senha_l = document.getElementById('senha_l').value
    if(email_l && senha_l){
        let JSON = {
            "email" : email_l,
            "senha" : senha_l
        }
        Query_Logar(JSON)
    }
    document.getElementById('email_l').value = ""
    document.getElementById('senha_l').value = ""
}
async function Query_Cadastrar(json){
    const dados = await fetch('http://localhost:3333/cadastrar', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
    });
    resposta = await dados.json();
    // if(resposta.nome){
    //     u_name = resposta.nome
    // }
}
async function Query_Logar(json){
    const dados = await fetch('../../login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Define o cabeçalho para JSON
        },
        body: JSON.stringify(json)
    });
    resposta = await dados.json();
    if(resposta.res === false){
        alert('Senha ou Email Incorretos')
    }else{
        localStorage.setItem("token", resposta.token)
        // window.token = dados.token;
        volta()
    }
}
function troca_cor_log(){
    let kapa = document.getElementById('display').querySelectorAll('h2')
    let sign_s = document.getElementById('sign')
    let login_s = document.getElementById('login')
    sign_s.classList.toggle('ativo')
    login_s.classList.toggle('ativo')
    kapa[0].classList.toggle('ativo')
    kapa[1].classList.toggle('ativo')
}
function volta(){
    window.location.href = `../../`;
}
colo()
async function colo(){
    const dados = await fetch('https://restcountries.com/v3.1/all', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    resposta = await dados.json();
  resposta.forEach(element => {
        let option = document.createElement("option")
        option.setAttribute("value",element.name.common)
        document.querySelector("#opcoes").appendChild(option)
    });
}