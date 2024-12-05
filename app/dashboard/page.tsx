'use client'
import AdminDashboard from "@/components/ClassComponents/AdminDashboard/AdminDashboard";
import Comics from "@/components/ClassComponents/Comics/Comics";
import Products from "@/components/ClassComponents/Products/Products";
import { subjectService } from "@/services/client/common/ClientServices/SubjectService";
import { Component } from "react";

class Profile extends Component
{

    state={
        loading:true,
        userType:'Guest User',
        userInfo:{roleName:"Guest User"}
    }
    constructor(props:{})
    {
        super(props)
    }
    componentDidMount(): void {
        subjectService.setHeading({heading:"Dashboard"})
        this.handleAuth()
    }

    async handleAuth()
    {
      subjectService.getAuthData().subscribe((res:any)=>{ 
        console.log("header subject => ", res)
        this.setState({ userInfo: res , loading: false }); })
     
    }

    render() {
        const { loading, userType, userInfo } = this.state
        const user = userInfo
        const switchtype:string = !!user ? user?.roleName : "Guest User"  
        let content;
        switch(switchtype) {
            case 'Admin':
                content = <div>
                    <AdminDashboard></AdminDashboard>
                </div>;
                break;
            case 'User':
                content = <div>
                    <Comics></Comics>
                    {/* <Products></Products> */}
                </div>;
                break;
            case 'Guest User':
                content = <div>
                    <Comics></Comics>
                </div>;
                break;
            default:
                content = null//<div>Default View</div>;
        }
    
        return <div>
            {
                loading == true
                ? <div className='loading'> <div className='spinner'></div> </div>
                : <div>{content}</div>
            }
        </div>;
    }
    
}
export default Profile