import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Add a Comment",
};

export async function addCommentAction(formData) {
  "use server";
  const commentText = formData.get("commentText");
  const postId = formData.get("postId");

  if (!commentText || !postId) {
    throw new Error("missing data");
  }

  await db.query(
    `
    INSERT INTO comments (comment, post_id) 
    VALUES ($1, $2)
    `,
    [commentText, postId]
  );

  redirect(`/posts`);
}

export default function AddComment({ params }) {
  return (
    <form action={addCommentAction} className="p-4">
      <textarea
        name="commentText"
        placeholder="Add your comment"
        className="w-full h-20 p-2 border"
        required
      />
      <input type="hidden" name="postId" value={params.id} />
      <button type="submit" className="px-4 py-2 mt-4 text-white bg-blue-500">
        Add Comment
      </button>
    </form>
  );
}
