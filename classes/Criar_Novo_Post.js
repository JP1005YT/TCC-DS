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
        this.RecarregarTags()
    }
    async RecarregarTags(){
        let Bd_tags = P.Buscar("./data/tags.json")
        let Bd_post = P.Buscar("./data/posts.json")
        let Array_Tags = []
        Bd_post.posts.forEach(post => {
            post.hashtags.forEach(tags => {
                Array_Tags.push(tags)
            })
        })
        Bd_tags.tags.forEach(tag => {
            tag.uses = 0
        })
        Bd_tags.tags.forEach(tag => {
            for (let i = 0;i < Array_Tags.length; i++){
                if(Array_Tags[i] === tag.display){
                    tag.uses++
                }
            }
        })
        P.Guardar("./data/tags.json",Bd_tags)
    }
}
module.exports = {
    Novo_Post
}