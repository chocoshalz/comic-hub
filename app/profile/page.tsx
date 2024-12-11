'use client'
import { subjectService } from "@/services/client/common/ClientServices/SubjectService";
import "./profile.scss"
import { Component } from "react";
import ProfileClient from "@/services/client/common/ClientServices/ProfileClient";
import React from "react";
import { Button } from "@mui/material";
import { PutBlobResult } from "@vercel/blob";
import toast from "react-hot-toast";

interface State {
  profilePreview: File | null | string | undefined;
}

class Profile extends Component
{
    profileServ!:ProfileClient
    state={
        userInfo:{roleName:"Guest User"},
        profileCU:'create',
        profilePreview:"",
        profile:{
            profilePic:"",
            fullName: "",
            address: "",
            city: "",
            state: "",
            pinCode: "",
            phone: "",
            
        },
        errors: {},
    }
    fileInputRef:any
    constructor(props:{})
    {
        super(props)
        this.fileInputRef = React.createRef<HTMLInputElement>();
        this.profileServ = new ProfileClient()
    }

    componentDidMount(): void {
        subjectService.setHeading({heading:"Profile"})
        this.handleAuth()
    }

    async updateImage(file: File) {
      try {
        console.log("image blob => ", file);
    
        const response = await fetch(`/api/imageupload?filename=${file.name}`, {
          method: "PUT", // Change to PUT
          body: file, // Send the file directly as the body
        });
    
        if (!response.ok) {
          throw new Error("Failed to update image");
        }
    
        const updatedBlob = (await response.json()) as PutBlobResult;
        console.log("response => ", response, "updatedBlob => ", updatedBlob.url);
    
        // Update state or perform additional actions with the updated URL
        this.setState({ profilePreview: updatedBlob.url });
    
        // Optionally display a success message
        // toast.success("Image updated successfully");
      } catch (error) {
        console.error("Error updating image:", error);
        // Optionally display an error message
        // toast.error("Failed to update image");
      }
    }
    

    profilePreview:File | null | undefined | string
    handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
  
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        // this.setState({ profilePreview: previewUrl });
        console.log("profile => ", file, previewUrl);
        if(!!this.state.profilePreview)
        {
          this.updateImage(file);
        }
        else{
          this.uploadImage(file);
        }
        
      }
    };

    // https://1hey79cgcukhbvk4.public.blob.vercel-storage.com/flash-piZSMh8KLuvUq1KNBUAJIOdlZg4PBn.jpg
    async uploadImage(file: File) {
      try {
        console.log("image blob => ", file);
  
        const response = await fetch(`/api/imageupload?filename=${file.name}`, {
          method: "POST",
          body: file,
        });
  
        if (!response.ok) {
          throw new Error("Failed to upload image");
        }
        else
        {
          // toast.success("")
        }
  
        const newBlob = (await response.json()) as PutBlobResult;
        console.log("response => ", response, "newBlob => ", newBlob.url);
  
        this.setState({ profilePreview: newBlob.url });
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    async DeleteProfile()
    {
      // 
      this.removeProfilePic(this.state.profilePreview).then(()=>{
        console.log("deleted methed call")
      })
    }

    async removeProfilePic(url:string)
    {
      try {
        const response = await fetch(`/api/imageupload?filename=${url}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          // toast.success('File deleted successfully')
          this.setState({profilePreview : null})
          console.log('File deleted successfully');
          // if (blob?.url === url) {
          //   setBlob(null); // Clear the blob state if the deleted file matches the uploaded one
          // }
        } else {
          console.log('Failed to delete file');
        }
      } catch (error) {
        console.error('Error deleting file:', error);
        alert('Error deleting file');
      }
    }

    profileData:any 
    createUpdatebtn:boolean = false
    async handleAuth()
    {
        console.log("profile => ")
    subjectService.getAuthData().subscribe((res:any)=>{ 
        let profile:any = this.state.profile
        profile['fullName'] = res.username
        this.setState({ userInfo: res , loading: false, profile }); 
       
        this.profileServ.getProfileById(res.id).subscribe((pro:any)=>{
            console.log("profile => ", pro)
            if(pro.status === 200){ this.createUpdatebtn = true }
            if(pro.status === 200 && pro.message !== 'Profile not found')
            {
                
                this.profileData = pro.data
                this.setState({
                  profileCU:'update',
                  profilePreview: pro.data.profilepic,
                  profile:{
                    fullName: pro.data.fullName,
                    address: pro.data.address,
                    city: pro.data.city,
                    state: pro.data.state,
                    pinCode: pro.data.pinCode,
                    phone: pro.data.phone,
                    
                }}, ()=>{
                    console.log("profile data => ", this.state.profile)
                })
            }
            else
            {
              this.setState({ profileCU:'create'})
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
        payload['profilepic'] = this.state.profilePreview
        delete payload.profilePreview
        if(this.state.profileCU === 'create')
        {
          this.profileServ.createProfile(payload).subscribe((res:any)=>{
            console.log("res => ", res)
        })
        }
        else
        {
          console.log("this.profileData => ",this.profileData)
          this.profileServ.updateProfile(this.profileData.id,payload).subscribe((res:any)=>{
            console.log("res => ", res)

        })
        }
        
        // Add logic for form submission here
      };
    
      render() {
        const { profile } = this.state;
    
        return (
          <div className="profile-form-container">
            {/* <h2>Profile Form</h2> */}
            <form onSubmit={this.handleSubmit} className="profile-form">
              <div className="form-group">
                <div className="propic-fullname">
                  <div className="pro-pic-container">
                    {/* , backgroundRepeat: 'no-repeat', backgroundSize: 'cover' */}
                    <div className="profilePic" style={{backgroundImage:`url(${!!this.state.profilePreview ? this.state.profilePreview : "/assets/images/profile/user.png"})`}}>
                    
                    <div className="edit-pro-pic">
                      {/* <div className="epp-img"><img src={"/assets/images/profile/pencil.png"}/></div> */}
                      {
                        !this.state.profilePreview &&
                        <div className="epp-text">
                      <Button component="label" className="pro-add-edit" >
                      <input
                        ref={this.fileInputRef}
                        id="handleupdateimage"
                        className="handleupdateimageC"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={this.handleImageUpload}
                      />
                       {!!this.state.profilePreview ? 'edit' : 'add'}
                    </Button>
                       
                      </div>
                      }
                      
                    </div>
                    </div>
                    <div>
                      {
                        !!this.state.profilePreview &&
                        <div className="remove-pro-pic" ><img onClick={()=> this.DeleteProfile()} src={"/assets/images/profile/remove.png"}></img></div>
                      }
                    </div>
                  </div>
                  <div>
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
                </div>
                
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  style={{resize:'none'}}
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
              <button type="submit" className="submit-button" disabled={!this.createUpdatebtn}>
                {this.state.profileCU}
              </button>
            </form>
          </div>
        );
      }
    }
      

export default Profile