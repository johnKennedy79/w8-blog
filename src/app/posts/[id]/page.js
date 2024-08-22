import { db } from "@/lib/db";
import Link from "next/link";

export default async function PostDetail({ params }) {
  const post = await fetchPost(params.id);
  const comments = await fetchComments(params.id);

  async function fetchPost(id) {
    const result = await db.query(
      `
    SELECT 
      posts.id, 
      posts.post, 
      posts.timestamp, 
      users.name AS username, 
      categories.name AS category 
    FROM
      posts
    LEFT JOIN
      users ON posts.user_id = users.id
    LEFT JOIN
      categories ON posts.category_id = categories.id
    WHERE posts.id = $1
  `,
      [id]
    );

    return result.rows[0];
  }

  async function fetchComments(postId) {
    const result = await db.query(
      `
    SELECT comment, timestamp, id 
    FROM comments 
    WHERE post_id = $1
  `,
      [postId]
    );

    return result.rows;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{post.post}</h1>
      <p className="text-gray-600">
        Posted by {post.username} in {post.category}
      </p>

      <h2 className="mt-4 text-xl font-bold">Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} className="py-2 border-b">
            {comment.comment}{" "}
            <span className="text-gray-500">
              ({new Date(comment.timestamp).toLocaleString()})
            </span>
          </li>
        ))}
      </ul>
      <Link
        href={`/posts/${params.id}/comments/createComment`}
        className="inline-block px-4 py-2 mt-4 text-white bg-blue-500"
      >
        Add Comment
      </Link>
    </div>
  );
}
