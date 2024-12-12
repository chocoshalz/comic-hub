"use client";
import "./Menu.scss";
import React, { Component } from "react"; // React - https://reactjs.org/
import { MenuItem } from "@mui/material"; // Material UI - https://mui.com/
import Link from "next/link";
import withRouter from "@/components/routing/withRouter";
import { subjectService } from "@/services/client/common/ClientServices/SubjectService";
interface MenuProps {
  router: any;
}
class Menu extends Component<MenuProps> {
  state = {
    activeMenu:"",
    userInfo:{roleName:"Guest User"},
    menuList: [
      { name: "Profile", url: "/profile", userType:["User", "Admin"] },
      { name: "Home", url: "/home", userType:["User", "Admin", "Guest User"] },
      { name: "Comics", url: "/dashboard", userType:["User", "Admin", "Guest User"] },
      { name: "Users", url: "/users", userType:["Admin"] },
      { name: "Roles", url: "/roles", userType:["Admin"] },
      // { name: "Wish List", url: "/wishlist" },
      { name: "Cart", url: "/cart", userType:["User"] },
      { name: "Orders", url: "/order", userType:["User", "Admin"] },
    ],
  };

  constructor(props: MenuProps) {
    super(props);
  }

  componentDidMount(): void {
    this.handleAuth()
  }
  userInfo:any
  handleAuth()
  {
    subjectService.getAuthData().subscribe((res:any)=>{ 
      this.userInfo = res
      let menuList:any = this.state.menuList
      menuList = menuList
      .filter((m: any) => m.userType.includes(res.roleName))
      .map((m: any) => {
        // Optionally transform `m` here if needed
        return m;
     });
     console.log("menuList => ", menuList)
      this.setState({ userInfo: res, menuList, loading: false }); })
  }

  navigateTo(menu: any) {
    if(subjectService.isAuthenticated === true || true)
    {
      const { router } = this.props;
      this.setState({activeMenu:menu.name})
      console.log("menu => ", menu, "router => ");
      router.push(menu.url);
    }
    else{
      subjectService.openSignInModal(true)
    }
  }

  handleMenuClose() {}

  render() {
    const { userInfo } = this.state
    return (
      <div className="sidemenu-root-class comic-hub-color5">
        <div className="menu comic-hub-color5">
          {this.state.menuList.map((menu: any, menuI: number) => (
            <div
              key={menuI}
              onClick={() => this.navigateTo(menu)}
              className={`shape-reshape-btn ${this.state.activeMenu === menu.name ? "active" : ""} comic-hub-color3`}
            >
              {menu.name}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default withRouter(Menu);
