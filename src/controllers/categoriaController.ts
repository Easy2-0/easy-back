import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import prisma from '../database/prisma'

const categoriaSchema = z.object({
  nome: z.string().min(1),
  tipo: z.string().min(1),
})

export async function listar(_req: Request, res: Response, next: NextFunction) {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nome: 'asc' },
    })
    res.json(categorias)
  } catch (err) {
    next(err)
  }
}

export async function criar(req: Request, res: Response, next: NextFunction) {
  try {
    const dados = categoriaSchema.parse(req.body)
    const categoria = await prisma.categoria.create({ data: dados })
    res.status(201).json(categoria)
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', detalhes: err.issues })
      return
    }
    next(err)
  }
}

export async function atualizar(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const dados = categoriaSchema.partial().parse(req.body)
    const categoria = await prisma.categoria.update({ where: { id }, data: dados })
    res.json(categoria)
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
    await prisma.categoria.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
