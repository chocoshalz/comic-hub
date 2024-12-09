import { getSession } from "next-auth/react";

class AuthClient{
    userInfo:any

    constructor()
    {
        // this.handleAuth()
    }
    async handleAuth()
    {
        const sessionData = await getSession();
        console.log("global loggen user data => ", sessionData)
        this.userInfo = await sessionData
    }

    async getUserData()
    {
        return await this.userInfo
    }
}

export default AuthClient