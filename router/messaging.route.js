const {addMessage , userlist,getchatroom} = require('../controllers/messaging')
const auth = require('../middlewares/authentication')
const router = require('express').Router()

router.get('/:id',getchatroom);
router.put('/:id',addMessage);
router.get('/users',userlist);


module.exports = router