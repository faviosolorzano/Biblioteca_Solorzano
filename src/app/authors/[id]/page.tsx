import { AuthorDetail } from '@/components/author-detail'

export default async function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AuthorDetail id={id} />
}
