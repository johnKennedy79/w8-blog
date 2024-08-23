import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export const metadata = {
  title: "Edit Post",
};

export default async function EditPost({ params }) {
  const userName = params.user;
  const userResult = await db.query(`SELECT * FROM users WHERE name = $1`, [
    userName,
  ]);
  const userId = userResult.rows[0].id;

  const postId = params.id;
  const result = await db.query(`SELECT * FROM posts WHERE id = $1`, [postId]);
  const post = result.rows[0];

  const catresult = await db.query(`SELECT * FROM categories`);
  const cats = catresult.rows;

  async function editPostAction(formData) {
    "use server";
    const postId = formData.get("postId");
    const postText = formData.get("postText");
    const timestamp = formData.get("timestamp");
    const categoryId = formData.get("categoryId");
    const userId = formData.get("userId");

    await db.query(
      `
    UPDATE posts 
    SET post = $1, timestamp = $2, category_id = $3, user_id = $4 
    WHERE id = $5
    `,
      [postText, timestamp, categoryId, userId, postId]
    );
    revalidatePath(`/login/${params.user}/posts/${postId}`);
    redirect(`/login/${params.user}/posts/${postId}`);
  }

  return (
    <div>
      <nav>
        <Link href={`/login/${params.user}/posts`}>Back to Posts</Link>
      </nav>
      <form action={editPostAction} className="p-4">
        <textarea
          name="postText"
          placeholder="Edit your post"
          className="w-full p-2 border h-36"
          defaultValue={post.post}
          required
        />
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="timestamp" value="Now()" />
        <select
          name="categoryId"
          defaultValue={post.category_id}
          className="mt-2"
        >
          <option value="">Select Category</option>
          {cats.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button className="px-4 py-2 mt-4 text-white bg-blue-500">
          Update Post
        </button>
      </form>
    </div>
  );
}
