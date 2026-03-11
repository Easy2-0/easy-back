import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Categorias
  const categorias = await Promise.all([
    prisma.categoria.upsert({ where: { id: 1 }, update: {}, create: { nome: 'Alimentação', tipo: 'DESPESA' } }),
    prisma.categoria.upsert({ where: { id: 2 }, update: {}, create: { nome: 'Salário', tipo: 'RECEITA' } }),
    prisma.categoria.upsert({ where: { id: 3 }, update: {}, create: { nome: 'Transporte', tipo: 'DESPESA' } }),
    prisma.categoria.upsert({ where: { id: 4 }, update: {}, create: { nome: 'Lazer', tipo: 'DESPESA' } }),
    prisma.categoria.upsert({ where: { id: 5 }, update: {}, create: { nome: 'Freelance', tipo: 'RECEITA' } }),
  ])

  // Usuários
  const usuarios = await Promise.all([
    prisma.usuario.upsert({ where: { email: 'ana@email.com' }, update: {}, create: { nome: 'Ana', email: 'ana@email.com', senha: '123456' } }),
    prisma.usuario.upsert({ where: { email: 'carlos@email.com' }, update: {}, create: { nome: 'Carlos', email: 'carlos@email.com', senha: '123456' } }),
  ])

  const [ana] = usuarios
  const [alimentacao, salario] = categorias

  // Transações
  await prisma.transacao.createMany({
    skipDuplicates: true,
    data: [
      { tipo: 'DESPESA', nome: 'Almoço', valor: 45.0, data: new Date('2025-01-10'), usuarioId: ana.id, categoriaId: alimentacao.id },
      { tipo: 'RECEITA', nome: 'Salário Janeiro', valor: 3500.0, data: new Date('2025-01-05'), usuarioId: ana.id, categoriaId: salario.id },
    ],
  })

  // Investimentos
  await prisma.investimento.createMany({
    skipDuplicates: true,
    data: [
      { valorAplicado: 500.0, dataAplicacao: new Date('2025-01-15'), tipoInvestimento: 'Tesouro Direto', usuarioId: ana.id },
      { valorAplicado: 1000.0, dataAplicacao: new Date('2025-01-20'), tipoInvestimento: 'CDB', usuarioId: ana.id },
    ],
  })

  console.log('Seed concluído!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
