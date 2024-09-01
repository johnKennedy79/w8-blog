import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Edit Comment",
};

export default async function EditComment({ params }) {
  const userName = params.user;
  const userResult = await db.query(`SELECT * FROM users WHERE name = $1`, [
    userName,
  ]);
  const userId = userResult.rows[0].id;
  const postId = params.id;
  const commentId = params.commentId;
  const result = await db.query(
    `
    SELECT * FROM comments WHERE id = $1
  `,
    [commentId]
  );
  const comment = result.rows[0];
  console.log(comment);

  async function editCommentAction(formData) {
    "use server";
    const commentId = formData.get("commentId");
    const commentText = formData.get("commentText");
    const timestamp = formData.get("timestamp");
    const userId = formData.get("userId");
    const postId = formData.get("postId");
    console.log(formData);
    await db.query(
      `UPDATE comments 
      SET comment = $1, timestamp = $2, user_id = $3, post_id = $4
      WHERE id = $5
    `,
      [commentText, timestamp, userId, postId, commentId]
    );

    revalidatePath(`/login/${params.user}/posts/${params.id}`);
    redirect(`/login/${params.user}/posts/${params.id}`);
  }

  return (
    <div>
      <nav>
        <Link href={`/login/${params.user}/posts/${params.id}`}>
          Back to Post comments
        </Link>
      </nav>
      <form action={editCommentAction} className="p-4">
        <textarea
          name="commentText"
          placeholder="Edit your comment"
          className="w-full h-20 p-2 border"
          defaultValue={comment.comment}
          required
        />
        <input type="hidden" name="commentId" value={commentId} />
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="timestamp" value="Now()" />
        <input type="hidden" name="userId" value={userId} />
        <button className="px-4 py-2 mt-4 text-white bg-blue-500">
          Update Comment
        </button>
      </form>
    </div>
  );
}
