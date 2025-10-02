// app/api/revalidate/route.ts
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  const { slug, locale, scope } = await req.json();
  if (scope === 'post') revalidateTag(`post:${slug}:${locale}`);
  if (scope === 'list') revalidateTag(`posts:${locale}`);
  revalidatePath(`/${locale}/blog/${slug}`); // optional extra
  return Response.json({ ok: true });
}
