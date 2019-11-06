var db = require('../db/db');

//////////////////////////////// LOGIN  /////////////////////////////////////////

function checkLogin (email,password){
    return new Promise((resolve,reject)=>{
        let sql = "SELECT * FROM user WHERE email= ? AND password = ? ";
        db.connection.query(sql, [email, password], (error, results) => {
            if (error) {
                 reject(error);
            }          
            resolve(results[0]);
            
        });
    });
   
};
////////////////////////////////////// GET DATA/////////////////////////////////

function getAllUsers (){
    return new Promise((resolve,reject)=>{
        let sql = "select user.id,user.fullname,user.email,user.phone,department.name from user left join department on user.idDepartment = department.id";
        db.connection.query(sql, (error, results) => {
            if (error) {
                reject(error);
           }          
           resolve(results);
        });
   
    });
}
//paging
function getUsersLimitOffset (start,offset){
    return new Promise((resolve,reject)=>{
        let sql = "select user.id,user.fullname,user.email,user.phone,department.name from user left join department on user.idDepartment = department.id limit ?,?";
        db.connection.query(sql,[start,offset], (error, results) => {
            if (error) {
                reject(error);
           }          
           resolve(results);
        });
   
    });
}
//filtering
function getIdDepartment (name){
    return new Promise((resolve,reject)=>{
         let sqlNameDepartment = "select id from department where name= ?";
         db.connection.query(sqlNameDepartment,[name], (error, results) => {
            if (error) {
                reject(error);
           }          
           resolve(results[0].id);
        });   
    });
}
function getUsersForIdDepartment (idDepartment){
    return new Promise((resolve,reject)=>{
        let sql = "select user.id,user.fullname,user.email,user.phone,department.name from user left join department on user.idDepartment = department.id where idDepartment=?";
        db.connection.query(sql,[idDepartment], (error, results) => {
            if (error) {
                reject(error);
           }          
           resolve(results);
        });
   
    });
}
//search

//////////////////////////////////  UPDATE //////////////////////////////

function getEmailForId(id){
    return new Promise((resolve,reject)=>{
        let sql = "SELECT email FROM user where id = ?";
        db.connection.query(sql,[id], (error, results) => {
            if (error) {
                reject(error);
           }          
           resolve(results[0].email);
        });
   
    });
}

function updatePWUser(passReset,id){
    return new Promise((resolve,reject)=>{
        let sql = "update user set password = ? where id = ?";
        db.connection.query(sql, [passReset,id], (error, results) => {
            if (error) {
                reject(error);
           }          
           resolve(results);
        });
   
    });
}
function updateUser(fullname,email,phone,idDepartment,id){
    return new Promise((resolve,reject)=>{
        let sql = "update user set fullname = ?,email= ?, phone = ?, idDepartment = ? where id = ?";
        db.connection.query(sql, [fullname,email,phone,idDepartment,id], (error, results) => {
            if (error) {
                reject(error);
           }          
           resolve(results);
        });
   
    });
}
//////////////////////////////// INSERT ///////////////////////////////////
//register
function insertUser(fullnameuser,emailuser,passworduser,phoneuser){
    return new Promise((resolve,reject)=>{
        let sql = "INSERT INTO user(fullname,email,password,phone) VALUES (?,?,?,?)";
        db.connection.query(sql, [fullnameuser, emailuser, passworduser,phoneuser], (error, results, fields) => {
            if (error) {
                reject(error);
           }          
           resolve(results);
        });
   
    });
}

///////////////////////////// DELETE ////////////////////////////
function deleteUser(id){
    return new Promise((resolve,reject)=>{
        let sql = "delete from user where id = ?";
        db.connection.query(sql, [id], (error, results) => {
            if (error) {
                reject(error);
           }          
           resolve(results);
        });
   
    });
}
/////////////// search KEY ////////////////
function searchAll (key){
    return new Promise((resolve,reject)=>{
        let sql = "select user.id,user.fullname,user.email,user.phone,department.name from user left join department on user.idDepartment = department.id where user.fullname like ? or user.email like ? or user.phone like ? or department.name like ?";
       key = "%"+key+"%";
        db.connection.query(sql,[key,key,key,key], (error, results) => {
            if (error) {
                reject(error);
           }          
           resolve(results);
        });
   
    });
}

function searchForDepartment (key,idDepartment){
    return new Promise((resolve,reject)=>{
      
        let sql = "select user.id,user.fullname,user.email,user.phone,department.name from user left join department on user.idDepartment = department.id where department.id = ? and user.id in(select user.id from user left join department on user.idDepartment = department.id where user.fullname like ? or user.email like ? or user.phone like ?)";
        key = "%"+key+"%";
        db.connection.query(sql,[idDepartment,key,key,key,key], (error, results) => {
            if (error) {
                reject(error);
           }          
           resolve(results);
        });
   
    });
}
/////////////// check Email //////////////
function checkEmailExistRegister (email){
    return new Promise((resolve,reject)=>{
        
        let sql = "select * from user where email = ?";
        db.connection.query(sql,[email], (error, results) => {
            if (error) {
                reject(error);
            }          
            resolve(results);
        });
    
    });
}

module.exports = {
    checkLogin,
    // getdata
    getAllUsers,
    getUsersLimitOffset,
    getIdDepartment,
    getUsersForIdDepartment,
    searchAll,
    searchForDepartment,
    // update
    getEmailForId,
    updatePWUser,
    updateUser,
    // insert
    insertUser,
    //delete
    deleteUser,
    //check
    checkEmailExistRegister
}