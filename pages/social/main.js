let variavelDebug = false
let hashtagstonewpost = []
let comparetag
let u_infos

function volta(){
    window.location.href = `../../`;
}

async function Query_Alguem_Logado(json){
    const dados = await fetch('../../check',{
        method: "POST",
        body: JSON.stringify(json),
        headers: {
            "token": localStorage.getItem("token")
        }
    });
    resposta = await dados.json();
    u_infos = resposta
    LoadDirects()
    if(!u_infos){
      window.location.href = "../../pages/acess/"
    }
}

function ToNovoPost(){
    document.querySelector("#post-page").classList.toggle("ativo")
}

function ToNovaTag(){
    document.querySelector("#tag-page").classList.toggle("ativo")
}

async function LoadDirects(){
  u_infos.chats.forEach(async element => {
    const dados = await fetch('../../ChatsInfos',{
        method: "POST",
        body: JSON.stringify({"idchat":element,"iduser":u_infos.id}),
        headers: {
          "Content-Type": "application/json"
        }
    });
    resposta = await dados.json();
    let div = document.createElement("div")
    let li = document.createElement("li")
    let dell = document.createElement("i")

    dell.setAttribute("class","bx bx-x")
    dell.setAttribute("id","deleteBtn")
    dell.addEventListener("click",async() => {
      const dados = await fetch('../../deletechat',{
        method: "POST",
        body: JSON.stringify({"idchat":element}),
        headers: {
          "Content-Type": "application/json"
        }
      })
      resposta = await dados.json()
      if(resposta){
        window.location.href = "../../pages/social/"
      }
    })
    li.innerHTML = resposta.nome
    li.addEventListener("click",() => {
      window.location.href = `../../pages/chat/?id=${element}`
    })
    div.appendChild(li)
    div.appendChild(dell)
    document.querySelector("#chatsopn").appendChild(div)
  })
}

let Hashtags
async function LoadTags() {
    const dados = await fetch('../../tags', {
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
    const dados = await fetch('../../buscarpost', {
        method: "POST"
    });
    const resposta = await dados.json();
    resposta.posts.forEach(async post => {
      // Checar se tem imagems
      const dados = await fetch('../../checkpost', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({"post": post.Post_ID})
      });
      const temImagem = await dados.json();
      if(temImagem){
        let div_post = document.createElement("div")
        div_post.setAttribute("class","post")
        let span_quempostou = document.createElement("span")
        span_quempostou.addEventListener("click",function(){
          const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
          localStorage.setItem('scrollPosition', scrollPosition);
          window.location.href = "../../pages/profile/?id=" + post.User_ID
        })
        let title_post = document.createElement("h2")
        let ul_post = document.createElement("ul")
        let p = document.createElement ("p")
        title_post.innerHTML = post.title
        span_quempostou.innerHTML = post.User_Name
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
          img_dom.setAttribute("src",`../../posts_images/${post.Post_ID}/${img}`)
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
        window.location.href = `../../pages/social/?tag=${this.id}`;
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
    const dados = await fetch('../../newtag',{
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
  formData.append("user_id",u_infos.id)
  formData.append("user_name",u_infos.nome)

  const xhr = new XMLHttpRequest();
  let id = makeid(10)
  xhr.open("POST", `../../newpost/${id}`);
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("Arquivo enviado com sucesso!");
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
