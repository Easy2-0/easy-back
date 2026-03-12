import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import usuarioRoutes from './routes/usuario.routes'
import authRoutes from './routes/auth.routes'
import categoriaRoutes from './routes/categoria.routes'
import transacaoRoutes from './routes/transacao.routes'
import investimentoRoutes from './routes/investimento.routes'
import { errorHandler } from './middleware/errorHandler'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(cors())
app.use(express.json())

// Rotas
app.use('/auth', authRoutes)
app.use('/usuario', usuarioRoutes)
app.use('/categoria', categoriaRoutes)
app.use('/transacao', transacaoRoutes)
app.use('/investimento', investimentoRoutes)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handler (sempre por último)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})

export default app
