import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import prisma from '../database/prisma'

const investimentoSchema = z.object({
  valorAplicado: z.number().positive(),
  dataAplicacao: z.string().datetime({ offset: true }).or(z.string().date()),
  tipoInvestimento: z.string().min(1),
  usuarioId: z.number().int().positive(),
})

export async function listar(_req: Request, res: Response, next: NextFunction) {
  try {
    const investimentos = await prisma.investimento.findMany({
      orderBy: { dataAplicacao: 'asc' },
      include: { usuario: true },
    })
    res.json(investimentos)
  } catch (err) {
    next(err)
  }
}

export async function criar(req: Request, res: Response, next: NextFunction) {
  try {
    const dados = investimentoSchema.parse(req.body)
    const investimento = await prisma.investimento.create({
      data: { ...dados, dataAplicacao: new Date(dados.dataAplicacao) },
      include: { usuario: true },
    })
    res.status(201).json(investimento)
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
    const dados = investimentoSchema.partial().parse(req.body)
    const investimento = await prisma.investimento.update({
      where: { id },
      data: {
        ...dados,
        dataAplicacao: dados.dataAplicacao ? new Date(dados.dataAplicacao) : undefined,
      },
      include: { usuario: true },
    })
    res.json(investimento)
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
    await prisma.investimento.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
