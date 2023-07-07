const bcrypt = require("bcrypt");
const uid = require("uuid");
const fs = require("fs");

class Cadastrar{
    async gerarHash(senha) {
        const saltRounds = 10;
        const hash = await bcrypt.hash(senha, saltRounds);
        return hash;
    }
    
    async Cadastrar(NewUser) {
        let bdusuarios = JSON.parse(fs.readFileSync('./data/users.json'))
        NewUser.id = uid.v4()
        NewUser.senha = await this.gerarHash(NewUser.senha);
    
        bdusuarios.users.push(NewUser)
    
        fs.writeFileSync('./data/users.json', JSON.stringify(bdusuarios))
    
        return NewUser.id
    }

    async CadastrarIMC(NewImc){
        let bdusuarios = JSON.parse(fs.readFileSync('./data/users.json'))
        bdusuarios.users.forEach(usuario => {
            if(usuario.id === NewImc.id){
                usuario.peso = NewImc.peso
                usuario.altura = NewImc.altura
            }
        })
        fs.writeFileSync('./data/users.json', JSON.stringify(bdusuarios))
    }
}

module.exports = {
    Cadastrar
}