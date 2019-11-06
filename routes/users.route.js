const express = require('express');
const router = express.Router();

const controller = require('../controller/users.controller');
const checkToken = require('../middleware/auth');


router.get('/test',checkToken.verifyToken,(req,res)=> res.send("pass check token"));
router.get('/',controller.getListUsers);
router.get('/logout',controller.getLogout);

router.post('/login',controller.postLogin);
router.post('/',controller.postRegister);

router.put('/:id/resetPassword',controller.putResetPassword);
router.put('/:id',controller.putEdit);

router.delete('/:id',controller.deleteUser);

module.exports = router;