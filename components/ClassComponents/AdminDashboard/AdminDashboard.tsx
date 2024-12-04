"use client";
import { Component } from "react";
import "./AdminDashboard.scss";
import images from "@/services/client/common/imageServices";
import withRouter from "@/components/routing/withRouter";

interface ProductsPageProps {
    router: any; // Router instance
  }
class AdminDashboard extends Component<ProductsPageProps> {
  constructor(props: ProductsPageProps) {
    super(props);
    // this.eventService = EventService.getInstance();
  }

  navigateTo(card:any) 
  {
    /*
    interface ProductsPageProps {
    router: any; // Router instance
  }
    */
    const { router } = this.props;
    if(!!card.url)
    router.push(card.url); 
  };

  render() {
    const cards = [
      {
        title: "User Management",
        description: "Manage users and their roles effectively.",
        image: images.usermanagement,
        url:"users"
      },
      {
        title: "Product Management",
        description: "Organize and manage your product listings.",
        image: images.productmanagement,
        url:"products"
      },
      {
        title: "Role Management",
        description: "Define and assign user roles seamlessly.",
        image: images.rolemanagement,
        url:"roles"
      },
      {
        title: "Order Management",
        description: "Track and process orders efficiently.",
        image: images.ordermanagement,
        url:"order"
      },
    ];

    return (
      <div className={"admindashboard-root-class"}>
        {/* <h2 className={"admindashboard-heading"}>Admin Dashboard</h2> */}
        <div className={`__card-container__`}>
          {cards.map((card: any, cardI: number) => (
            <div key={cardI} className={`__card__`} onClick={()=> this.navigateTo(card)}>
              <div className={`__card-item__ __card-box__ `}>
                <div className="item-container">
                    <div className="item-title">
                        {card.title}
                    </div>
                    <div className="item-image">
                    <img src={card.image}></img>
                        
                    </div>
                    <div className="item-description">
                        {card.description}
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default withRouter(AdminDashboard);
