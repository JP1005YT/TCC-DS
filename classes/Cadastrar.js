const uid = require("uuid");

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
}

module.exports = {
    Cadastrar
}