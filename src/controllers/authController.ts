import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import prisma from '../database/prisma'

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
})

const cadastroSchema = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  senha: z.string().min(6),
})

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, senha } = loginSchema.parse(req.body)

    const usuario = await prisma.usuario.findUnique({ where: { email } })

    if (!usuario || usuario.senha !== senha) {
      res.status(401).json({ error: 'Email ou senha inválidos' })
      return
    }

    const token = Buffer.from(`${usuario.id}:${usuario.email}`).toString('base64')

    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      token,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', detalhes: err.issues })
      return
    }
    next(err)
  }
}

export async function cadastro(req: Request, res: Response, next: NextFunction) {
  try {
    const dados = cadastroSchema.parse(req.body)

    const existente = await prisma.usuario.findUnique({ where: { email: dados.email } })
    if (existente) {
      res.status(409).json({ error: 'Email já cadastrado' })
      return
    }

    const usuario = await prisma.usuario.create({ data: dados })

    const token = Buffer.from(`${usuario.id}:${usuario.email}`).toString('base64')

    res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      token,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', detalhes: err.issues })
      return
    }
    next(err)
  }
}
