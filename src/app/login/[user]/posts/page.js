import { db } from "@/lib/db";
import Link from "next/link";

export const metadata = {
  title: "Posts",
  discription: "view all posts",
};

export default async function Posts({ params, searchParams }) {
  const sort = searchParams.sort === "desc" ? "DESC" : "ASC";

  const result = await db.query(`
      SELECT 
        posts.id, 
        posts.post, 
        posts.timestamp, 
        users.name AS username, 
        categories.name AS category, 
        categories.colour AS category_colour
      FROM
        posts
      LEFT JOIN
        users ON posts.user_id = users.id
      LEFT JOIN
        categories ON posts.category_id = categories.id
      ORDER BY posts.timestamp ${sort}
    `);

  const posts = result.rows;

  return (
    <div className="h-screen w-screen bg-[#f8f2bf] flex flex-col items-center ">
      <div className="flex justify-between w-11/12 mb-4 sort">
        <Link
          href={`/login/${params.user}/posts?sort=asc`}
          className="mr-4 hover:text-[#dd15cc] hover:cursor:pointer"
        >
          Sort ascending
        </Link>
        <Link
          href={`/login/${params.user}/posts?sort=desc`}
          className="ml-4 hover:text-[#dd15cc] hover:cursor:pointer"
        >
          Sort descending
        </Link>
        <Link
          href={`/login/${params.user}/posts/createPost`}
          className="border-double border-[#cd950c] border-8 outline-8 h-fit w-fit p-4 bg-[#002349] text-[#cd950c] text-2xl"
        >
          Create Post
        </Link>
      </div>
      {posts.map((post) => {
        const jsonDate = new Date(post.timestamp);
        const formattedDate = jsonDate.toLocaleDateString();
        const formattedTime = jsonDate.toLocaleTimeString();

        return (
          <div key={post.id} className="w-3/4 pb-4 border-b">
            <h2
              className="text-lg font-bold"
              style={{ backgroundColor: `${post.category_colour}` }}
            >
              {post.post}
            </h2>
            <p className="text-gray-600">
              Posted by {post.username} on {formattedDate} at {formattedTime}
            </p>
            <p className="text-gray-600">Category: {post.category}</p>
            <Link
              href={`/login/${params.user}/posts/${post.id}`}
              className="mr-4 hover:text-[#dd15cc] hover:cursor:pointer"
            >
              View Comments
            </Link>
          </div>
        );
      })}
    </div>
  );
}
