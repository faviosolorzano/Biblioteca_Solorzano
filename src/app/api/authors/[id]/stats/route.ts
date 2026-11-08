import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const author = await prisma.author.findUnique({ where: { id }, include: { books: true } })
    if (!author) return NextResponse.json({ error: 'Autor no encontrado' }, { status: 404 })
    const dated = author.books.filter(b => b.publishedYear !== null).sort((a, b) => a.publishedYear! - b.publishedYear!)
    const paged = author.books.filter(b => b.pages !== null).sort((a, b) => a.pages! - b.pages!)
    const first = dated[0]
    const latest = dated[dated.length - 1]
    const shortest = paged[0]
    const longest = paged[paged.length - 1]
    return NextResponse.json({
      authorId: author.id,
      authorName: author.name,
      totalBooks: author.books.length,
      firstBook: first ? { title: first.title, year: first.publishedYear } : null,
      latestBook: latest ? { title: latest.title, year: latest.publishedYear } : null,
      averagePages: paged.length ? Math.round(paged.reduce((sum, b) => sum + b.pages!, 0) / paged.length * 100) / 100 : 0,
      genres: [...new Set(author.books.map(b => b.genre).filter((g): g is string => !!g))].sort(),
      longestBook: longest ? { title: longest.title, pages: longest.pages } : null,
      shortestBook: shortest ? { title: shortest.title, pages: shortest.pages } : null,
    })
  } catch (error) {
    console.error('Error al obtener estadísticas', error)
    return NextResponse.json({ error: 'Error al obtener estadísticas del autor' }, { status: 500 })
  }
}
