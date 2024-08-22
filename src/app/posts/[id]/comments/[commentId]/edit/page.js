import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Edit Comment",
};

export async function editCommentAction(formData) {
  "use server";
  const commentId = formData.get("commentId");
  const commentText = formData.get("commentText");

  if (!commentId || !commentText) {
    throw new Error("Missing data");
  }

  await db.query(
    `
    UPDATE comments 
    SET comment = $1 
    WHERE id = $2
    `,
    [commentText, commentId]
  );

  const postId = formData.get("postId");
  redirect(`/posts/${postId}`);
}

export default async function EditComment({ params }) {
  const { commentId, postId } = params;
  const result = await db.query(
    `
    SELECT * FROM comments WHERE id = $1
  `,
    [commentId]
  );

  const comment = result.rows[0];

  return (
    <form action={editCommentAction} method="POST" className="p-4">
      <textarea
        name="commentText"
        placeholder="Edit your comment"
        className="w-full h-20 p-2 border"
        defaultValue={comment.comment}
        required
      />
      <input type="hidden" name="commentId" value={commentId} />
      <input type="hidden" name="postId" value={postId} />
      <button type="submit" className="px-4 py-2 mt-4 text-white bg-blue-500">
        Update Comment
      </button>
    </form>
  );
}
