const {Pacotes} = require("../configs/Packages.js");
let P = new Pacotes()

class Profile_Photo_Manager{
    Guardar(Id_PP , Id_Usuario){
        let Usuarios = P.Buscar("./data/users.json")
        Usuarios.users.forEach(function(Usuario,Key) {
            if(Id_Usuario === Usuario.id){
                if(Usuario.profile_photo !== null){
                    P.Excluir("./public/profile_images/" + Usuario.profile_photo)
                    Usuarios.users[Key].profile_photo = Id_PP
                    return
                }else{
                    Usuarios.users[Key].profile_photo = Id_PP
                    return
                }
            }
        });
        P.Guardar("./data/users.json",Usuarios)
    }
}

module.exports = {
    Profile_Photo_Manager
}