class Pacotes{
    express = require("express")
    bcrypt = require("bcrypt");
    uid = require("uuid");
    fs = require("fs");
    cors = require("cors")
    bodyparser = require("body-parser")
    multer = require("multer")
}
module.exports = {
    Pacotes,
    multer: Pacotes.multer
}