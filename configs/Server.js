const {Pacotes} = require("../configs/Packages.js");
let P = new Pacotes()
class Server{
    app = P.express();
    server = require('http').createServer(this.app);
    io = require('socket.io')(this.server);
    start(){
        // Presets do app
        this.app.set('view engine', 'ejs');
        this.app.use(P.bodyparser.urlencoded({ extended: false }));
        this.app.use(P.bodyparser.json());
        this.app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
        });
        this.app.use(P.express.static('public'));
        this.app.use(P.cors());

        // Porta do servidor
        const PORT = 3333;

        // Abri o server
        this.server.listen(PORT, () => {
            let Str = `
========================================
            Servidor Online
========================================
       Link: http://localhost:${PORT}/      
` 
            console.log(Str);
        });
    }
}
module.exports = {
    Server
}