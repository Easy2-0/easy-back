import { Router } from 'express'
import { listar, criar, atualizar, remover } from '../controllers/usuarioController'

const router = Router()

router.get('/', listar)
router.post('/', criar)
router.put('/:id', atualizar)
router.delete('/:id', remover)

export default router
