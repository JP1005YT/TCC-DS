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
    }
}

module.exports = { 
    Chats
}