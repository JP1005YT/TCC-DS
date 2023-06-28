const {Pacotes, multer} = require("../configs/Packages.js");
let P = new Pacotes()
module.exports = (P.multer({
    storage: P.multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null, "./data/profile_images")
        },
        filename: (req,file,cb) => {
            cb(null, `asdasdwq.png`)
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