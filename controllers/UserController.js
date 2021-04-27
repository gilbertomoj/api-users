var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var secret = "cachorro31231"

class UserController{
    async index(req, res){
        const users = await User.findAll();
        res.json({users})
    }

    async create(req, res){
        const errors = [];
        const { name , email , password} = req.body;

        const emailAlreadyExists = await User.findEmail(email);
        //Validação do formulário
        if(emailAlreadyExists){
            const error = "Um cadastro com esse email ja foi realizado"
            errors.push(error);
        }
        if (email == "" || email == undefined) {
            const error = "O campo >> email << não pode ficar vazio"
            errors.push(error);

        }   
        if (password == "" || password == undefined) {
            const error = "O campo >> senha << não pode ficar vazio"
            errors.push(error);
                                    
        }   

        if (errors.length == 0) {
            await User.new(email,password,name);
            res.status(200).send("Cadastro realizado com sucesso");
        } else {
            res.status(409).send(errors);
           

            return;
        }
    }

    async findUser(req, res){
        var user = await User.findById(req.params.id);
        
        if (user != undefined) {
            res.json(user);
            return user;
        } else {
            res.status(404).send({error : `Não existe usuário com o id >> ${req.params.id} <<  cadastrado`})
        }
        
    }

    async edit(req, res){
        var { id , name , email , role} = req.body; 

        var result = await User.update(id, name, email, role);
        if (result != undefined) {
            if (result.status) {
                res.status(200)
                res.send("User editado com sucesso")
            }else{
                res.status(406);
                res.send(result.err);
            }
        }else{
            res.status(406)
            res.send("Erro na edição")
        }
    }

    async delete(req, res){
        var id = req.params.id;

        var result = await User.delete(id)

        if (result.status) {
            //Delete no knex
            res.status(200).send("User deletado")
        } else {
            res.status(406).send(result.err)
        }
    }

    async recoverPassword(req, res){
        var email = req.body.email;

        var result = await PasswordToken.create(email)

        if (result.status) {
            console.log(result.token);
            res.status(200).send("Token criado com sucesso : "+result.token);
            //Envio para o email
        } else {
            res.status(406).send(result.err)
        }


    }

    async changePassword(req, res){
        var token = req.body.token;
        var password = req.body.password;

        var isTokenValid = await PasswordToken.validate(token);

        if(isTokenValid.status){

            await User.changePassword(password,isTokenValid.token.user_id, isTokenValid.token.token);
            res.status(200).send("Senha foi alterada")
            
        }else{
            res.status(406).send("Token invalido");
            console.log(isTokenValid)
        }

    }

    async login(req, res){
        var { email , password} = req.body;

        var user = await User.findByEmail(email);
        if (user != undefined) {
            var result = await bcrypt.compare(password, user.password);
            if (result) {
                
                var token = jwt.sign({email: user.email, role: user.role}, secret);
                res.status(200).send({token})

            }
        } else {
            res.json({status: false});
        }
    }
}

module.exports = new UserController;