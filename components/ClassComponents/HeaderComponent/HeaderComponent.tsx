'use client'
import './HeaderComponent.scss';
import React, { Component } from 'react'; // React - https://reactjs.org/
import { signOut } from 'next-auth/react';
import { Modal } from "react-bootstrap";
import AuthClient from '@/services/client/common/ClientServices/authserviceClient';
import { AppBar, Toolbar, Typography, Menu, MenuItem, IconButton, MenuList } from '@mui/material'; // Material UI - https://mui.com/
import MenuIcon from '@mui/icons-material/Menu'; // Material UI Icons - https://mui.com/components/icons/
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { subjectService } from '@/services/client/common/ClientServices/SubjectService';
import Link from 'next/link'; // Next.js Link - https://nextjs.org/docs/api-reference/next/link
import SignReg from '../SignReg/SignReg';
import withRouter from '@/components/routing/withRouter';
interface HeaderComponentState {
  anchorEl: null | HTMLElement;
  menuOpen: boolean;
  router:any
}


class HeaderComponent extends Component<HeaderComponentState> 
{
  subService:any = subjectService
  authService!:AuthClient
  state={
    isModalOpen:false,
    heading:{heading:"Dahboard"},
    modalHeading:'Sign In',
    userInfo:{roleName:"Guest User"},
    loading:true,
    anchorEl: null,
    menuOpen: false,
    menuList: [
      { name:"Profile", url:"/profile", },
      { name:"Dashboard", url:"/dashboard", },
      { name:"Comics", url:"/products", },
      { name:"Users", url:"/users", }
    ]
  }

  navigateTo(page:string)
  {
    let router:any = this.props.router
    router.push(page)
  }
  
  constructor(props: HeaderComponentState) {

    console.log("checking header calling => ");
    super(props);
    this.authService = new AuthClient()
  }

  componentDidMount(): void {
    subjectService.triggerSignInModal().subscribe((modal:any)=>{
      if(modal.open === true){this.openModal()}
      else{this.closeModal()}
    })
    this.handleAuth()
    this.setDynamicHeading()
  }
  
  async setDynamicHeading()
  {
    this.subService.getHeading().subscribe((res:any)=>{
      this.setState({heading : res})
    })
    this.subService.setHeading({heading:"Dashboard"})
  }

  async handleAuth()
  {
    this.subService.getAuthData().subscribe((res:any)=>{ 
      console.log("header subject => ", res)
      if(res.roleName === "Admin" || res.roleName === "User"){ subjectService.isAuthenticated = true }
      else{ subjectService.isAuthenticated = false }
      this.setState({ userInfo: res , loading: false }); })
    this.subService.setAuthData()
  }
  

  handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({
      anchorEl: event.currentTarget,
      menuOpen: true, // Open the menu when the button is clicked
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
      menuOpen: false, // Close the menu when an item is clicked or the menu is closed
    });
  };

  async signOut()
  {
    this.setState({loading:true},()=>{
      let signout:any = signOut()
      console.log("signout => ", signout)
      if(signout){ 
        localStorage.setItem("bonk-comic-hub-sign-userdata", JSON.stringify({userInfo:{roleName:"Guest User"}}))
        this.handleAuth()
        location.href = "/"
      }
    })
  }

  openModal = () => {
    // subjectService.openSignInPopup = true
    this.setState({ isModalOpen: true, popuptype: "upload" }, () => {});
  }
  closeModal = () => { 
    // subjectService.openSignInPopup = false
    this.setState({ isModalOpen: false });
  }


  signIn()
  {
    console.log("sign in")
    this.openModal()
  }


  handleSignRegAction(event:any) {
    console.log("Method called from the child component => ", event);
    if(event.modal === 'close'){ this.closeModal() }
    if(event.success){
      console.log("handle auth called => ")
      this.handleAuth()
    }
  };

  setHeading(event:any)
  {
    this.setState({modalHeading:event})
  }

  SignContent()
  {
    return <Modal centered show={this.state.isModalOpen} onHide={() => this.closeModal()}>
        <Modal.Header closeButton>
            <Modal.Title style={{ width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {this.state.modalHeading}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SignReg onChildAction={(event:any)=>this.handleSignRegAction(event)} changeheading={(event:any)=>this.setHeading(event)} />
        </Modal.Body>
      </Modal>
  }

  AdminBadgeIcon() {
    return (
      <Badge
        badgeContent="Admin"
        color="error" // Red badge for admin
        anchorOrigin={{
          vertical: "top",
          // horizontal: "right",
        }}
        overlap="circular"
      >
        <IconButton className="admin-icon">
          <AdminPanelSettingsIcon style={{ color: "#1976d2" }} /> {/* Blue admin icon */}
        </IconButton>
      </Badge>
    );
  }

  wishList()
  {
    this.navigateTo("wishlist")
  }

  cart()
  {
    this.navigateTo("cart")
  }

  UserType_Left_Content1(){
    const user:any = this.state.userInfo
    const switchtype:string = !!user ? user?.roleName : "Guest User" 
    switch (switchtype) {
      case "User":
        return <div className='user-content'>
          {/* <div className='menu-icon'>
            <IconButton edge="start" className="menu-icon" onClick={this.handleMenuClick}>
             <MenuIcon />
            </IconButton>
          </div> */}
          <div className='logo-part'>
            <div className="logo-container">
               {/* <img src="/assets/icons/logo1.svg" alt="Logo" className="logo" /> */}
               <img src="/assets/icons/logo.jpg" alt="Logo" className="logo" />
               {/* <div className='logo-name-'>comic hub</div> */}
             </div>
          </div>
        </div>;
      case "Admin":
        return <div className='admin-content'>
          {/* <div className='menu-icon'>
            <IconButton edge="start" className="menu-icon" onClick={this.handleMenuClick}>
             <MenuIcon />
            </IconButton>
          </div> */}
          <div className='logo-part'>
            <div className="logo-container">
               <img src="/assets/icons/logo.jpg" alt="Logo" className="logo" />
               <div className='logo-name-'>comic hub</div>
             </div>
          </div>
        </div>;
      case "Guest User":
        return <div className='guest-user-content'>
          {/* <div className='menu-icon'>
            <IconButton edge="start" className="menu-icon" onClick={this.handleMenuClick}>
             <MenuIcon />
            </IconButton>
          </div> */}
          <div className='logo-part'>
            <div className="logo-container">
               <img src="/assets/icons/logo.jpg" alt="Logo" className="logo" />
               <div className='logo-name-'>comic hub</div>
             </div>
          </div>
        </div>;
      default:
        return null;
    }
  };

  UserType_Left_Content(){
    return (<div className='logo-part'>
      <div className="logo-container">
         <img src="/assets/icons/logo.jpeg" alt="Logo" className="logo" />
         {/* <div className='logo-name-'>comic hub</div> */}
       </div>
       <div className='heading'>
        {this.state.heading.heading}
       </div>
    </div>)
  };
  
  UserType_Right_Content(){
    const user:any = this.state.userInfo
    const switchtype:string = !!user ? user?.roleName : "Guest User"  
    switch (switchtype) {
      case "User":
        return <div className='user-content'>
          {/* <div className='wishlist'>
            <IconButton  className="menu-icon" onClick={()=> this.wishList()}>
                <FavoriteIcon />
            </IconButton>
          </div> */}
          <div className='cart'>
            <IconButton  className="menu-icon" onClick={()=> this.cart()}>
              <ShoppingCartIcon />
            </IconButton>
          </div>
          <div onClick={()=> this.signOut()} className='sign-btn'>
            Sign Out
          </div>
        </div>;
      case "Admin":
        return <div className='admin-content'>
          <div className='' style={{width:'100px', display:'flex', justifyContent:'center'}} >
            {this.AdminBadgeIcon()}
          </div>
          <div onClick={()=> this.signOut()} className='sign-btn shape-reshape-btn'>
            Sign Out
          </div>
        </div>;
      case "Guest User":
        return <div className='guest-user-content'>
          <div>
          <div onClick={()=> this.signIn()} className='sign-btn shape-reshape-btn'>
            Sign In
          </div>
          </div>
        </div>;
      default:
        return null;
    }
  };

  render() {
    const { anchorEl, menuOpen } = this.state;
    // const user:any = this.state.userInfo//.userInfo
    return(<div className='header-root-class'>
      {
        this.state.loading 
        ? <div className='loading'> <div className='spinner'></div> </div>
        : <div className='parent-row'>
              <div className='left-child-column header-leftpart'>
                { this.UserType_Left_Content()}
              </div>
             
              <div className='right-child-column header-rightpart'>
                {  this.UserType_Right_Content()}
              </div>
        </div>
      }
       {this.SignContent()}
      <Menu
          style={{width: '250px'}}
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={this.handleMenuClose}
            >
              {
                this.state.menuList.map((menu:any, menuI:number)=>(
                  <MenuItem style={{width: '250px'}} key={menuI} onClick={this.handleMenuClose}>
                  <Link href={`${menu.url}`} style={{textDecoration:'none'}} passHref> {menu.name} </Link>
                </MenuItem>
                ))
              }
        </Menu>
    </div>)
    
  }
}

export default withRouter(HeaderComponent);
