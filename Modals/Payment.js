import React from 'react';
import { observer } from 'mobx-react';

const Payment = observer(({ link }) => {
  return (
    <div className="order-payment">
      {link ? <iframe title="payment-form" src={link} /> : <p>No payment link provided</p>}
    </div>
  );
});

export default Payment;
