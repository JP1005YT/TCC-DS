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
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
        const fileExtension = P.path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(fileExtension)) {
            return cb(null, true);
        }
        return cb(null, false);
    }
}))