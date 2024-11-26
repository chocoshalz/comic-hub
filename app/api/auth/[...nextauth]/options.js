import { Session } from "inspector/promises";
// import { authenticateUser}

import NextAuth from "next-auth"
// import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
// import UserServer from "/UserServer";
import UserServer from "../../users/UserServer";
const userServ = new UserServer()
let userDetails
async function getDetailsByEmailId(emailId) 
{
 return await userServ.getUserByEmailId(emailId)
}

export const AuthOptions = {
    // Configure one or more authentication providers
    providers: [
    //   GithubProvider({
    //     clientId: process.env.GITHUB_ID,
    //     clientSecret: process.env.GITHUB_SECRET,
    //   }),
      CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "Email",
        // `credentials` is used to generate a form on the sign in page.
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          username: { label: "User Email", type: "email", placeholder: "deepu@gmail.com" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          let user = {
            //  id: "1", name: "Deepu", email: "ratnadeepdirsipam@gmail.com", password:'password@Deepu'
          }
          userDetails = await getDetailsByEmailId(credentials.username)

            console.log("credentials =>>> ", credentials, userDetails)
          // Add logic here to look up the user from the credentials supplied
         
          user = await userDetails.data//.userData[0]
         console.log(credentials, " userDetails => ", userDetails)
          // if(userDetails[0].status == 200)
          if ((user.email === credentials.username && user.password === credentials.password)) {
            // Any object returned will be saved in `user` property of the JWT
            return user
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null
    
            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        }
      })
    ],
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        return true
      },
      async redirect({ url, baseUrl }) {
        return baseUrl
      },
      async session({ session, user, token }) {
        const userDetail = await getDetailsByEmailId(session.user.email)
        // console.log("session, user, token => ",session, user, token)
        session['userInfo'] = await userDetail.data
        // session['userInfo'].roleName = await "User"
        return session
      },
      async jwt({ token, user, account, profile, isNewUser }) {
        // token['userInfo'] = userDetails.userData[0]
        return token
      }
  
    },
    secret: 'hello',
    pages:{
      signIn: "/signin"
    }
  }
  
  export default NextAuth(AuthOptions)