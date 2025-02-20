import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { imageMap, styles, EnvironmentType, TariffNames } from 'enums';
import { StepOrderStore } from 'store/StepOrderStore';
import { getMetrikaClass } from 'helpers';

const OrderSummary = observer(() => {
  const {
    tariff,
    style,
    environmentType,
    calculatedPrice,
    errors,
    email,
    customerType,
    promocode
  } = StepOrderStore;

  const [tryNextStep, setTryNextStep] = useState(false);
  const [buttonText, setButtonText] = useState('Make payment');

  const setCustomerType = (customerType) => StepOrderStore.setCustomerType(customerType);
  const setPromocode = (promocode) => StepOrderStore.setPromocode(promocode);

  const tryOpenNextStep = () => {
    setTryNextStep(true);
    if (!email) return;

    setButtonText('Wait');
    StepOrderStore.makeOrder()
      .then(() => {
        openNextStep();
      })
      .finally(() => {
        setButtonText('Make payment');
      });
  };
  const openNextStep = () => StepOrderStore.openNextStep();
  const openPrevStep = () => StepOrderStore.openPrevStep();

  const nextButtonClass = `order-modal-button ${getMetrikaClass('summary', tariff)}`;

  return (
    <div className="order-summary">
      <h3 className="order-summary-title">Review order summary</h3>
      <div className="order-summary-container">
        <div className="order-summary-container-set">
          <div className="order-summary-container-set-img">
            <img src={imageMap[style][environmentType]} alt="design" />
          </div>
          <div className="order-summary-container-set-block">
            <div className="order-summary-container-set-block-item">
              <p className="order-summary-container-set-block-item-type">Set</p>
              <p className="order-summary-container-set-block-item-value">{TariffNames[tariff]}</p>
            </div>
            <div className="order-summary-container-set-block-item">
              <p className="order-summary-container-set-block-item-type">Style</p>
              <p className="order-summary-container-set-block-item-value">{styles[style]}</p>
            </div>
            <div className="order-summary-container-set-block-item">
              <p className="order-summary-container-set-block-item-type">Window view</p>
              <p className="order-summary-container-set-block-item-value">
                {EnvironmentType[environmentType]}
              </p>
            </div>
          </div>
        </div>
        <div className="order-summary-container-check">
          <div className="order-summary-container-check-price">
            <h4 className="order-summary-container-check-price-title">
              {calculatedPrice.count} floor plans processing
            </h4>
            <div className="order-summary-container-check-price-description">
              {Object.entries(calculatedPrice.items).map(([price, count]) => (
                <p key={price} className="order-summary-container-check-price-description-item">
                  ${price.replace('.', ',')} x {count} item
                </p>
              ))}
            </div>
          </div>
          <div className="order-summary-container-check-total">
            <input
              value={promocode}
              onChange={(e) => setPromocode(e.target.value)}
              placeholder="Enter discount code"
              className="order-summary-container-check-total-input"
            />
            {errors.errorMessagePromo && (
              <p className="order-summary-container-check-total-error">
                {errors.errorMessagePromo}
              </p>
            )}
            <hr className="order-summary-container-check-total-line" />
            <div className="order-summary-container-check-total-price">
              <p className="order-summary-container-check-total-price-name">Order total</p>
              <p className="order-summary-container-check-total-price-value">
                {`$${calculatedPrice.sum}`.replace('.', ',')}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="order-summary-info">
        <div className="order-summary-info-email">
          <p className="order-summary-info-email-title">
            You will receive the result in 1 business day by email
          </p>
          <input
            value={email}
            className="order-summary-info-email-input"
            type="email"
            name="email"
            placeholder="E-mail"
            disabled
          />
          {tryNextStep && !email && (
            <p className="order-summary-info-email-input-error">Please enter your email</p>
          )}
          {errors.errorMessage && (
            <p className="order-summary-info-email-input-error">{errors.errorMessage}</p>
          )}
        </div>
        <div className="order-summary-info-type">
          <p className="order-summary-info-type-title">Introduce yourself:</p>
          <div className="order-summary-info-type-buttons">
            <div className="order-summary-info-type-buttons-item">
              <input
                id="company"
                type="radio"
                name="radio"
                value="company"
                checked={customerType === 'company'}
                onChange={() => setCustomerType('company')}
              />
              <label htmlFor="company">Company</label>
            </div>
            <div className="order-summary-info-type-buttons-item">
              <input
                id="personal"
                type="radio"
                name="radio"
                value="personal"
                checked={customerType === 'personal'}
                onChange={() => setCustomerType('personal')}
              />
              <label htmlFor="personal">Personal</label>
            </div>
          </div>
        </div>
      </div>
      <div className="order-modal-buttons">
        <button onClick={openPrevStep} className="order-modal-button order-modal-button-second">
          Back
        </button>
        <button onClick={tryOpenNextStep} className={nextButtonClass}>
          {buttonText}
        </button>
      </div>
    </div>
  );
});

export default OrderSummary;
