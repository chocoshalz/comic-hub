'use client'
import HomeComponent from "@/components/ClassComponents/HomeComponent/HomeComponen";
import "./home.scss";
import { Component } from "react";
import FooterComponent from "@/components/ClassComponents/FooterComponent/FooterComponent";

class HomePage extends Component {
    render() {
        return (
            <div className="homepage-root-class">
                <HomeComponent ></HomeComponent>
                <FooterComponent></FooterComponent>
            </div>
        );
    }
}

export default HomePage;
