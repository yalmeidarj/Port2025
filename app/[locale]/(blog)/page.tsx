import { getPosts } from '@/posts';
import { Posts } from '@/components/posts/Posts';

export default async function BlogIndex({ params }: { params: { locale: string } }) {
  const posts = await getPosts(params.locale);
  return (
    <div className="container mx-auto py-10">
      <Posts posts={posts} />
    </div>
  );
}
