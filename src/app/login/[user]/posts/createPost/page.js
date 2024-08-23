import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export const metadata = {
  title: "Create a Post",
};
export default async function CreatePost({ params }) {
  const userResult = await db.query(`SELECT * FROM users WHERE name = $1`, [
    params.user,
  ]);

  const userId = userResult.rows;

  const catResult = await db.query(`SELECT * FROM categories`);
  const cats = catResult.rows;

  async function createPostAction(formData) {
    "use server";
    const postText = formData.get("postText");
    const timestamp = formData.get("timestamp");
    const categoryId = formData.get("categoryId");
    const userId = formData.get("userId");
    console.log(categoryId);
    await db.query(
      `
    INSERT INTO posts (post, timestamp, user_id, category_id) 
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `,
      [postText, timestamp, categoryId, userId]
    );
    revalidatePath(`/login/${params.user}/posts`);
    redirect(`/login/${params.user}/posts`);
  }

  return (
    <div>
      <nav>
        <Link href={`/login/${params.user}/posts`}>Back to Posts</Link>
      </nav>
      <form action={createPostAction} className="p-4">
        <textarea
          name="postText"
          placeholder="Post content"
          className="w-full p-2 border h-36"
          required
        />
        <input type="hidden" name="timestamp" value="Now()" />
        <select name="categoryId" className="mt-2" required>
          <option value="">Select Category</option>
          {cats.map((cat) => (
            <option key={cat.id} value={cat.id} name="categoryId">
              {cat.name}
            </option>
          ))}
        </select>
        <input type="hidden" name="userId" value={userId[0].id} />
        <button className="px-4 py-2 mt-4 text-white bg-blue-500">
          Create Post
        </button>
      </form>
    </div>
  );
}
