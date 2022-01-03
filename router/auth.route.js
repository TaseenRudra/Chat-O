const router = require('express').Router()
const {login , register ,verifyToken , getUsers, updatemessage} = require('../controllers/auth')
const auth = require('../middlewares/authentication')


router.get('/',getUsers)
router.get('/:id',getUsers)
router.put('/:id',updatemessage);
router.post('/register',register)
router.get('/verify-token',auth,verifyToken)



module.exports = router