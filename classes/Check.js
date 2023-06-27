const {Pacotes} = require("../configs/Packages.js");
let P = new Pacotes()

class Check{
    Checar(req){
        const tokensAndData = JSON.parse(P.fs.readFileSync('./data/tokens.json'))
        const token = req.headers.token;
        const data = tokensAndData.tokens[token];
        let User
        if (typeof data === 'undefined') {
            return false
        } else {
            let bdusuarios = JSON.parse(P.fs.readFileSync('./data/users.json'))
            bdusuarios.users.forEach(element => {
                if (element.id == data.valor) {
                    console.log(`Logado : {${element.id}}`)
                    User = element
                }
            });
        }
        return User
    }
}

module.exports = {
    Check
}