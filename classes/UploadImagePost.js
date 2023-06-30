const {Pacotes} = require("../configs/Packages.js");
let P = new Pacotes()

module.exports = (P.multer({
    storage: P.multer.diskStorage({
        destination: (req,file,cb) => {
            let post = req.params.postId
            P.fs.mkdir(`./public/posts_images/${post}`,(err) => {
            })
            cb(null, `./public/posts_images/${post}`)
        },
        filename: (req,file,cb) => {
            cb(null, `${P.uid.v4()}.png`)
        }
    }),
    fileFilter: (req,file,cb) => {
        const extensaoImg = ['image/png','image/jpg','image/gif'].find
        (formatoAceito => formatoAceito == file.mimetype)
        if(extensaoImg){
            return cb(null,true)
        }
        return cb(null,false)
        
    }   
}))