// File: app/order/page.tsx
'use client';

import React, { Component, FormEvent } from 'react';
import './OrderPaymentForm.scss';
import { subjectService } from '@/services/client/common/ClientServices/SubjectService';
import PaypalPaymentForm from '../PaypalPaymentForm/PaypalPaymentForm';
import orderService from '@/services/client/common/ClientServices/OrderClient';
import toast from 'react-hot-toast';

interface OrderPaymentFormState {
  success:boolean,
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  // cardNumber: string;
  // expiryDate: string;
  // cvv: string;
  payerEmail:string,
  amount:number,
  orderSummary: { item: string; quantity: number; price: number }[];
}

class OrderPaymentForm extends Component<{}, OrderPaymentFormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      success:false,
      name: '',
      email: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zip: '',
      // cardNumber: '',
      // expiryDate: '',
      // cvv: '',
      payerEmail:'',
      amount:0,
      orderSummary: [
        { item: 'Spider-Man Comic', quantity: 2, price: 143 },
      ],
    };
  }

  componentDidMount(): void {
    this.setUserInfoAndAdddress()
  }

  userInfo:any
  comicData:any
  setUserInfoAndAdddress()
  {
    subjectService.getorderPaymentData().subscribe((pro:any)=>{
      console.log("pro =>>> ", pro)
      this.userInfo = pro.userInfo
      this.comicData = pro.comicData
      this.setState({
          name: pro.name,
          email: pro.email,
          phone: pro.phone,
          addressLine1: pro.address,
          addressLine2: '',
          city: pro.city,
          state: pro.state,
          zip: pro.zip,
          amount: pro.price,
          orderSummary:pro.orderSummary
      //     cardNumber: '',
      // expiryDate: '',
      // cvv: '',
      // orderSummary: [
      //   { item: 'Spider-Man Comic', quantity: 2, price: 143 },
      //   { item: 'Batman Comic', quantity: 1, price: 120 },
      // ],
      })
    })
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as unknown as Pick<OrderPaymentFormState, keyof OrderPaymentFormState>);
  };

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Order Details:', this.state);
    // alert('Order placed successfully!');
    this.placeOrder()
  };

  placeOrder()
  {
    let userInfo:any = this.userInfo
    let payload:any ={
      userId:userInfo.id,
      comicId:this.comicData.id,
      status:"order created"
    }
    console.log("payload => ", payload)
    orderService.CreateOrder(payload).subscribe((res:any)=>{
    this.setState({success:true})
      toast.success(res.message)
    })
  }

  render() {
    const { success, orderSummary, name, email, phone, addressLine1, addressLine2, city, state, zip, payerEmail, amount } = this.state;

    const total = orderSummary.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
      <div className="order-payment-form-root">
        {
          success === true 
          ? <div> <PaypalPaymentForm></PaypalPaymentForm> </div>
          : <form className="order-payment-form" onSubmit={this.handleSubmit}>
          {/* User Information */}
          <fieldset className="form-section">
            <legend>User Information</legend>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={name}
              onChange={this.handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={this.handleInputChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={phone}
              onChange={this.handleInputChange}
              required
            />
          </fieldset>

          {/* Shipping Address */}
          <fieldset className="form-section">
            <legend>Shipping Address</legend>
            <input
              type="text"
              name="addressLine1"
              placeholder="Address Line 1"
              value={addressLine1}
              onChange={this.handleInputChange}
              required
            />
            <input
              type="text"
              name="addressLine2"
              placeholder="Address Line 2"
              value={addressLine2}
              onChange={this.handleInputChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={city}
              onChange={this.handleInputChange}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={state}
              onChange={this.handleInputChange}
              required
            />
            <input
              type="text"
              name="zip"
              placeholder="Zip Code"
              value={zip}
              onChange={this.handleInputChange}
              required
            />
          </fieldset>

          {/* Payment Information */}
          <fieldset className="form-section">
            <legend>Paypal Payment Information</legend>
            <input
              type="text"
              name="payerEmail"
              placeholder="payerEmail"
              value={payerEmail}
              onChange={this.handleInputChange}
              required
            />
            <input
              type="text"
              name="amount"
              placeholder="amount"
              value={amount}
              onChange={this.handleInputChange}
              required
            />
            {/* <input
              type="text"
              name="cvv"
              placeholder="CVV"
              value={cvv}
              onChange={this.handleInputChange}
              required
            /> */}
          </fieldset>


        

          {/* Order Summary */}
          <fieldset className="form-section">
            <legend>Order Summary</legend>
            <ul className="order-summary">
              {orderSummary.map((item, index) => (
                <li key={index}>
                  {item.quantity} x {item.item} - ${item.price * item.quantity}
                </li>
              ))}
            </ul>
            <p className="order-total">Total: ${total}</p>
          </fieldset>

          <button type="submit"  className="submit-btn">
            Place Order
          </button>
        </form>
        }
        
      </div>
    );
  }
}

export default OrderPaymentForm;
