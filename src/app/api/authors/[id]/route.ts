import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Context = { params: Promise<{ id: string }> }

// GET - Obtener un autor especifico por ID
export async function GET(request: Request, { params }: Context) {
  const { id } = await params
  try {
    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        books: { orderBy: { publishedYear: 'desc' } },
        _count: { select: { books: true } },
      },
    })
    if (!author) {
      return NextResponse.json({ error: 'Autor no encontrado' }, { status: 404 })
    }
    return NextResponse.json(author)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Error al obtener autor' }, { status: 500 })
  }
}

// PUT - Actualizar un autor
export async function PUT(request: Request, { params }: Context) {
  const { id } = await params
  try {
    const body = await request.json()
    const { name, email, bio, nationality, birthYear } = body
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
      }
    }
    const author = await prisma.author.update({
      where: { id },
      data: {
        name,
        email,
        bio,
        nationality,
        birthYear: birthYear ? parseInt(birthYear) : null,
      },
      include: { books: true },
    })
    return NextResponse.json(author)
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Autor no encontrado' }, { status: 404 })
      }
      if (error.code === 'P2002') {
        return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 })
      }
    }
    console.log(error)
    return NextResponse.json({ error: 'Error al actualizar autor' }, { status: 500 })
  }
}

// DELETE - Eliminar un autor
export async function DELETE(request: Request, { params }: Context) {
  const { id } = await params
  try {
    await prisma.author.delete({ where: { id } })
    return NextResponse.json({ message: 'Autor eliminado correctamente' })
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Autor no encontrado' }, { status: 404 })
    }
    console.log(error)
    return NextResponse.json({ error: 'Error al eliminar autor' }, { status: 500 })
  }
}
