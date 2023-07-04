//Funções da API de CEP
function limpa_formulário_cep(){
    //Limpa valores do formulário de cep.
    document.getElementById('rua').value=("");
    document.getElementById('bairro').value=("");
    document.getElementById('cidade').value=("");
    document.getElementById('uf').value=("");
}

function meu_callback(conteudo) {
if (!("erro" in conteudo)) {
    //Atualiza os campos com os valores.
    document.getElementById('rua').value=(conteudo.logradouro);
    document.getElementById('bairro').value=(conteudo.bairro);
    document.getElementById('cidade').value=(conteudo.localidade);
    document.getElementById('uf').value=(conteudo.uf);
} //end if.
else {
    //CEP não Encontrado.
    limpa_formulário_cep();
    alert("CEP não encontrado.");
}
}

function pesquisacep(valor) {

//Nova variável "cep" somente com dígitos.
var cep = valor.replace(/\D/g, '');

//Verifica se campo cep possui valor informado.
if (cep != "") {

    //Expressão regular para validar o CEP.
    var validacep = /^[0-9]{8}$/;

    //Valida o formato do CEP.
    if(validacep.test(cep)) {

        //Preenche os campos com "..." enquanto consulta webservice.
        document.getElementById('rua').value="...";
        document.getElementById('bairro').value="...";
        document.getElementById('cidade').value="...";
        document.getElementById('uf').value="...";

        //Cria um elemento javascript.
        var script = document.createElement('script');

        //Sincroniza com o callback.
        script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';

        //Insere script no documento e carrega o conteúdo.
        document.body.appendChild(script);

    } //end if.
    else {
        //cep é inválido.
        limpa_formulário_cep();
        alert("Formato de CEP inválido.");
    }
} //end if.
else {
    //cep sem valor, limpa formulário.
    limpa_formulário_cep();
}
};

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
    let endereco_s = document.getElementById('cep').value
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
            "endereco" : endereco_s
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
    const dados = await fetch('http://localhost:3333/login', {
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