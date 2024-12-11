// File: app/cart/page.tsx
'use client';

import React, { Component } from 'react';
import './CartPage.scss';
import { subjectService } from '@/services/client/common/ClientServices/SubjectService';
import CartClient from '@/services/client/common/ClientServices/CartClient';
import toast from 'react-hot-toast';
import { Modal } from "react-bootstrap";
import OrderPaymentForm from '@/components/ClassComponents/OrderPaymentForm/OrderPaymentForm';
interface CartItem {
  id: string;
  title: string;
  genre: string;
  author: string;
  publisher: string;
  price: string;
  description: string;
  banner: string;
  createdAt: string;
  quantity: number;
}

interface CartState {
  isModalOpen:boolean
  modalHeading:string;
  cart: any;//CartItem[];
  userInfo:any
}

class CartPage extends Component<{}, CartState> {
  cartServ:CartClient
  state = {
    isModalOpen:false,
    modalHeading:"",
    userInfo: { RoleName: 'Guest User' },
    cart: [
      
    ],
  };
  constructor(props: {}) {
    super(props);
    subjectService.setHeading({heading:"carts"})
    this.cartServ = new CartClient()
    
  }

  componentDidMount(): void {
    this.handleAuth();
  }

  async handleAuth() {
    subjectService.getAuthData().subscribe((res: any) => {
      this.getAllCartList(res.id);
      this.setState({ userInfo: res });
    });
  }

  getAllCartList(userId: string) {
    this.cartServ.getAllCartList(userId).subscribe((res: any) => {
      console.log('get cart List => ', res);
      this.setState({cart:res.cartItems })
    });
  }

  handleRemove = (item: any) => {
    console.log("cart => ", item.cartItems.id)
    this.cartServ.RemoveFromtCart(item.cartItems.id).subscribe((res:any)=>{
      toast.success(res.message)
      this.getAllCartList(item.cartItems.userId)
    })
    // const updatedCart = this.state.cart.filter((item) => item.id !== itemId);
    // this.setState({ cart: updatedCart });
  };

  handleIncreaseQuantity = (qitem: any, itemI: number) => {
    const updatedCart = this.state.cart.map((item: any) =>
      item.cartItems.id === qitem.cartItems.id
        ? { ...item, cartItems: { ...item.cartItems, quantity: (item.cartItems.quantity || 1) + 1 } }
        : item
    );
    this.setState({ cart: updatedCart });
  };
  
  handleDecreaseQuantity = (qitem: any, itemI: number) => {
    const updatedCart = this.state.cart.map((item: any) =>
      item.cartItems.id === qitem.cartItems.id && item.cartItems.quantity > 1
        ? { ...item, cartItems: { ...item.cartItems, quantity: item.cartItems.quantity - 1 } }
        : item
    );
    this.setState({ cart: updatedCart });
  };

  openModal = () => this.setState({ isModalOpen: true, modalHeading:"Order Payment Form"}, () => {});
  closeModal = () => this.setState({ isModalOpen: false });

  
  handleOrder(item:any)
  {
      console.log(" order => ", item)
      if(subjectService.isAuthenticated)
    {
      // let carts:any = this.state.cart[0]
      const userInfo:any = this.state.userInfo
      let pro:any = item.profileData
      let comicData:any = item.
      comicData
      
      console.log("pro send => ", pro)
      if(!!pro)
      if(pro.address.length && pro.createdAt.length && pro.fullName.length && pro.phone.length 
        && pro.phone.length && pro.pinCode.length && pro.state.length && pro.state && pro.city)
      {
        try {
          let data = {
            name: pro.fullName,
            email: userInfo.email,
            phone: pro.phone,
            address: pro.address,
            addressLine2: '',
            city: pro.city,
            state: pro.state,
            zip: pro.pinCode,
            price: comicData.price,
            userInfo:userInfo,
            comicData:comicData,
            orderSummary: [
              { item: comicData.title, quantity: item?.cartItems?.quantity, price: comicData.price },
            ]
          }
          subjectService.setorderPaymentData(data)
          this.setState({modalHeading:"Order Payment Form", isModalOpen:true })
        } catch (error) {
          console.log("err => ", error)
        }
        
      }
      else{
        alert("please update profile")
      }

        
    }
    else{
        subjectService.openSignInModal(true)
        console.log("logoin popup")
    }
  }
  

  orderAll()
  {
    console.log("order all => ", this.state.cart)
    // if(subjectService.isAuthenticated)
    // {
    //   let carts:any = this.state.cart[0]
    //   const userInfo:any = this.state.userInfo
    //   let pro:any = carts[0].profileData
    //   let comicData:any = this.comicData
    //   console.log("pro send => ", pro)
    //   if(!!pro)
    //   if(pro.address.length && pro.createdAt.length && pro.fullName.length && pro.phone.length 
    //     && pro.phone.length && pro.pinCode.length && pro.state.length && pro.state && pro.city)
    //   {
    //     try {
    //       carts.forEach((cart:any, cartI:number)=>{

    //       })
    //       let data = {
    //         name: pro.fullName,
    //         email: userInfo.email,
    //         phone: pro.phone,
    //         address: pro.address,
    //         addressLine2: '',
    //         city: pro.city,
    //         state: pro.state,
    //         zip: pro.pinCode,
    //         price: comicData.price,
    //         userInfo:userInfo,
    //         comicData:comicData,
    //         orderSummary: [
    //           { item: comicData.title, quantity: 1, price: comicData.price },
    //         ]
    //       }
    //       subjectService.setorderPaymentData(data)
    //       this.setState({modalHeading:"Order Payment Form", isModalOpen:true })
    //     } catch (error) {
    //       console.log("err => ", error)
    //     }
        
    //   }
    //   else{
    //     alert("please update profile")
    //   }

        
    // }
    // else{
    //     subjectService.openSignInModal(true)
    //     console.log("logoin popup")
    // }
   
  }

  OrderPaymentFormModal()
  {
    return <Modal show={this.state.isModalOpen} onHide={() => this.closeModal()}>
        <Modal.Header closeButton>
            <Modal.Title style={{ width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {this.state.modalHeading}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
              <OrderPaymentForm></OrderPaymentForm>
        </Modal.Body>
      </Modal>
  }

  render() {
    const { cart } = this.state;
    // console.log("cart => ", cart)
    // const cart:any = this.state
    return (
      <div className="cart-root">
        {this.OrderPaymentFormModal()}
       {/* <div className='order-all-cardsitems'>
        <div className='order-all' onClick={()=> this.orderAll()}>order all</div>
       </div> */}
        <div className="cart-items">
          {
            cart.length === 0
            ? <div style={{textAlign:'center'}}>no items found</div>
            : cart.map((item:any,itemI:number) => (
              <div key={itemI} className="cart-item">
                <img src={item?.comicData?.banner} alt={item?.comicData?.title} className="cart-item-banner" />
                <div className="cart-item-details">
              <h3 className="cart-item-title">{item?.comicData?.title}</h3>
              <p className="cart-item-description">{item?.comicData?.description}</p>
              <p className="cart-item-price">Price: €{item?.comicData?.price}</p>
              <div className="cart-item-quantity">
                <button className="cart-btn quantity-btn" onClick={() => this.handleDecreaseQuantity(item, itemI)} > - </button>
                <span style={{color:'black'}}>{item?.cartItems?.quantity }</span>
                <button className="cart-btn quantity-btn" onClick={() => this.handleIncreaseQuantity(item,itemI)}> + </button>
                <button className="cart-btn order-btn" onClick={() => this.handleOrder(item)} > order </button>
                <button className="cart-btn remove-btn" onClick={() => this.handleRemove(item)} > Remove </button>
              </div>
              
                </div>
              </div>
            ))
            
          }
        </div>
      </div>
    );
  }
}

export default CartPage;
