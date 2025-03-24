const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getMisDatos, getAllUsers, getUserById, requestPasswordReset, resetPassword } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/reset-password', requestPasswordReset);
router.put("/reset-password/:token", resetPassword);
router.get('/misdatos', protect, getMisDatos)
router.get('/getusers', protect, getAllUsers)
router.get('/:id', protect, getUserById)

module.exports = router