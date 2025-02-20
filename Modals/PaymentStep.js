import React from 'react';
import { observer } from 'mobx-react';
import Payment from 'components/Modals/Payment';
import { StepOrderStore } from 'store/StepOrderStore';

const PaymentStep = observer(() => {
  const { paymentLink } = StepOrderStore;

  return <Payment link={paymentLink} />;
});

export default PaymentStep;
