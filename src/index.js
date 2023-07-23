// PACOTES
const {Pacotes} = require("../configs/Packages.js");
let P = new Pacotes()

const {Login} = require("../classes/Login.js");
const {Check} = require("../classes/Check.js");
const {Cadastrar} = require("../classes/Cadastrar.js");
const {Profile_Photo_Manager} = require("../classes/Profile_ImG.js")
const {Server} = require("../configs/Server.js");
const {Novo_Post} = require("../classes/Criar_Novo_Post.js")
const {Chats} = require("../classes/Chats.js")
const ChatManager = new Chats()
const UploadImagePosts = require("../classes/UploadImagePost.js")
const UploadImage = require("../classes/UploadImagePerfil.js");
 
let S = new Server()
S.start()
const app = S.app
const io = S.io

// paginas e soquete

io.on('connection', (socket) => {
    console.log('Novo usuário conectado');

    socket.on('chat',(chatId, message) => {
        let MensagemFormatada = {
            "msg" : message[0],
            "date" : message[1],
            "id_user" : message[2]
        }
        ChatManager.RegistrarMensagens(chatId,MensagemFormatada)
        console.log(`Mensagem recebida no chat "${chatId}":`, message);
        io.emit(chatId,MensagemFormatada)
    });


});

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


// Funções primarias Cadastro , Login ,Puxar infos

const signClass = new Cadastrar();
app.post('/cadastrar', async function (req, res) {
    let id = res.json(await signClass.Cadastrar(req.body))
});

app.post('/cadastrar/imc',async function (req,res){
    signClass.CadastrarIMC(req.body)
    res.send(true)
})

const loginClass = new Login();
app.post('/login', async (req, res) => {
    return loginClass.logar(req, res)
})

const checkClass = new Check();
app.post('/check', async function (req, res) {
    res.send(checkClass.Checar(req))
})

app.post('/puxausuario' , async function (req,res){
    res.send(checkClass.RetornaPessoas(req))
})

app.post('/sair', async function (req, res) {
    const tokensAndData = JSON.parse(P.fs.readFileSync('./data/tokens.json'))
    const token = req.headers.token;
    delete tokensAndData.tokens[token]
    loginClass.GuardarLogados(tokensAndData)
    res.send(true)
})


// Parte Social

app.post('/tags', async function (req, res) {
    const tags = JSON.parse(P.fs.readFileSync('./data/tags.json'))

    res.send({ "tags": tags.tags })
})

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
    NovoPOST.Processar(JSON.parse(req.body.post),req.body.user_id,req.params.postId,req.body.user_name)
    res.send("OK")
})

app.post('/buscarpost', async (req,res) => {
    res.send(P.Buscar("./data/posts.json"))
})

app.post('/checkpost',async (req,res) => {
    let resp = checkClass.ChecarPastaPost(req.body.post)
    res.send(resp)
})
    
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

app.post('/newchat',async (req,res) => {
    res.send(ChatManager.CriarChat(req.body))
})

app.post('/ChatsInfos',async (req,res) => {
    let nome = ChatManager.BuscaChatsInfos(req)
    res.send({"nome":nome})
})

app.post('/ChatAll',async (req,res) => {
    let infos = await P.Buscar("./data/chats.json")
    let chatExiste = false
    infos.chats.forEach(item => {
        if(item.id === req.query.id){
            chatExiste = item
        }
        if(item.users.indexOf(req.query.id_user) === -1){
            chatExiste = false
        }
    })
    res.send(chatExiste)
})

app.post('/deletechat',async (req,res) => {
    let resp = await ChatManager.DeletarChat(req.body)
    res.send(resp)
})
// Quando for QUERY(variavel na url "?aa=teste") req.query
// Quando for variavel de local id/:id e para ler req.params.id