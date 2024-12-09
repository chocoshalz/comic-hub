import { Component } from "react";
import "./HomeComponent.scss"
class HomeComponent extends Component {
  render() {
    return (
     <div className="homecomponent-root-class">
         <div className="w-full" >
        <div className="flex bg-white" style={{height:"600px"}}>
          <div className="flex items-center text-center lg:text-left px-8 md:px-12 lg:w-1/2">
            <div>
              <h2 className="text-3xl font-semibold text-gray-800 md:text-4xl">
                Comic Hub
                {/* Build Your New <span className="text-indigo-600">Idea</span> */}
              </h2>
              <p className="mt-2 text-sm text-gray-500 md:text-base">
                Comic Hub is your ultimate destination for exploring, reading,
                and collecting comics from a vast library of genres and universes.
                Whether you're a fan of superheroes, fantasy, science fiction,
                or slice-of-life stories, Comic Hub offers something for everyone
              </p>
              <div className="getstarted-learnmore">
                <a href={"/dashboard"} style={{textDecoration:'none'}}>
                <div  className="px-4 py-3 bg-gray-900 text-gray-200 text-xs font-semibold rounded hover:bg-gray-800 get-started shape-reshape-btn" >
                  Get Started
                </div>
                </a>
                
                {/* <div
                  className="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400 learn-more"
                  
                >
                  Learn More
                </div> */}
              </div>
            </div>
          </div>
          <div
            className="hidden lg:block lg:w-1/2"
            style={{clipPath:"polygon(10% 0, 100% 0%, 100% 100%, 0 100%)"}}
          >
            <div
              className="h-full object-cover set-home-bg"
            
            >
              <div className="h-full bg-black opacity-25"></div>
            </div>
          </div>
        </div>
      </div>
     </div>
    );
  }
}

export default HomeComponent;