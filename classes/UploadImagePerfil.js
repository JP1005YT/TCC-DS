const {Pacotes, multer} = require("../configs/Packages.js");
let P = new Pacotes()

module.exports = (P.multer({
    storage: P.multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null, "./public/profile_images")
        },
        filename: (req,file,cb) => {
            console.log('teste')
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