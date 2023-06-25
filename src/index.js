// PACOTES
const express = require("express")
const cors = require("cors")
const fs = require("fs")
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const {Login} = require("../classes/Login.js");
// const {Cadastro} = require("./classes/Cadastro.js");


// Inicia o Servidor express
const app = express();

// Presets do app
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use(express.static('public'));
app.use(cors());

// Porta do servidor
const PORT = 3333;

// Função Cadastrars
app.post('/cadastrar', async function (req, res) {
    let id = res.json(await Cadastrar(req.body))
    tokensAndData[id] = {
        valor: id,
    }
});

const loginClass = new Login();
// Função Logar
app.post('/login', async (req, res) => {
    return loginClass.logar(req, res)
})

// Função Checar alguem logado
app.post('/check', async function (req, res) {
    const tokensAndData = JSON.parse(fs.readFileSync('./data/tokens.json'))
    const token = req.headers.token;
    const data = tokensAndData.tokens[token];
    if (typeof data === 'undefined') {
        res.send(false)
        console.log('Ninguem Logado')
    } else {
        let bdusuarios = JSON.parse(fs.readFileSync('./data/users.json'))
        bdusuarios.users.forEach(element => {
            if (element.id == data.valor) {
                res.send(element)
                console.log(`Logado : {${element.id}}`)
            }
        });
    }
})

// Deconecta o usuario
app.post('/sair', async function (req, res) {
    const tokensAndData = JSON.parse(fs.readFileSync('./data/tokens.json'))
    const token = req.headers.token;
    delete tokensAndData.tokens[token]
    GuardarLogados(tokensAndData)
    res.send(true)
})

// Retorna numero de TAGs
app.post('/tags', async function (req, res) {
    const tags = JSON.parse(fs.readFileSync('./data/tags.json'))

    res.send({ "tags": tags.tags })
})

app.post('/newtag', async function (req, res) {
    let bdtags = JSON.parse(fs.readFileSync('./data/tags.json'))
    let newtag = {
        "display": req.body.tag,
        "uses": 0
    }

    bdtags.tags.push(newtag)
    fs.writeFileSync('./data/tags.json', JSON.stringify(bdtags))

    res.send(true)
})
// Abri o server
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Quando for QUERY(variavel na url "?aa=teste") req.query
// Quando for variavel de local id/:id e para ler req.params.id