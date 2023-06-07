// PACOTES
const express = require("express")
const cors = require("cors")
const fs = require("fs")
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const uid = require("uuid")
const session = require("express-session")


// Inicia o Servidor express
const app = express();

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}


// Presets do app
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });
app.use(express.static('public'));
app.use(cors());

// Porta do servidor
const PORT = 3333;

// Função Cadastrars
app.post('/cadastrar',async function (req, res){
    let id = res.json(await Cadastrar(req.body))
    tokensAndData[id] = {
        valor: id,
    }
});

// Função Logar
app.post('/login', async function(req, res) {
    const tokensAndData = JSON.parse(fs.readFileSync('./data/tokens.json'))
    let bdusuarios = JSON.parse(fs.readFileSync('./data/users.json'))
    let dadoslogin = req.body
    let encontrado = false
    let user

    for (let i = 0; i < bdusuarios.users.length; i++) {
        user = bdusuarios.users[i]

        if (user.email === dadoslogin.email) {
            const senhasBatem = await CompararSenhas(dadoslogin.senha, user.senha)

            if (senhasBatem) {
                encontrado = true
                break
            }
        }
    }

    if (encontrado) {
        const id = makeid(10) 
        tokensAndData.tokens[id] = {
            valor: user.id
        }
        // req.session.valor = user.id
        
        res.send({"res" : true, "token": id})
        
        GuardarLogados(tokensAndData)
    } else {
        res.send({"res" : false})
    }
})

// Função Checar alguem logado
app.post('/check',async function(req,res){
    const tokensAndData = JSON.parse(fs.readFileSync('./data/tokens.json'))
    const token = req.headers.token;
    console.log(tokensAndData.tokens);
    const data = tokensAndData.tokens[token]
    if(!data?.valor){
        res.send(false)
    }else{
        let bdusuarios = JSON.parse(fs.readFileSync('./data/users.json'))
        bdusuarios.users.forEach(element => {
            if(element.id == data.valor){
                res.send(element)
            }
        });
    }
})
// Deconecta o usuario
app.post('/sair',async function(req, res) {
    try {
        req.session.destroy()
        res.send(true)
    } catch (error) {
        res.send(error)
    }
})
// Abri o server
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Funções Gerais
async function gerarHash(senha) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(senha, saltRounds);
    return hash;
}

async function CompararSenhas(senha, senhaCript) {
    let valor = await bcrypt.compare(senha, senhaCript)
    return valor
}

async function Cadastrar(NewUser) {
    let bdusuarios = JSON.parse(fs.readFileSync('./data/users.json'))
    NewUser.id = uid.v4()
    NewUser.senha = await gerarHash(NewUser.senha);

    bdusuarios.users.push(NewUser)

    fs.writeFileSync('./data/users.json',JSON.stringify(bdusuarios))

    return NewUser.id
}

async function GuardarLogados(token){
    fs.writeFileSync('./data/tokens.json',JSON.stringify(token))
}

// Quando for QUERY(variavel na url "?aa=teste") req.query
// Quando for variavel de local id/:id e para ler req.params.id