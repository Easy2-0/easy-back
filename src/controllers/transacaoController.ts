import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import prisma from '../database/prisma'

const transacaoSchema = z.object({
  tipo: z.string().min(1),
  nome: z.string().min(1),
  valor: z.number().positive(),
  data: z.string().datetime({ offset: true }).or(z.string().date()),
  descricao: z.string().optional(),
  usuarioId: z.number().int().positive(),
  categoriaId: z.number().int().positive().optional(),
})

export async function listar(_req: Request, res: Response, next: NextFunction) {
  try {
    const transacoes = await prisma.transacao.findMany({
      orderBy: { data: 'desc' },
      include: { usuario: true, categoria: true },
    })
    res.json(transacoes)
  } catch (err) {
    next(err)
  }
}

export async function criar(req: Request, res: Response, next: NextFunction) {
  try {
    const dados = transacaoSchema.parse(req.body)
    const transacao = await prisma.transacao.create({
      data: { ...dados, data: new Date(dados.data) },
      include: { usuario: true, categoria: true },
    })
    res.status(201).json(transacao)
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
    const dados = transacaoSchema.partial().parse(req.body)
    const transacao = await prisma.transacao.update({
      where: { id },
      data: { ...dados, data: dados.data ? new Date(dados.data) : undefined },
      include: { usuario: true, categoria: true },
    })
    res.json(transacao)
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
    await prisma.transacao.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
