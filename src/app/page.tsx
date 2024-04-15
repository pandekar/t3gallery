import Link from "next/link";
import { db } from "~/server/db";

const mockUrls = [
  "https://utfs.io/f/f33d4818-345d-47df-88cf-fb201d7676aa-i18tyo.jpg",
  "https://utfs.io/f/ca22c4a7-b79e-4cc9-9609-20622819880f-i18typ.jpg",
  "https://utfs.io/f/49ac8147-6c66-4e84-928b-237d31510e12-i18tyq.jpg"
];

const mockImages = mockUrls.map((url, index) => ({
  id: index + 1,
  url
}))

export default async function HomePage() {
  const posts = await db.query.posts.findMany()

  console.log('posts', posts)

  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex w-48 items-center justify-center"
            ><p>{post.name}</p></div>
        ))}
        {[...mockImages, ...mockImages, ...mockImages, ...mockImages].map((image, index) => (
          <div key={image.id + "-" + index} className="w-48">
            <img src={image.url} />
          </div>
        ))}
      </div>
    </main>
  );
}
