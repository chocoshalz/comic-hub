'use client'
import { subjectService } from "@/services/client/common/ClientServices/SubjectService";
import "./profile.scss"
import { Component } from "react";
import ProfileClient from "@/services/client/common/ClientServices/ProfileClient";

class Profile extends Component
{
    profileServ!:ProfileClient
    state={
        userInfo:{roleName:"Guest User"},
        profile:{
            fullName: "",
            address: "",
            city: "",
            state: "",
            pinCode: "",
            phone: ""
        }
    }

    constructor(props:{})
    {
        super(props)
        this.profileServ = new ProfileClient()
    }

    componentDidMount(): void {
        subjectService.setHeading({heading:"Profile"})
        this.handleAuth()
    }



    async handleAuth()
    {
        console.log("profile => ")
    subjectService.getAuthData().subscribe((res:any)=>{ 
        let profile:any = this.state.profile
        profile['fullName'] = res.username
        this.setState({ userInfo: res , loading: false, profile }); 
       
        this.profileServ.getProfileById(res.id).subscribe((pro:any)=>{
            console.log("profile => ", pro)
            if(pro.status === 200 && pro.message !== 'Profile not found')
            {
                this.setState({profile:{
                    fullName: pro.data.fullName,
                    address: pro.data.address,
                    city: pro.data.city,
                    state: pro.data.state,
                    pinCode: pro.data.pinCode,
                    phone: pro.data.phone
                }}, ()=>{
                    console.log("profile data => ", this.state.profile)
                })
            }
        })
    })
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        this.setState((prevState:any) => ({
          profile: {
            ...prevState.profile,
            [name]: value,
          },
        }));
      };
    
      handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted: ", this.state.profile);
        const user:any = this.state.userInfo
        let payload:any = this.state.profile
        payload['userId'] = user.id
        this.profileServ.createProfile(payload).subscribe((res:any)=>{
            console.log("res => ", res)
        })
        // Add logic for form submission here
      };
    
      render() {
        const { profile } = this.state;
    
        return (
          <div className="profile-form-container">
            {/* <h2>Profile Form</h2> */}
            <form onSubmit={this.handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={this.handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={this.handleChange}
                  placeholder="Enter address"
                  required
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={this.handleChange}
                  placeholder="Enter city"
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={profile.state}
                  onChange={this.handleChange}
                  placeholder="Enter state"
                  required
                />
              </div>
              <div className="form-group">
                <label>Pin Code</label>
                <input
                  type="text"
                  name="pinCode"
                  value={profile.pinCode}
                  onChange={this.handleChange}
                  placeholder="Enter pin code"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={this.handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Submit
              </button>
            </form>
          </div>
        );
      }
    }
      

export default Profile