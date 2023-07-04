// PACOTES
const {Pacotes} = require("../configs/Packages.js");
let P = new Pacotes()

const {Login} = require("../classes/Login.js");
const {Check} = require("../classes/Check.js");
const {Cadastrar} = require("../classes/Cadastrar.js");
const {Profile_Photo_Manager} = require("../classes/Profile_ImG.js")
const {Server} = require("../configs/Server.js");
const {Novo_Post} = require("../classes/Criar_Novo_Post.js")
const UploadImagePosts = require("../classes/UploadImagePost.js")
const UploadImage = require("../classes/UploadImagePerfil.js");

let S = new Server()
S.start()
const app = S.app


app.get("/pages/:page", (req, res) => {
    const page = req.params.page;
    const filePath = P.path.join(__dirname,"..", "Pages", page, "index.html");
      
    res.sendFile(filePath);
});

app.get('/pages/:page/*.js', (req, res) => {
    const jsFilePath = P.path.join(__dirname, '..', 'Pages', req.params.page, `${req.params[0]}.js`);
        
    res.sendFile(jsFilePath);
});

app.get('/pages/:page/*.css', (req, res) => {
    const cssFilePath = P.path.join(__dirname, '..', 'Pages', req.params.page, `${req.params[0]}.css`);
    
    res.sendFile(cssFilePath);
});
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

const NovoPOST = new Novo_Post();
app.post('/newpost/:postId', UploadImagePosts.array('images',5),async (req,res) => {
    NovoPOST.Processar(JSON.parse(req.body.post),req.body.user_id,req.params.postId)
    res.send("OK")
})

app.post('/buscarpost', async (req,res) => {
    res.send(P.Buscar("./data/posts.json"))
})

app.post('/checkpost',async (req,res) => {
    let resp = checkClass.ChecarPastaPost(req.body.post)
    res.send(resp)
})
//Upa a imagem de Perfil
const PMClass = new Profile_Photo_Manager();
app.post('/upimage', UploadImage.single('image'), async (req, res) => {
    if (req.file) {
      PMClass.Guardar(req.file.filename,req.body.id)
      return res.json({
        erro: false,
        mensagem: "Upload realizado com sucesso",
      });
    }
  });
  
// Quando for QUERY(variavel na url "?aa=teste") req.query
// Quando for variavel de local id/:id e para ler req.params.id