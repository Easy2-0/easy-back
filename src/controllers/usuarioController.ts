import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import prisma from '../database/prisma'

const usuarioSchema = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  senha: z.string().min(6),
})

export async function listar(_req: Request, res: Response, next: NextFunction) {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { nome: 'asc' },
    })
    res.json(usuarios)
  } catch (err) {
    next(err)
  }
}

export async function criar(req: Request, res: Response, next: NextFunction) {
  try {
    const dados = usuarioSchema.parse(req.body)
    const usuario = await prisma.usuario.create({ data: dados })
    res.status(201).json(usuario)
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', detalhes: err.issues })
      return
    }
    next(err)
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, senha } = z.object({ email: z.string().email(), senha: z.string() }).parse(req.body)

    const usuario = await prisma.usuario.findUnique({ where: { email } })

    if (!usuario || usuario.senha !== senha) {
      res.status(401).json({ error: 'E-mail ou senha incorretos' })
      return
    }

    res.json(usuario)
  } catch (err) {
    next(err)
  }
}


export async function atualizar(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const dados = usuarioSchema.partial().parse(req.body)
    const usuario = await prisma.usuario.update({ where: { id }, data: dados })
    res.json(usuario)
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', detalhes: err.issues })
      return
    }
    next(err)
  }
}

export async function remover(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    await prisma.usuario.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
