"use client";
import React, { Component } from 'react';
import styles from './signin.module.scss';
import { isMobile } from 'react-device-detect';
import toast from 'react-hot-toast';
import { getSession, SessionProvider, signIn, signOut } from "next-auth/react"
import ComicClient from '@/services/client/common/ClientServices/ComicClient';
import UserClient from '@/services/client/common/ClientServices/UserClient';
import CardContent from '@mui/material/CardContent';
// import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import Dropdown from '@/components/ClassComponents/Dropdown/Dropdown';
import CardHeader from '@mui/material/CardHeader/CardHeader';

class SignIn extends Component {

  productServ!: ComicClient
  userServ!: UserClient

  state = {
    isMobile: false,
    usetType:"User",
    roles: [
      { id: 2, label: 'User', value: 'user' },
      // { id: 1, label: 'Super Admin', value: 'superadmin' },
      { id: 1, label: 'Admin', value: 'admin' },
    ],
    "Super Admin": {
      type: "Super Admin",
      signType: 'Sign In',
      email: '',
      password: ''
    },
    Admin: {
      type: "Admin",
      signType: 'Sign In',
      email: '',
      password: ''
    },
    User: {
      type: "User",
      signType: 'Sign In',
      username: '',
      email: '',
      password: ''
    },

    desktopView: {
      admin: null,
      user: null
    }
  };




  constructor(props: {}) {
    super(props);
    this.userServ = new UserClient()

    // this.userServ.fetchRoleId('admin').then((adminRes:any)=>{ this.dataServ.userRolesData['admin'] = adminRes })
    // this.userServ.fetchRoleId('user').then((userRes:any)=>{ this.dataServ.userRolesData['user'] = userRes })

  }

  componentDidMount() {
    // this.setState({
    //   isMobile, desktopView: {
    //     admin: this.adminAndusercard("Admin"),
    //     user: this.adminAndusercard("User")
    //   }
    // })

    // Example role name passed to fetchRoleId
  }

  toggleSign(userType: string) {
    const state: any = this.state;
    let signType = state[userType].signType;
    console.log('signType => ', signType);
    let toggle = { true: 'Sign In', false: 'Sign Up' };
    signType = signType === toggle['true'] ? toggle['false'] : toggle['true'];
    this.setState({ [userType]: { ...state[userType], signType } }, () => {
      console.log('signType => ', signType);
    });
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, userType: string, type: string) => {
    const { value } = event.target;
    this.setState((prevState: any) => ({
      [userType]: { ...prevState[userType], [type]: value }
    }));
  };

  handleSubmit = async (event: React.FormEvent, userType: string) => {
    event.preventDefault();
    const value:any = event.target;
    

    const state: any = this.state;
    console.log(userType, " => ", state[userType], value.value)
    // const router = useRouter()
    // console.log(userType, " => ", state[userType]);
    // console.log("roles => ", this.dataServ.userRolesData)

    // router.push("/")



    if (state[userType].signType === 'Sign In') {
      const res = await signIn("credentials", {
        redirect: false,
        username: state[userType]['email'],
        password: state[userType]['password']
      })

      // signOut()
      // <SessionProvider> "next-auth/react"
      console.log(userType," response => ", res)

      if (res?.error) {
        console.log("error toast")
        toast("something went wrong", {
          icon: '⚠️',  // Optional icon for the warning
          style: {
            border: '1px solid orange',
            padding: '16px',
            color: 'orange',
          },
        });
      }
      else {
        // Fetch the user session after successful sign-in
        const session:any = await getSession();
        if (session) {
          // Now you have access to the user session
          const user = session.user; // Access user data here 
          console.log("user => ", user, session['userInfo'].roleName , userType, session)    
          // console.log("userDetails => ", localStorage.getItem('userDetails'))
         if(session['userInfo'].roleName === 'Super Admin' && userType === 'Super Admin')
         {
          // shalinisuperadmin@
          toast.success(`${userType} Loggedin successfully`)
          window.location.href = "admin"
         }
         else if(session['userInfo'].roleName === 'Admin' && userType === 'Admin')
          {
           toast.success(`${userType} Loggedin successfully`)
           localStorage.setItem("bonk-comic-hub-sign-userdata",JSON.stringify(session))
          }
         else if(session['userInfo'].roleName === 'User' && userType === 'User')
         {
          toast.success(`${userType} Loggedin successfully`)
          localStorage.setItem("bonk-comic-hub-sign-userdata",JSON.stringify(session))
          // window.location.href = "/"
         }
         else{
          
          toast(`you dont have access to ${userType}`, {
            icon: '⚠️',  // Optional icon for the warning
            style: {
              border: '1px solid orange',
              padding: '16px',
              color: 'orange',
            },
          });
         }
        }
        
        // shalinisuperadmin@
        // window.location.href = "admin"
        // router.push("/admin")
      }
    }
    else {

        const payload = {
          username: state[userType]['username'],
          email: state[userType]['email'],
          password: state[userType]['password'],
          accountStatus: "active"
        };
        this.CreatUser(payload, state, userType)
      }



    };

    async CreatUser(payload:any, state:any, userType:string) {
      (await this.userServ.createUser(payload)).subscribe({
        next: (res:any) => {
           console.log("insUserres => ", res)
          if (res.status === 200) {
            toast.success(`Register ${state[userType]['username']} user Successfully`);
          }
          else {
            toast(`something went wrong`, {
              icon: '⚠️',  // Optional icon for the warning
              style: {
                border: '1px solid orange',
                padding: '16px',
                color: 'orange',
              },
            });
          }
        },
        error: (err:any) => {
          console.error(err); // Handle error response
        },
        complete: () => {
          console.log('Completed'); // Handle completion
        }
      });
    }

    async test(payload:any) {
      (await this.userServ.createUser(payload)).subscribe({
        next: (res:any) => {
         
        },
        error: (err:any) => {
          console.error(err); // Handle error response
        },
        complete: () => {
          console.log('Completed'); // Handle completion
        }
      });
    }

    adminAndusercard(userType: string) {
      const state: any = this.state;
      const { signType, email, password, username } = state[userType];
      return (
        // ${this.state.isMobile === false ? styles['desktop-sc'] : ""}
        <div className={`${styles['signin-container']}  `}>
          <Card className={styles.card}>
            {/* <CardHeader> */}
              <h2 className={styles['signin-header']}>
                {signType === 'Sign In' ? `${userType} Sign In` : `${userType} Register`}
              </h2>
            {/* </CardHeader> */}
            <div className={styles['signin-content']}>
              <CardContent>
                <form style={{ width: '300px' }}
                  onSubmit={(event) => this.handleSubmit(event, userType)}>
                  {
                    (signType !== 'Sign In' && userType === 'User') &&
                    <div className={styles['input-group']}>
                      <label htmlFor={`${userType}-username`} className={styles.label}>
                        User Name
                      </label>
                      <input

                        type="text"
                        id={`${userType}-username`}
                        name={`${userType}-username`}
                        value={username}
                        onChange={(event) => this.handleInputChange(event, userType, 'username')}
                        className={styles.input}
                        required
                      />
                    </div>
                  }


                  <div className={styles['input-group']}>
                    <label htmlFor={`${userType}-email`} className={styles.label}>
                      Email
                    </label>
                    <input
                      type="email"
                      id={`${userType}-email`}
                      name={`${userType}-email`}
                      value={email}
                      onChange={(event) => this.handleInputChange(event, userType, 'email')}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles['input-group']}>
                    <label htmlFor={`${userType}-password`} className={styles.label}>
                      Password
                    </label>
                    <input
                      type="password"
                      id={`${userType}-password`}
                      name={`${userType}-password`}
                      value={password}
                      onChange={(event) => this.handleInputChange(event, userType, 'password')}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles['button-group']}>
                    <button type="submit" className={styles['signin-button']}>
                      {signType === 'Sign In' ? 'Sign In' : 'Sign Up'}
                    </button>
                  </div>
                  {
                    userType === "User" &&
                    <div className={styles['signup-here']}>
                      if you {signType === 'Sign In' ? 'are new please' : 'already have an account'}{' '}
                      <span onClick={() => this.toggleSign(userType)}>
                        {signType === 'Sign In' ? 'Sign Up' : 'Sign In'}
                      </span>{' '}
                      here
                    </div>
                  }

                </form>
              </CardContent>
            </div>
          </Card>
        </div>
      );
    }
    handleSelection = (selectedItem: any) => {
      let state:any = this.state
      state[state.usetType].email = ""
      state[state.usetType].password = ""
      state['usetType'] =  selectedItem.label
      this.setState(state)
      console.log("Selected Item:", selectedItem); // Handle the selected item
    };
    render() {
      const { usetType } = this.state
      const options = [
        { id: 1, label: 'User', value: 'user' },
        { id: 2, label: 'Super Admin', value: 'superadmin' },
        { id: 3, label: 'Admin', value: 'admin' },
      ];
      

      return (
        <div className={styles['admin-and-user-sign']}>
          <div className={styles['center-card']}>
            <div className={styles['roles-card']}>
              <Dropdown options={options} onSelect={(event) => this.handleSelection(event)} />
            </div>
            <div className={styles['signin-card']}>
              {this.adminAndusercard(usetType)}
            </div>
          </div>
        </div>
      );
    }
  }

export default SignIn;
