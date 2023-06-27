const {Pacotes} = require("../configs/Packages.js");
let P = new Pacotes()

class Check{
    Checar(){
        const tokensAndData = JSON.parse(P.fs.readFileSync('./data/tokens.json'))
        const token = req.headers.token;
        const data = tokensAndData.tokens[token];
        if (typeof data === 'undefined') {
            console.log('Ninguem Logado')
            return false
        } else {
            let bdusuarios = JSON.parse(P.fs.readFileSync('./data/users.json'))
            bdusuarios.users.forEach(element => {
                if (element.id == data.valor) {
                    console.log(`Logado : {${element.id}}`)
                    return element
                }
            });
        }
    }
}

module.exports = {
    Check
}