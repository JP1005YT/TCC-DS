const express = require("express")
const cors = require("cors")
const fs = require("fs")
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const uid = require("uuid")
const path = require("path")
const session = require("express-session")

const app = express();

app.use(session({
    secret: "teste",
    saveUninitialized: false,
    resave:false
}))

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(cors());

const PORT = 3333;


app.post('/cadastrar',async function (req, res){
    let id = res.json(await Cadastrar(req.body))
    req.session.valor = id
});

app.post('/login', async function(req, res) {
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
    console.log(user.id)
    req.session.valor = user.id
    res.send(user)
} else {
    res.send("Usuário não encontrado ou senha incorreta.")
}
})

app.post('/alguemlogado',async function(req,res){
    const meuValor = req.session.valor || "Valor não definido."
    res.send(req.session.valor)
    if(!req.session.valor){
        console.log("Ninguem Logado")
    }
    console.log(req.session.valor)
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

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
// Quando for QUERY(variavel na url "?aa=teste") req.query
// Quando for variavel de local id/:id e para ler req.params.id