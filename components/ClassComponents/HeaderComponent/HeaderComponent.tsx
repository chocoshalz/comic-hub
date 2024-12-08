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

}