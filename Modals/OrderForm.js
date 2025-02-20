import React from 'react';
import { observer } from 'mobx-react';
import { OrderStepNames, TariffNames } from 'enums';
import { StepOrderStore } from 'store/StepOrderStore';

import PropertySelection from './PropertySelection';
import StyleSelection from './StyleSelection';
import PlanUploading from './PlanUploading';
import OrderSummary from './OrderSummary';
import PaymentStep from './PaymentStep';

import checkedIcon from 'assets/img/checked-icon.svg';
import closeIcon from 'assets/img/close-icon.svg';

const Pages = [PropertySelection, StyleSelection, PlanUploading, OrderSummary, PaymentStep];

const OrderForm = observer(({ closeOrderModal }) => {
  const { tariff, currentStep } = StepOrderStore;

  const CurrentPage = Pages[currentStep];

  return (
    <div className="order-modal">
      <div className="order-modal-content">
        <h2 className="order-modal-title">Your order “{TariffNames[tariff]}”</h2>
        <div className="order-modal-steps">
          <hr className="order-modal-steps-line" />
          <div className="order-modal-steps-container">
            {StepOrderStore.stepsFlags.map((isReady, step) => {
              const classList = ['order-modal-steps-item-circle'];
              if (isReady) classList.push('ready');
              if (currentStep === step) classList.push('active');

              const circleClass = classList.join(' ');
              const isPassed = step < currentStep;
              const name = OrderStepNames[step];

              return (
                <div key={step} className="order-modal-steps-item">
                  <div className={circleClass}>
                    {isPassed ? <img src={checkedIcon} alt="checked" /> : step + 1}
                  </div>
                  <p className="order-modal-steps-item-name">{name}</p>
                </div>
              );
            })}
          </div>
        </div>

        <CurrentPage />
      </div>
      <img
        onClick={closeOrderModal}
        className="order-modal-close"
        src={closeIcon}
        alt="close-icon"
      />
    </div>
  );
});

export default OrderForm;
