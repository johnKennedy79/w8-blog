import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create a new account",
};

export default async function SignupPage() {
  async function handleSignup(formData) {
    "use server";
    console.log("form submited");
    const name = formData.get("name");
    const password = formData.get("password");
    await db.query(`INSERT INTO users (name, password) VALUES ($1, $2)`, [
      name,
      password,
    ]);
    revalidatePath("/");
    redirect("/");
  }
  return (
    <div className="h-screen w-screen bg-[#f8f2bf] flex justify-center items-center">
      <form
        action={handleSignup}
        className="border-double border-[#cd950c] h-3/5 w-2/3 border-8 outline-8 flex flex-col justify-evenly items-center"
      >
        <label for="name" className="text-[#8b6508] text-2xl">
          User Name
        </label>
        <input
          className="text-[#8b6508] text-1xl border-solid border-[#cd950c] border-2 w-56 bg-[#e8e5c3]"
          name="name"
          placeholder="Add a user name here.."
          required
        ></input>
        <label for="password" className="text-[#8b6508] text-2xl text-center">
          Your password must contain at least one number and one uppercase and
          lowercase letter, and at between 8 & 15 characters.
        </label>
        <input
          className="text-[#8b6508] text-1xl border-solid border-[#cd950c] border-2 w-56 bg-[#e8e5c3]"
          name="password"
          placeholder="Create a password..."
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}"
          required
        ></input>
        <button className="border-double border-[#cd950c] border-8 outline-8 h-fit w-fit p-4 bg-[#002349] text-[#cd950c] text-2xl">
          Create A New Account
        </button>
      </form>
    </div>
  );
}
