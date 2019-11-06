var jwt = require('jsonwebtoken');


function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    //check if bearer undifined
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        jwt.verify(req.token,'seccretkey',(err,authdata)=>{
            if(err)
                res.sendStatus(403);
            else{
                console.log(authdata);
                next();
            }
        });
        
    }
    else{
        //forbidden
        res.sendStatus(403);
    }
};
module.exports = {
    verifyToken
}