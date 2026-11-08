import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const query = new URL(request.url).searchParams
    const page = Number(query.get('page') ?? 1)
    const requestedLimit = Number(query.get('limit') ?? 10)
    const sortBy = query.get('sortBy') ?? 'createdAt'
    const order = query.get('order') ?? 'desc'
    if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(requestedLimit) || requestedLimit < 1) {
      return NextResponse.json({ error: 'page y limit deben ser enteros positivos' }, { status: 400 })
    }
    if (!['title', 'publishedYear', 'createdAt'].includes(sortBy) || !['asc', 'desc'].includes(order)) {
      return NextResponse.json({ error: 'Campo u orden de clasificación inválido' }, { status: 400 })
    }
    const limit = Math.min(requestedLimit, 50)
    const skip = (page - 1) * limit
    if (!Number.isSafeInteger(skip)) {
      return NextResponse.json({ error: 'Número de página fuera de rango' }, { status: 400 })
    }
    const search = query.get('search')?.trim()
    const genre = query.get('genre')
    const authorName = query.get('authorName')?.trim()
    const authorId = query.get('authorId')
    const where: Prisma.BookWhereInput = {
      ...(search && { title: { contains: search, mode: 'insensitive' } }),
      ...(genre && { genre }),
      ...(authorName && { author: { name: { contains: authorName, mode: 'insensitive' } } }),
      ...(authorId && { authorId }),
    }
    const [data, total] = await prisma.$transaction([
      prisma.book.findMany({
        where,
        include: { author: { select: { id: true, name: true, email: true } } },
        orderBy: [{ [sortBy]: order }, { id: 'asc' }],
        skip,
        take: limit,
      }),
      prisma.book.count({ where }),
    ])
    const totalPages = Math.ceil(total / limit)
    return NextResponse.json({
      data,
      pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    })
  } catch (error) {
    console.error('Error al buscar libros', error)
    return NextResponse.json({ error: 'Error al buscar libros' }, { status: 500 })
  }
}
