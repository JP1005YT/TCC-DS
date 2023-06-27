// PACOTES
const {Pacotes} = require("../configs/Packages.js");
let P = new Pacotes()

const {Login} = require("../classes/Login.js");
const {Check} = require("../classes/Check.js");
const {Cadastrar} = require("../classes/Cadastrar.js");
const UpLoadUIMG = require("../classes/UploadImage")

const {Server} = require("../configs/Server.js");
const UploadImage = require("../classes/UploadImage");
let S = new Server()
S.start()
const app = S.app
    
// Função Cadastrar
const signClass = new Cadastrar();
app.post('/cadastrar', async function (req, res) {
    let id = res.json(await signClass.Cadastrar(req.body))
});

// Função Logar
const loginClass = new Login();
app.post('/login', async (req, res) => {
    return loginClass.logar(req, res)
})

// Função Checar alguem logado
const checkClass = new Check();
app.post('/check', async function (req, res) {
    res.send(checkClass.Checar(req))
})

// Deconecta o usuario
app.post('/sair', async function (req, res) {
    const tokensAndData = JSON.parse(P.fs.readFileSync('./data/tokens.json'))
    const token = req.headers.token;
    delete tokensAndData.tokens[token]
    loginClass.GuardarLogados(tokensAndData)
    res.send(true)
})

// Retorna numero de TAGs
app.post('/tags', async function (req, res) {
    const tags = JSON.parse(P.fs.readFileSync('./data/tags.json'))

    res.send({ "tags": tags.tags })
})

// Cria Novas TAGs
app.post('/newtag', async function (req, res) {
    let bdtags = JSON.parse(P.fs.readFileSync('./data/tags.json'))
    let newtag = {
        "display": req.body.tag,
        "uses": 0
    }

    bdtags.tags.push(newtag)
    P.fs.writeFileSync('./data/tags.json', JSON.stringify(bdtags))

    res.send(true)
})

app.post('/upimage', UploadImage.single('image'), async (req, res) => {
    if (req.file) {
      console.log(req.body.id);
      return res.json({
        erro: false,
        mensagem: "Upload realizado com sucesso",
      });
    }
  });
  
// Quando for QUERY(variavel na url "?aa=teste") req.query
// Quando for variavel de local id/:id e para ler req.params.id