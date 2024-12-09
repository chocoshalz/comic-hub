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
        
