const {Pacotes} = require("../configs/Packages.js");
let P = new Pacotes()

class Chats{
    CriarChat(Dados){
        let ChatsBD = P.Buscar("./data/chats.json")
        let chat = {
            "id" : P.uid.v4(),
            "users" : [
                Dados.id1,
                Dados.id2
            ],
            "historico" : []
        }
        ChatsBD.chats.push(chat)
        P.fs.mkdir(`./public/chats/${chat.id}`,(err) => {
        })
        this.GuardarIdnosUsuarios(chat)
        P.Guardar("./data/chats.json",ChatsBD)
        return chat.id
    }
    GuardarIdnosUsuarios(Chat){
        let Usuarios = P.Buscar("./data/users.json")
        Usuarios.users.forEach(usuario => {
            if(usuario.id === Chat.users[0] || usuario.id === Chat.users[1]){
                if (!usuario.hasOwnProperty('chats')) {
                    usuario.chats = [];
                  }
                usuario.chats.push(Chat.id)
            }
        });
        P.Guardar("./data/users.json",Usuarios)
        return Chat.id
    }
    BuscaChatsInfos(Req){
        let ChatsBD = P.Buscar("./data/chats.json")
        let user
        ChatsBD.chats.forEach(chat => {
            if(chat.id === Req.body.idchat){
                chat.users.forEach(usuario => {
                    if(usuario != Req.body.iduser){
                        let bdusuarios = JSON.parse(P.fs.readFileSync('./data/users.json'))
                        bdusuarios.users.forEach(element => {
                        if (element.id == usuario) {
                            user = element.nome
                        }})
                    }
                })
            }
        })
        return user
    }
    async RegistrarMensagens(chatId,Mensagem){
        let ChatsBD = P.Buscar("./data/chats.json")
        ChatsBD.chats.forEach(chat => {
            if(chat.id === chatId){
                chat.historico.push(Mensagem)
            }
        })
        P.Guardar("./data/chats.json",ChatsBD)
    }
}

module.exports = { 
    Chats
}