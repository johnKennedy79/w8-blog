import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Edit Post",
};

export default async function EditPost({ params }) {
  const postId = params.id;
  const result = await db.query(`SELECT * FROM posts WHERE id = $1`, [postId]);
  const post = result.rows[0];

  const catresult = await db.query(`SELECT * FROM categories`);
  const cats = catresult.rows;

  async function editPostAction(formData) {
    "use server";
    const postId = formData.get("postId");
    const postText = formData.get("postText");
    const categoryId = formData.get("categoryId");

    if (!postId || !postText || !categoryId) {
      throw new Error("Missing data");
    }

    await db.query(
      `
    UPDATE posts 
    SET post = $1, category_id = $2 
    WHERE id = $3
    `,
      [postText, categoryId, postId]
    );

    redirect(`/posts/${postId}`);
  }

  return (
    <form action={editPostAction} className="p-4">
      <textarea
        name="postText"
        placeholder="Edit your post"
        className="w-full p-2 border h-36"
        defaultValue={post.post}
        required
      />
      <input type="hidden" name="postId" value={postId} />
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
      <button type="submit" className="px-4 py-2 mt-4 text-white bg-blue-500">
        Update Post
      </button>
    </form>
  );
}
