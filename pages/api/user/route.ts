import { NextApiResponse } from "next"
import { NextResponse } from "next/server"
export async function GET()
{
 return NextResponse.json({
   "user":{
    name:"deepu"
   }
 })
}

// import { Request, Response } from "express";

// const userRoute = (req: Request, res: Response) => {
//   const { method } = req;

//   switch (method) {
//     case "GET":
//       res.json({ message: "GET: Fetched user data!" });
//       break;
//     case "POST":
//       res.json({ message: "POST: User created!" });
//       break;
//     case "PUT":
//       res.json({ message: "PUT: User updated!" });
//       break;
//     case "DELETE":
//       res.json({ message: "DELETE: User deleted!" });
//       break;
//     default:
//       res.status(405).json({ error: "Method Not Allowed" });
//   }
// };

// export default userRoute;
