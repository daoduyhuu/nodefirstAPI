var jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const shortid = require('shortid');

const modelsUser = require('../models/user.model');

// reset password
const sendgridAPIKey = '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'


////////////////////////////// LOGIN //////////////////////////////
function postLogin (req, res) {
    let emailuser = req.body.email;
    let passworduser = req.body.password;
   
    modelsUser.checkLogin(emailuser,passworduser)
    .then(result =>{
        if (typeof result==="undefined"){
            res.status(403).json({err:'Email or Password incorrect'});         
        }
        else{
            //send token
            jwt.sign({emailuser},'seccretkey',{expiresIn:'1h'},(err,token)=>{
                res.json({
                    token
                });
            });
        }
    })
    .catch(err=>{
        res.send("Err:"+err);   
    });
   
};

////////////////// GET LIST USERS ////////////////////
async function getListUsers (req,res){ 
    let limit = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    let department = req.query.department;
    let search = req.query.search;

    if(limit && offset){    
        let start = (limit-1)*offset;
                    
        modelsUser.getUsersLimitOffset(start,offset)
        .then(result =>{
            res.status(200).json(result);
        })
        .catch(err =>{
            res.status(400).json({err:err}); 
        });
        return;
    }
    if(search && department){
        console.log('calling');
        let idDepartment = await modelsUser.getIdDepartment(department);
        modelsUser.searchForDepartment(search,idDepartment)
        .then(result =>{
            res.status(200).json(result);
        })
        .catch(err =>{
            res.status(400).json({err:err}); 
        });
        return;
    }
    if(department){
        let idDepartment = await modelsUser.getIdDepartment(department);
        modelsUser.getUsersForIdDepartment(idDepartment)
        .then(result =>{
            res.status(200).json(result);
        })
        .catch(err =>{
            res.status(400).json({err:err}); 
        });
        return;
    }
    if(search){
        modelsUser.searchAll(search)
        .then(result =>{
            res.status(200).json(result);
        })
        .catch(err =>{
            res.status(400).json({err:err}); 
        });
        return;
    }
   
    modelsUser.getAllUsers()
        .then(result =>{
            res.status(200).json(result);
        })
        .catch(err =>{
            res.status(400).json({err:err});  
        });                 
                                      
}

////////////////////// RESET PASSWORD <put> //////////////////////////
async function putResetPassword(req, res) {
    let passReset = shortid.generate();
    let id = req.params.id;
    let email = await modelsUser.getEmailForId(id);

    // send email reset password
    sgMail.setApiKey(sendgridAPIKey);
    const msg = {
      to: email,
      from: '15520292@gm.uit.edu.vn',
      subject: 'Sending to reset your password',
      text: 'Your Password reset is: '+passReset,  
    };
    sgMail.send(msg);
    // update in database
    modelsUser.updatePWUser(passReset,id)
    .then(result => {
        res.status(200).json({success:"Reset password successful"});
    })
    .catch(err =>{
        res.status(400).json({err:err});  
    });
}

///////////////////// EDIT <put> ///////////////////////////
function putEdit (req, res) {
    let fullnameuser = req.body.fullname;
    let emailuser = req.body.email;
    let idDepartment = req.body.department;
    let phoneuser = req.body.phone;
    let id = req.params.id;
  
   modelsUser.updateUser(fullnameuser,emailuser,phoneuser,idDepartment,id)
   .then(result =>{
         res.status(200).json({success:"Edit successful"});
    })
   .catch(err =>{
         res.status(400).json({err:err});  
    });
}

////////////////////// LOGOUT <get> ////////////////////////
function getLogout(req, res) {    
    //We will destroy session OR authentication.
    res.status(200).json({success:'You are logout'});
};

///////////////////// REGISTER <post> ///////////////////////////
async function postRegister (req, res) {
    let fullnameuser = req.body.fullname;
    let emailuser = req.body.email;
    let passworduser = req.body.password;
    let phoneuser = req.body.phone;
   // let idDepartment = req.idDepartment;
    let check = await modelsUser.checkEmailExistRegister(emailuser);
    if(check)
         res.status(400).json({err:'Email exists'});
    else{
        modelsUser.insertUser(fullnameuser,emailuser,passworduser,phoneuser)
        .then(result =>{
            res.status(201).json({success:'Register successful'});
        })
        .catch(err =>{
            res.status(400).json({err:err});  
        });
    }
      
};

//////////////////////// DELETE ////////////////////////////
function deleteUser(req, res) {
    modelsUser.deleteUser(req.params.id)
    .then(result =>{
        res.status(204).json({success:'Delete successful'});
    })
    .catch(err =>{
        res.status(400).json({err:err});  
    })
}
   

module.exports = {
    postLogin,
    getListUsers,
    getLogout,
    putResetPassword,
    postRegister,
    putEdit,
    deleteUser
    // getSearch,
    // postCheckEmailExistRegister,
    // getListUserNoAjax,
    // getSearchNoAjax,
    // getList
};