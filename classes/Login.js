const fs = require("fs");
const bcrypt = require("bcrypt");


class Login {
    async logar (req, res) {

        let tokensAndData = JSON.parse(fs.readFileSync('./data/tokens.json'))
        let bdusuarios = JSON.parse(fs.readFileSync('./data/users.json'))
        let dadoslogin = req.body
        let encontrado = false
        let user
    
        for (let i = 0; i < bdusuarios.users.length; i++) {
            user = bdusuarios.users[i]
    
            if (user.email === dadoslogin.email) {
                const senhasBatem = await this.CompararSenhas(dadoslogin.senha, user.senha)
    
                if (senhasBatem) {
                    encontrado = true
                    break
                }
            }
        }
    
        if (encontrado) {
            let items = Object.keys(tokensAndData.tokens)
            items.forEach(token => {
                if (tokensAndData.tokens[token].valor === user.id) {
                    delete tokensAndData.tokens[token]
                }
            })
    
            let id = this.makeid(10)
            tokensAndData.tokens[id] = {
                valor: user.id
            }
            // req.session.valor = user.id
    
            res.send({ "res": true, "token": id })
    
            this.GuardarLogados(tokensAndData)
        } else {
            res.send({ "res": false })
        }
    }

    async CompararSenhas(senha, senhaCript) {
        let valor = await bcrypt.compare(senha, senhaCript)
        return valor
    }

    makeid(length) {
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

    GuardarLogados(token) {
        fs.writeFileSync('./data/tokens.json', JSON.stringify(token))
    }
    
}

module.exports = {
    Login
}
