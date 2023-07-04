let variavelDebug = false
let hashtagstonewpost = []
let comparetag
let u_infos

function volta(){
    window.location.href = `../../`;
}

async function Query_Alguem_Logado(json){
    const dados = await fetch('http://localhost:3333/check',{
        method: "POST",
        body: JSON.stringify(json),
        headers: {
            "token": localStorage.getItem("token")
        }
    });
    resposta = await dados.json();
    u_infos = resposta
}

function ToNovoPost(){
    document.querySelector("#post-page").classList.toggle("ativo")
}

function ToNovaTag(){
    document.querySelector("#tag-page").classList.toggle("ativo")
}

let Hashtags
async function LoadTags() {
    const dados = await fetch('http://localhost:3333/tags', {
        method: "POST"
    });
    const resposta = await dados.json();
    let i = 0
    resposta.tags.forEach(element => {
        i++
    });
    document.querySelector("#tagsinUsed").innerHTML = `HashTags:${i}`
    Hashtags = resposta.tags
    WriteHashsinNewPost()
    RankHashTags()
}

async function LoadPosts(){
    const dados = await fetch('http://localhost:3333/buscarpost', {
        method: "POST"
    });
    const resposta = await dados.json();
    console.log(resposta.posts)
    resposta.posts.forEach(async post => {
      // Checar se tem imagems
      console.log(post)
      const dados = await fetch('http://localhost:3333/checkpost', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({"post": post.Post_ID})
      });
      const temImagem = await dados.json();
      if(temImagem){
        let div_post = document.createElement("post")
        div_post.setAttribute("class","post")
        let span_quempostou = document.createElement("span")
        let title_post = document.createElement("h2")
        let ul_post = document.createElement("ul")
        let p = document.createElement ("p")
        title_post.innerHTML = post.title
        span_quempostou.innerHTML = post.User_ID
        p.innerHTML = post.content
        post.hashtags.forEach(hashtag =>{
          let li = document.createElement("li")
          li.innerHTML = `#${hashtag}`
          ul_post.appendChild(li)
        })
        div_post.appendChild(title_post)
        div_post.appendChild(span_quempostou)
        div_post.appendChild(document.createElement("hr"))
        div_post.appendChild(ul_post)
        div_post.appendChild(p)
        temImagem.forEach(img => {
          let img_dom = document.createElement("img")
          img_dom.setAttribute("src",`http://localhost:3333/posts_images/${post.Post_ID}/${img}`)
          div_post.appendChild(img_dom)
        })
        document.querySelector('#dashboard').appendChild(div_post)
      }else{
        let div_post = document.createElement("post")
        div_post.setAttribute("class","post")
        let title_post = document.createElement("h2")
        let ul_post = document.createElement("ul")
        let p = document.createElement ("p")
        title_post.innerHTML = post.title
        p.innerHTML = post.content
        post.hashtags.forEach(hashtag =>{
          let li = document.createElement("li")
          li.innerHTML = `#${hashtag}`
          ul_post.appendChild(li)
        })
        div_post.appendChild(title_post)
        div_post.appendChild(document.createElement("hr"))
        div_post.appendChild(ul_post)
        div_post.appendChild(p)
        document.querySelector('#dashboard').appendChild(div_post)
      }
    })
}

function WriteHashsinNewPost(FilterContent) {
    let HashtagsHere
    if(FilterContent === undefined){
        HashtagsHere = { ...Hashtags }
    }else{
        HashtagsHere = { ...FilterContent}
    }
    const HereWriteHashtags = document.querySelector("#HereWriteHashtags");
    
    let Apagar = HereWriteHashtags.querySelectorAll('*:not(.ativo)');

    Apagar.forEach(elemento => {
      elemento.remove();
    });

    for (let key in HashtagsHere) {
      let hashtag = HashtagsHere[key].display;
      let index = hashtagstonewpost.indexOf(hashtag);
    
      if (index !== -1) {
        delete HashtagsHere[key];
      }
    }
    
    for (let key in HashtagsHere) {

      const element = HashtagsHere[key];
      const span = document.createElement("span");
      span.innerHTML = element.display;
      
      span.addEventListener("click", function() {
        comparetag = this.innerHTML;
        
        if (this.classList.value === "ativo") {
          hashtagstonewpost.forEach(function(hashtag, n) {
            if (hashtag == comparetag) {
              let indice = hashtagstonewpost.indexOf(comparetag);
              
              while (indice >= 0) {
                hashtagstonewpost.splice(indice, 1);
                indice = hashtagstonewpost.indexOf(comparetag);
              }
            }
          });
        } else {
          hashtagstonewpost.push(comparetag);
        }
        this.classList.toggle("ativo");
      });
      HereWriteHashtags.appendChild(span);
      
    }
}

document.querySelector("#filterTags").addEventListener("keyup", () => {
    let InputFilter = document.querySelector("#filterTags").value.toLowerCase();
  
    let filteredHashtags = Hashtags.filter(item =>
      item.display.toLowerCase().includes(InputFilter)
    );
  
    WriteHashsinNewPost(filteredHashtags);
});

function RankHashTags() {
    let HashtagsHere2 = { ...Hashtags };
    const RankDiv = document.querySelector("#morehashs");
    const QuantidadeExibida = 6;
    
    for (let i = 0; i < QuantidadeExibida; i++) {
      const li = document.createElement("li");
      const spanDisplay = document.createElement("span");
      const spanUses = document.createElement("span");
      let MaiorUso = 0;
      let MaiorUsoP = 0;
      
      for (let key in HashtagsHere2) {
        const Hashtag = HashtagsHere2[key];
        
        if (Hashtag.uses > MaiorUso) {
          MaiorUso = Hashtag.uses;
          MaiorUsoP = key;
        }
      }
      
      spanDisplay.innerHTML = `#${HashtagsHere2[MaiorUsoP].display}`;
      spanUses.innerHTML = `@${HashtagsHere2[MaiorUsoP].uses}`;
      li.setAttribute("id", HashtagsHere2[MaiorUsoP].display);
      
      li.addEventListener("click", function() {
        window.location.href = `http://localhost/TCC-DS/pages/social?tag=${this.id}`;
      });
      
      li.appendChild(spanDisplay);
      li.appendChild(spanUses);
      RankDiv.appendChild(li);
      delete HashtagsHere2[MaiorUsoP];
    }
}  

function NovaTag(){
    let newtag = document.querySelector("#newtag")
    let obj = {
        "tag" : newtag.value
    }
    QueryNovaTag(obj)
    newtag.value = ""
}

async function QueryNovaTag(tag){
    const dados = await fetch('http://localhost:3333/newtag',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(tag)
    });
    resposta = await dados.json()
    LoadTags()
}

function NovoPost() {
  let Post = {
    title: document.querySelector("#newtitle").value,
    content: document.querySelector("#newcontent").value,
    hashtags: hashtagstonewpost
  };

  const formData = new FormData();
  const imagesInput = document.querySelector("#imagestonewpost");

  for (let i = 0; i < imagesInput.files.length; i++) {
    formData.append("images", imagesInput.files[i]);
  }

  formData.append("post", JSON.stringify(Post));
  formData.append("user_id",u_infos.nome)

  const xhr = new XMLHttpRequest();
  let id = makeid(10)
  xhr.open("POST", `http://localhost:3333/newpost/${id}`);
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("Arquivo enviado com sucesso!");
      ConstruirProfile();
    } else {
      console.error("Ocorreu um erro ao enviar o arquivo.");
    }
  };
  xhr.send(formData);
}

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
  }
  return result;
}

LoadTags()
LoadPosts()
Query_Alguem_Logado()
