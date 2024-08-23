import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const metadata = {
  title: "login page",
  discription: "login to your posts page",
};

export default function Login() {
  async function handleLogin(formData) {
    "use server";
    console.log("loging in");

    const name = formData.get("name");
    const password = formData.get("password");

    const result = await db.query(`SELECT * FROM users WHERE name = $1`, [
      name,
    ]);
    const user = result.rows[0].name;
    const checkPassword = result.rows[0].password;
    console.log(user);
    console.log(checkPassword);
    if (user && checkPassword === password) {
      redirect(`/login/${user}/posts`);
    } else {
      redirect("/signup");
    }
  }
  return (
    <div className="h-screen w-screen bg-[#f8f2bf] flex justify-center items-center">
      <form
        action={handleLogin}
        className="border-double border-[#cd950c] h-3/5 w-2/3 border-8 outline-8 flex flex-col justify-evenly items-center"
      >
        <label for="name" className="text-[#8b6508] text-2xl">
          User Name
        </label>
        <input
          className="text-[#8b6508] text-2xl border-solid border-[#cd950c] border-2 w-56 bg-[#e8e5c3]"
          name="name"
          placeholder="Add a user name here.."
          required
        ></input>
        <label for="password" className="text-[#8b6508] text-2xl text-center">
          Your password must contain at least one number and one uppercase and
          lowercase letter, and at between 8 & 15 characters.
        </label>
        <input
          className="text-[#8b6508] text-2xl border-solid border-[#cd950c] border-2 w-56 bg-[#e8e5c3]"
          name="password"
          placeholder="Create a password..."
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}"
          required
        ></input>
        <button className="border-double border-[#cd950c] border-8 outline-8 h-20 w-32 bg-[#002349] text-[#cd950c] text-2xl">
          Login
        </button>
      </form>
    </div>
  );
}
