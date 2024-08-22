import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create a Post",
};
export default async function CreatePost() {
  const result = await db.query(`SELECT * FROM categories`);
  const cats = result.rows;
  async function createPostAction(formData) {
    "use server";
    const postText = formData.get("postText");
    const categoryId = formData.get("categoryId");

    const { error } = await db.query(
      `
    INSERT INTO posts (post, category_id) 
    VALUES ($1, $2)
    RETURNING id
  `,
      [postText, categoryId]
    );

    if (error) throw new Error(error.message);
    redirect("/posts");
  }

  return (
    <form action={createPostAction} className="p-4">
      <textarea
        name="postText"
        placeholder="Post content"
        className="w-full p-2 border h-36"
        required
      />
      <select name="categoryId" className="mt-2" required>
        <option value="">Select Category</option>
        {cats.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <button className="px-4 py-2 mt-4 text-white bg-blue-500">
        Create Post
      </button>
    </form>
  );
}
