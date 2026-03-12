import { Router } from 'express'
import { login, cadastro } from '../controllers/authController'

const router = Router()

// O frontend espera /auth/cadastro e /auth/login
router.post('/cadastro', cadastro)
router.post('/login', login)

export default router
