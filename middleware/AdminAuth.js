var jwt = require("jsonwebtoken");
var secret = "cachorro31231"

module.exports = function(req, res , next){

    const authToken = req.headers['authorization']

    if(authToken != undefined){

        const bearer = authToken.split(' ');
        var token = bearer[1];

        try {
            var decoded = jwt.verify(token, secret);
            console.log(decoded)

            if(decoded.role == 1 ){
                next();
            }else{
                res.status(403).send("Você não esta autorizado para acessar essa rota");
            }

        } catch (error) {
            res.status(403).send("Você não esta autorizado");
            return
        }



    }else{
        res.status(403).send("Você não esta autorizado");
        return
    }

}