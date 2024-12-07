// File: app/cart/page.tsx
'use client';

import React, { Component } from 'react';
import './CartPage.scss';
import { subjectService } from '@/services/client/common/ClientServices/SubjectService';
import CartClient from '@/services/client/common/ClientServices/CartClient';
import toast from 'react-hot-toast';

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
  cart: CartItem[];
  userInfo:any
}

class CartPage extends Component<{}, CartState> {
  cartServ:CartClient
  constructor(props: {}) {
    super(props);
    this.cartServ = new CartClient()
    this.state = {
      userInfo: { RoleName: 'Guest User' },
      cart: [
        
      ],
    };
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
      console.log('get wishList => ', res);
      this.setState({cart:res.CardItems})
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

  handleIncreaseQuantity = (itemId: string) => {
    const updatedCart = this.state.cart.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    this.setState({ cart: updatedCart });
  };

  handleDecreaseQuantity = (itemId: string) => {
    const updatedCart = this.state.cart.map((item) =>
      item.id === itemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    this.setState({ cart: updatedCart });
  };

  render() {
    const { cart } = this.state;

    return (
      <div className="cart-root">
        {/* <h2 className="cart-title">Your Cart</h2> */}
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
                <p className="cart-item-price">Price: ${item?.comicData?.price}</p>
                <div className="cart-item-quantity">
                  <button
                    className="cart-btn quantity-btn"
                    onClick={() => this.handleDecreaseQuantity(item)}
                  >
                    -
                  </button>
                  <span>{item?.comicData?.quantity}</span>
                  <button
                    className="cart-btn quantity-btn"
                    onClick={() => this.handleIncreaseQuantity(item)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="cart-btn remove-btn"
                  onClick={() => this.handleRemove(item)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default CartPage;
