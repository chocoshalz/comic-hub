import React, { Component } from "react";
import "./SignReg.scss";
import Box from "@mui/material/Box";
import { getSession, signIn } from "next-auth/react";
import TextField from "@mui/material/TextField";
import toast from "react-hot-toast";
import UserClient from "@/services/client/common/ClientServices/UserClient";
import RoleClient from "@/services/client/common/ClientServices/RoleClient";

interface SignRegProps {
  onChildAction: (data: any) => void;
  changeheading?: (heading: string) => void;
}

interface SignRegState {
  roles:any,
  signUp:boolean,
  userType: string;
  signType: string;
  username: string;
  email: string;
  password: string;
}

class SignReg extends Component<SignRegProps, SignRegState> {
  userServ!: UserClient;
  roleService!:RoleClient
  state = {
    roles:[],
    signUp:true,
    userType: "User",
    signType: "Sign In",
    username: "",
    email: "",
    password: "",
  };
  constructor(props: SignRegProps) {
    super(props);
    this.userServ = new UserClient();
    this.roleService = new RoleClient()
  }

  componentDidMount(): void {
    this.getAllRoles()
  }

  getAllRoles()
  {
    this.roleService.getAllRoles().subscribe((res:any)=>{
      this.setState({roles:res.roles})
      console.log("get all roles => ", res)
    })
  }

  triggerParentMethod = () => {
    const { username, password } = this.state;
    this.props.onChildAction({ modal: "close", username, password, success:false });
  };

  changeHeading = (heading: string) => {
    if (this.props.changeheading) {
      this.props.changeheading(heading);
    }
  };

  toggleUser = () => {
    this.setState({ signUp:true, userType: "User" });
  };

  toggleAdmin = () => {
    this.userServ.getSpecificUsers("Admin").subscribe((res)=>{
      console.log("res => ", res)
      this.setState({ userType: "Admin", signType: "Sign In", signUp:res.users.length === 0 ? true : false, });
    })
    
  };

  toggleSign = () => {
    const { signType } = this.state;
    const nextSignType = signType === "Sign In" ? "Sign Up" : "Sign In";
    this.setState({ signType: nextSignType }, () => {
      this.changeHeading(nextSignType === "Sign In" ? "Sign In" : "Register");
    });
  };

  createAdminUser()
  {
    const { signType, userType, username, email, password } = this.state
    const role:any = this.state.roles[0]
    console.log("role => ", role)
    if(role.roleName === "Admin")
    {
      const payload = { username: username, email: email, password: password, accountStatus: "active" };
      this.userServ.createAdmin(payload).subscribe((res:any)=>{
        this.props.onChildAction({ modal: "close",success:true });
        toast.success(res.message)
      })
    }
  }

  toast = (message: string, type: string) => {
    type === "success"
      ? toast.success(message)
      : toast(message, {
          icon: "⚠️",
          style: {
            border: "1px solid orange",
            padding: "16px",
            color: "orange",
          },
        });
  };

  handleInputs = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    this.setState({ [field]: event.target.value } as unknown as SignRegState);
  };

  handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { signType, userType, username, email, password } = this.state
    if (signType === 'Sign In') {
        const res = await signIn("credentials", { redirect: false, username: email, password: password })

        if (res?.error) { this.toast("something went wrong","warn") }
        else {
          // Fetch the user session after successful sign-in
          const session:any = await getSession();
          if (session) {
            // Now you have access to the user session
            const user = session.user; // Access user data here 
            if(session['userInfo'].roleName === 'Admin' && userType === 'Admin'){ 
                await localStorage.setItem("bonk-comic-hub-sign-userdata",JSON.stringify(session)) 
                await toast.success(`${userType} Loggedin successfully`);
                await this.props.onChildAction({ modal: "close", username, password, success:true  });
                location.href = "/"
            }
            else if(session['userInfo'].roleName === 'User' && userType === 'User'){ 
                await localStorage.setItem("bonk-comic-hub-sign-userdata",JSON.stringify(session))
                await toast.success(`${userType} Loggedin successfully`); 
                await this.props.onChildAction({ modal: "close", username, password,success:true });
                location.href = "/"
                // window.location.href = "/"
           }
           else{
            this.toast(`you dont have access to ${userType}`, 'warn')
           }
          }
        }
      }
      else {
  
          const payload = {
            username: username,
            email: email,
            password: password,
            accountStatus: "active"
          };
          if(userType === "User")
          {
            this.CreatUser(payload, userType, username)
          }
          else if(userType === "Admin")
          {
            this.createAdminUser()
          }
        }
  };

  async CreatUser(payload: any, userType: string, username: string) {
    (await this.userServ.createUser(payload)).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
        this.props.onChildAction({ modal: "close",success:true });
        // `Registered ${username} successfully`
          toast.success(res.message);
        } else {
          this.toast(res.message, "warn");
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        console.log("Completed");
      },
    });
  }

  render() {
    const { userType, signType, username, email, password, signUp } = this.state;

    return (
      <div className="signin-register-root-class">
        {/* user and admin */}
        <div className="signin-register">
          <div className="signin" style={{ borderBottom: userType === "User" ? "2px solid gray" : "2px solid transparent", }} onClick={this.toggleUser}>
            User
          </div>
          <div className="register" style={{ borderBottom: userType === "Admin" ? "2px solid gray" : "2px solid transparent", }} onClick={this.toggleAdmin} >
            Admin
          </div>
        </div>

        <div className="signin-register-content">
          <Box className="container" component="div" sx={{ "& > :not(style)": { m: 1, width: "100%" } }} >
            <form className="signin-form" onSubmit={this.handleSubmit}>
              {signType === "Sign Up" && (
                <div className="username">
                  <TextField fullWidth name="username" value={username} onChange={(event:any) => this.handleInputs(event, "username")} id="outlined-username" label="User Name" variant="outlined" required/>
                </div>
              )}

              <div className="email">
                <TextField fullWidth name="email" value={email} onChange={(event:any) => this.handleInputs(event, "email")} id="outlined-email" label="Email" variant="outlined" required />
              </div>

              <div className="password">
                <TextField fullWidth  name="password"  value={password}  onChange={(event:any) => this.handleInputs(event, "password")}  id="outlined-password"  label="Password"  type="password"  variant="outlined"    required  />
              </div>

              <div className="submit">
                <button type="submit" className="submit-button">
                  Submit
                </button>
              </div>
            </form>
            {signUp === true && (
              <div className="already-have-account">
                If you{" "} {signType === "Sign In" ? "are new, please " : "already have an account, please "}
                <span onClick={this.toggleSign}>
                  {signType === "Sign In" ? "Sign Up" : "Sign In"}
                </span>{" "}
                here.
              </div>
            )}
          </Box>
        </div>
      </div>
    );
  }
}

export default SignReg;
