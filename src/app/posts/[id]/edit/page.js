import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function EditPost({ params }) {
  const post = await fetchPost(params.id);

  async function fetchPost(id) {
    const { data } = await db.query(`SELECT * FROM posts`);

    supabase.from("posts").select("*").eq("id", id).single();
    return data;
  }

  async function updatePostAction(formData, id) {
    const postText = formData.get("postText");
    const categoryId = formData.get("categoryId");

    const { error } = await supabase
      .from("posts")
      .update({ post: postText, category_id: categoryId })
      .eq("id", id);

    if (error) throw new Error(error.message);

    redirect("/posts");
  }

  return (
    <form
      action={(formData) => updatePostAction(formData, params.id)}
      method="POST"
      className="p-4"
    >
      <textarea
        name="postText"
        defaultValue={post.post}
        className="w-full p-2 border h-36"
        required
      />
      <select name="categoryId" className="mt-2" required>
        <option value={post.category_id}>
          Current Category - {post.category_id}
        </option>
        <option value="1">Category 1</option>
        <option value="2">Category 2</option>
      </select>
      <button type="submit" className="px-4 py-2 mt-4 text-white bg-blue-500">
        Update Post
      </button>
    </form>
  );
}
