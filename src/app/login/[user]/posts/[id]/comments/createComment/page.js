import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export const metadata = {
  title: "Add a Comment",
};

export default async function AddComment({ params }) {
  const userResult = await db.query(`SELECT * FROM users WHERE name = $1`, [
    params.user,
  ]);

  const userId = userResult.rows;

  async function addCommentAction(formData) {
    "use server";
    const commentText = formData.get("commentText");
    const timestamp = formData.get("timestamp");
    const userId = formData.get("userId");
    const postId = formData.get("postId");

    await db.query(
      `
    INSERT INTO comments (comment, timestamp, user_id, post_id) 
    VALUES ($1, $2, $3, $4)
    `,
      [commentText, timestamp, userId, postId]
    );
    revalidatePath(`/login/${params.user}/posts/${postId}`);
    redirect(`/login/${params.user}/posts/${postId}`);
  }

  return (
    <div className="h-screen w-screen bg-[#f8f2bf] flex flex-col items-center ">
      <nav>
        <Link
          href={`/login/${params.user}/posts/${params.id}`}
          className="text-gray-600  mt-4 hover:text-[#dd15cc] hover:cursor:pointer"
        >
          Back to Post comments
        </Link>
      </nav>
      <form action={addCommentAction} className="p-4">
        <textarea
          name="commentText"
          placeholder="Add your comment"
          className="w-full h-20 p-2 border"
          required
        />
        <input type="hidden" name="postId" value={params.id} />
        <input type="hidden" name="userId" value={userId[0].id} />
        <input type="hidden" name="timestanmp" value="now()" />
        <button className=" ml-8 border-double border-[#cd950c] border-8 outline-8 h-fit w-fit p-4 bg-[#002349] text-[#cd950c] text-2xl">
          Add Comment
        </button>
      </form>
    </div>
  );
}
