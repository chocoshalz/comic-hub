'use client';

import React, { Component } from 'react';
import { Stepper, Step, StepLabel, Button, TextField, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import './OrderPaymentForm.scss';
import { subjectService } from '@/services/client/common/ClientServices/SubjectService';
import orderService from '@/services/client/common/ClientServices/OrderClient';
import toast from 'react-hot-toast';
import PaypalPaymentForm from '../PaypalPaymentForm/PaypalPaymentForm';

interface OrderSummary {
  item: string;
  quantity: number;
  price: number;
}

interface OrderPaymentFormState {
  success:boolean,
  activeStep: number;
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  payerEmail: string;
  amount: number;
  orderSummary: OrderSummary[];
}

class OrderPaymentForm extends Component<{}, OrderPaymentFormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      success:false,
      activeStep: 0,
      name: '',
      email: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zip: '',
      payerEmail: '',
      amount: 143,
      orderSummary: [
        // { item: 'Spider-Man Comic', quantity: 2, price: 143 },
        // { item: 'Batman Comic', quantity: 1, price: 120 },
      ],
    };
  }

  steps = ['User Information', 'Shipping Address', 'Order Details', 'Payment Information'];

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

  handleNext = () => {
    this.setState((prevState) => ({ activeStep: prevState.activeStep + 1 }));
  };

  handleBack = () => {
    this.setState((prevState) => ({ activeStep: prevState.activeStep - 1 }));
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as unknown as Pick<OrderPaymentFormState, keyof OrderPaymentFormState>);
  };

  handleSubmit = () => {
    console.log('Order Details:', this.state);
    this.placeOrder()
    // alert('Order placed successfully!');
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

  renderFormContent(step: number) {
    const { name, email, phone, addressLine1, addressLine2, city, state, zip, payerEmail, amount, orderSummary } =
      this.state;

    switch (step) {
      case 0:
        return (
          <>
            <TextField
              label="Full Name"
              name="name"
              value={name}
              onChange={this.handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              name="email"
              value={email}
              onChange={this.handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Phone Number"
              name="phone"
              value={phone}
              onChange={this.handleInputChange}
              fullWidth
              margin="normal"
              required
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              label="Address Line 1"
              name="addressLine1"
              value={addressLine1}
              onChange={this.handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Address Line 2"
              name="addressLine2"
              value={addressLine2}
              onChange={this.handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="City"
              name="city"
              value={city}
              onChange={this.handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="State"
              name="state"
              value={state}
              onChange={this.handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Zip Code"
              name="zip"
              value={zip}
              onChange={this.handleInputChange}
              fullWidth
              margin="normal"
              required
            />
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <List>
              {orderSummary.map((item, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemText
                    primary={`${item.quantity} x ${item.item}`}
                    secondary={`Price: €${item.price * item.quantity}`}
                  />
                </ListItem>
              ))}
            </List>
            <Typography variant="h6" align="right" gutterBottom>
              Total: €
              {orderSummary.reduce((acc, item) => acc + item.price * item.quantity, 0)}
            </Typography>
          </>
        );
      case 3:
        return (
          <>
            <TextField
              label="Payer Email"
              name="payerEmail"
              value={payerEmail}
              onChange={this.handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Amount"
              name="amount"
              value={orderSummary.reduce((acc, item) => acc + item.price * item.quantity, 0)}
              onChange={this.handleInputChange}
              fullWidth
              margin="normal"
              disabled
              required
            />
          </>
        );
      default:
        return null;
    }
  }

  render() {
    const { success, activeStep } = this.state;

    return (
      <Box className="order-payment-form-root">
        {
          success === true 
           ? <div> <PaypalPaymentForm></PaypalPaymentForm> </div>
           : <div>
              <Stepper activeStep={activeStep}>
          {this.steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box className="form-content">
          {this.renderFormContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.handleBack}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            {activeStep === this.steps.length - 1 ? (
              <Button variant="contained" color="primary" onClick={this.handleSubmit}>
                Submit
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={this.handleNext}>
                Next
              </Button>
            )}
          </Box>
        </Box>
            </div>
        }
      </Box>
    );
  }
}

export default OrderPaymentForm;


// // File: app/order/page.tsx
// 'use client';

// import React, { Component, FormEvent } from 'react';
// import './OrderPaymentForm.scss';
// import { subjectService } from '@/services/client/common/ClientServices/SubjectService';
// import PaypalPaymentForm from '../PaypalPaymentForm/PaypalPaymentForm';
// import orderService from '@/services/client/common/ClientServices/OrderClient';
// import toast from 'react-hot-toast';

// interface OrderPaymentFormState {
//   success:boolean,
//   name: string;
//   email: string;
//   phone: string;
//   addressLine1: string;
//   addressLine2: string;
//   city: string;
//   state: string;
//   zip: string;
//   // cardNumber: string;
//   // expiryDate: string;
//   // cvv: string;
//   payerEmail:string,
//   amount:number,
//   orderSummary: { item: string; quantity: number; price: number }[];
// }

// class OrderPaymentForm extends Component<{}, OrderPaymentFormState> {
//   constructor(props: {}) {
//     super(props);
//     this.state = {
//       success:false,
//       name: '',
//       email: '',
//       phone: '',
//       addressLine1: '',
//       addressLine2: '',
//       city: '',
//       state: '',
//       zip: '',
//       // cardNumber: '',
//       // expiryDate: '',
//       // cvv: '',
//       payerEmail:'',
//       amount:0,
//       orderSummary: [
//         { item: 'Spider-Man Comic', quantity: 2, price: 143 },
//       ],
//     };
//   }

//   componentDidMount(): void {
//     this.setUserInfoAndAdddress()
//   }

//   userInfo:any
//   comicData:any
//   setUserInfoAndAdddress()
//   {
//     subjectService.getorderPaymentData().subscribe((pro:any)=>{
//       console.log("pro =>>> ", pro)
//       this.userInfo = pro.userInfo
//       this.comicData = pro.comicData
//       this.setState({
//           name: pro.name,
//           email: pro.email,
//           phone: pro.phone,
//           addressLine1: pro.address,
//           addressLine2: '',
//           city: pro.city,
//           state: pro.state,
//           zip: pro.zip,
//           amount: pro.price,
//           orderSummary:pro.orderSummary
//       //     cardNumber: '',
//       // expiryDate: '',
//       // cvv: '',
//       // orderSummary: [
//       //   { item: 'Spider-Man Comic', quantity: 2, price: 143 },
//       //   { item: 'Batman Comic', quantity: 1, price: 120 },
//       // ],
//       })
//     })
//   }

//   handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     this.setState({ [name]: value } as unknown as Pick<OrderPaymentFormState, keyof OrderPaymentFormState>);
//   };

//   handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     console.log('Order Details:', this.state);
//     // alert('Order placed successfully!');
//     this.placeOrder()
//   };

//   placeOrder()
//   {
//     let userInfo:any = this.userInfo
//     let payload:any ={
//       userId:userInfo.id,
//       comicId:this.comicData.id,
//       status:"order created"
//     }
//     console.log("payload => ", payload)
//     orderService.CreateOrder(payload).subscribe((res:any)=>{
//     this.setState({success:true})
//       toast.success(res.message)
//     })
//   }

//   render() {
//     const { success, orderSummary, name, email, phone, addressLine1, addressLine2, city, state, zip, payerEmail, amount } = this.state;

//     const total = orderSummary.reduce((acc, item) => acc + item.price * item.quantity, 0);

//     return (
//       <div className="order-payment-form-root">
//         {
//           success === true 
//           ? <div> <PaypalPaymentForm></PaypalPaymentForm> </div>
//           : <form className="order-payment-form" onSubmit={this.handleSubmit}>
//           {/* User Information */}
//           <fieldset className="form-section">
//             <legend>User Information</legend>
//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               value={name}
//               onChange={this.handleInputChange}
//               required
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={email}
//               onChange={this.handleInputChange}
//               required
//             />
//             <input
//               type="tel"
//               name="phone"
//               placeholder="Phone Number"
//               value={phone}
//               onChange={this.handleInputChange}
//               required
//             />
//           </fieldset>

//           {/* Shipping Address */}
//           <fieldset className="form-section">
//             <legend>Shipping Address</legend>
//             <input
//               type="text"
//               name="addressLine1"
//               placeholder="Address Line 1"
//               value={addressLine1}
//               onChange={this.handleInputChange}
//               required
//             />
//             <input
//               type="text"
//               name="addressLine2"
//               placeholder="Address Line 2"
//               value={addressLine2}
//               onChange={this.handleInputChange}
//             />
//             <input
//               type="text"
//               name="city"
//               placeholder="City"
//               value={city}
//               onChange={this.handleInputChange}
//               required
//             />
//             <input
//               type="text"
//               name="state"
//               placeholder="State"
//               value={state}
//               onChange={this.handleInputChange}
//               required
//             />
//             <input
//               type="text"
//               name="zip"
//               placeholder="Zip Code"
//               value={zip}
//               onChange={this.handleInputChange}
//               required
//             />
//           </fieldset>

//           {/* Payment Information */}
//           <fieldset className="form-section">
//             <legend>Paypal Payment Information</legend>
//             <input
//               type="text"
//               name="payerEmail"
//               placeholder="payerEmail"
//               value={payerEmail}
//               onChange={this.handleInputChange}
//               required
//             />
//             <input
//               type="text"
//               name="amount"
//               placeholder="amount"
//               value={amount}
//               onChange={this.handleInputChange}
//               disabled
//               required
//             />
//             {/* <input
//               type="text"
//               name="cvv"
//               placeholder="CVV"
//               value={cvv}
//               onChange={this.handleInputChange}
//               required
//             /> */}
//           </fieldset>


        

//           {/* Order Summary */}
//           <fieldset className="form-section">
//             <legend>Order Summary</legend>
//             <ul className="order-summary">
//               {orderSummary.map((item, index) => (
//                 <li key={index}>
//                   {item.quantity} x {item.item} - ${item.price * item.quantity}
//                 </li>
//               ))}
//             </ul>
//             <p className="order-total">Total: ${total}</p>
//           </fieldset>

//           <button type="submit"  className="submit-btn">
//             Place Order
//           </button>
//         </form>
//         }
        
//       </div>
//     );
//   }
// }

// export default OrderPaymentForm;
