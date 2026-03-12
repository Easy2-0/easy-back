import { Router } from 'express'
import { criar, login } from '../controllers/usuarioController'

const router = Router()

// O frontend espera /auth/cadastro e /auth/login
router.post('/cadastro', criar)
router.post('/login', login)

export default router
