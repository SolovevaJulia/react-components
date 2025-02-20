import React from 'react';
import { observer } from 'mobx-react';
import { StepOrderStore } from 'store/StepOrderStore';
import { getMetrikaClass } from 'helpers';

import houseIcon from 'assets/img/order-form/house-icon.svg';
import apartmentIcon from 'assets/img/order-form/plan-icon.svg';
import keyIcon from 'assets/img/order-form/key-icon.svg';
import caretUpIcon from 'assets/img/caret-up.svg';
import caretDownIcon from 'assets/img/caret-down.svg';

const options = [
  { label: 'House', value: 'house', icon: houseIcon },
  { label: 'Apartment', value: 'apartment', icon: apartmentIcon },
  { label: 'Another building', value: 'other', icon: keyIcon }
];

const PropertySelection = observer(() => {
  const { tariff } = StepOrderStore;

  const isChecked = (propertyType) => StepOrderStore.propertyType === propertyType;
  const setType = (propertyType) => StepOrderStore.setPropertyType(propertyType);
  const addFloor = () => StepOrderStore.addFloor();
  const removeFloor = () => StepOrderStore.removeFloor();
  const openNextStep = () => StepOrderStore.openNextStep();

  const nextButtonClass = `order-modal-button ${getMetrikaClass('property', tariff)}`;

  return (
    <div className="property-selection">
      <h3 className="property-selection__title">Select property for AI to process</h3>
      <div className="property-selection__container">
        {options.map(({ label, value, icon }) => (
          <div key={value} className="property-selection__container-item">
            <input
              id={value}
              type="radio"
              checked={isChecked(value)}
              onChange={() => setType(value)}
            />
            <label htmlFor={value}>
              <div>
                <img src={icon} alt={value} />
              </div>
              <p>{label}</p>
            </label>
          </div>
        ))}
      </div>

      <div className="property-selection__floors">
        <p className="property-selection__floors-text">
          The number of floors / apartments in the property
        </p>

        <label>
          {StepOrderStore.plansCount}
          <input type="number" value={StepOrderStore.plansCount} min="1" max="300" readOnly />
        </label>

        <img
          className="property-selection__floors-up"
          src={caretUpIcon}
          alt="up"
          onClick={addFloor}
        />

        <img
          className="property-selection__floors-down"
          src={caretDownIcon}
          alt="down"
          onClick={removeFloor}
        />
      </div>

      <button className={nextButtonClass} onClick={openNextStep}>
        Next
      </button>
    </div>
  );
});

export default PropertySelection;
