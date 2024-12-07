// File: PaypalPaymentForm.tsx

import React, { Component } from 'react';
import './PaypalPaymentForm.scss';

interface State {
  paymentSuccess: boolean;
}

class PaypalPaymentForm extends Component<{}, State> {
  state: State = {
    paymentSuccess: true, // Simulate successful payment
  };

  render() {
    const { paymentSuccess } = this.state;

    return (
      <div className="paypal-payment-form-root">
        {paymentSuccess ? (
          <div className="payment-success">
            <h2>Payment Successful!</h2>
            <p>Thank you for your purchase. Your payment has been successfully processed.</p>
          </div>
        ) : (
          <div className="payment-pending">
            <h2>Processing Payment...</h2>
          </div>
        )}
      </div>
    );
  }
}

export default PaypalPaymentForm;
