import { db } from "@/lib/db";
import Link from "next/link";

export const metadata = {
  title: "comments",
  discription: "view all comments for this post",
};

export default async function PostDetail({ params }) {
  const postId = params.id;
  const postResult = await db.query(
    `
    SELECT 
      posts.id, 
      posts.post, 
      posts.timestamp, 
      users.name AS username, 
      categories.name AS category,
      categories.colour AS colour 
    FROM
      posts
    LEFT JOIN
      users ON posts.user_id = users.id
    LEFT JOIN
      categories ON posts.category_id = categories.id
    WHERE posts.id = $1
  `,
    [postId]
  );
  const post = postResult.rows[0];

  const result = await db.query(
    `
    SELECT comment, timestamp, id 
    FROM comments 
    WHERE post_id = $1
  `,
    [postId]
  );
  const comments = result.rows;

  return (
    <div className="h-screen w-screen bg-[#f8f2bf] flex flex-col items-center ">
      <nav>
        <Link
          href={`/login/${params.user}/posts`}
          className="text-gray-600 hover:text-[#dd15cc] hover:cursor:pointer"
        >
          Back to Posts
        </Link>
      </nav>
      <div>
        <h1
          className="text-lg font-bold"
          style={{ backgroundColor: `${post.colour}` }}
        >
          {post.post}
        </h1>
        <p className="text-gray-600">
          Posted by {post.username} in {post.category}
        </p>
        <Link
          href={`/login/${params.user}/posts/${params.id}/edit`}
          className="text-gray-600 hover:text-[#dd15cc] hover:cursor:pointer"
        >
          Edit
        </Link>
      </div>
      <h2 className="mt-4 text-xl font-bold">Comments</h2>
      <ul className="flex flex-col w3/4">
        {comments.map((comment) => (
          <li key={comment.id} className="flex flex-col w3/4">
            {comment.comment}
            <span className="w3/4 text=gray-600">
              ({new Date(comment.timestamp).toLocaleString()})
              <nav>
                <Link
                  href={`/login/${params.user}/posts/${params.id}/comments/${comment.id}/edit`}
                  className=" hover:text-[#dd15cc] hover:cursor:pointer"
                >
                  Edit
                </Link>
              </nav>
            </span>
          </li>
        ))}
      </ul>
      <Link
        href={`/login/${params.user}/posts/${params.id}/comments/createComment`}
        className="border-double border-[#cd950c] border-8 outline-8 h-fit w-fit p-4 bg-[#002349] text-[#cd950c] text-2xl"
      >
        Add Comment
      </Link>
    </div>
  );
}
