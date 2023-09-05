const {Pacotes} = require("../configs/Packages.js");
let P = new Pacotes()

class SearchPosts{
    Buscar(json){
        let conteudo = json.content.substring(1)
        let resposta = {"posts" : []}
        let array = []
        switch (json.type) {
            case "*":
                resposta = P.Buscar("./data/posts.json")
                break;
            case "tag":
                let infos = P.Buscar("./data/posts.json")
                let arrays = {"posts" : []}
                infos.posts.forEach((post,i) => {
                    const resultado = post.hashtags.filter(item => item.toLowerCase().includes(conteudo.toLowerCase()));
                    if(resultado.length >= 1){
                        arrays.posts[i] = post
                    }
                });
                resposta = arrays
                break;
            case "user":
                let infos2 = P.Buscar("./data/posts.json")
                let arrays2 = {"posts" : []}
                infos2.posts.forEach((post,i) => {
                    if(post.User_Name.toLowerCase().includes(conteudo.toLowerCase())){
                        arrays2.posts[i] = post
                    }
                })
                resposta = arrays2
                break;
            case "title":
                let infos3 = P.Buscar("./data/posts.json")
                let arrays3 = {"posts" : []}
                infos3.posts.forEach((post,i) => {
                    if(post.title.toLowerCase().includes(conteudo.toLowerCase())){
                        arrays3.posts[i] = post
                    }
                })
                resposta = arrays3
                break;
        }
        return resposta
    }
}
module.exports = {
    SearchPosts
}