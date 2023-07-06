const {Pacotes} = require("../configs/Packages.js");
let P = new Pacotes()

class Novo_Post{
    Processar(Conteudo,User_ID,Post_ID,User_Name){
        Conteudo.User_ID = User_ID
        Conteudo.Post_ID = Post_ID
        Conteudo.User_Name = User_Name
        let BD = P.Buscar("./data/posts.json")
        BD.posts.push(Conteudo)
        P.Guardar("./data/posts.json",BD)
    }
}
module.exports = {
    Novo_Post
}