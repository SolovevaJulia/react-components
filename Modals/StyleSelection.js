import React from 'react';
import { observer } from 'mobx-react';
import CustomSelect from 'components/CustomSelect';
import { imageMap, stylesOptions, EnvironmentTypeOptions } from 'enums';
import { StepOrderStore } from 'store/StepOrderStore';
import { getMetrikaClass } from 'helpers';

import brush from 'assets/img/brush.svg';
import image from 'assets/img/image.svg';
import mirror from 'assets/img/mirror.svg';

const StyleSelection = observer(() => {
  const { style, environmentType, windowType, tariff } = StepOrderStore;

  const setStyle = (style) => StepOrderStore.setStyle(style);
  const setEnvironmentType = (type) => StepOrderStore.setEnvironmentType(type);
  const setWindowType = (windowType) => StepOrderStore.setWindowType(windowType);
  const openPrevStep = () => StepOrderStore.openPrevStep();
  const openNextStep = () => StepOrderStore.openNextStep();

  const nextButtonClass = `order-modal-button ${getMetrikaClass('ai', tariff)}`;

  return (
    <div className="style-selection">
      <div className="style-selection-container">
        <div className="style-selection-container-img">
          <img src={imageMap[style][environmentType]} alt="design" />
        </div>
        <div>
          <div className="style-selection-list">
            <div className="style-selection-option">
              <h3 className="style-selection-title">
                <img className="public-sidebar--content-button-img" src={brush} alt="brush icon" />
                Select interior style
              </h3>
              <div className="style-selection-container-styles">
                <CustomSelect options={stylesOptions} value={style} changeHandler={setStyle} />
              </div>
            </div>

            {tariff !== 1 && (
              <div className="style-selection-option">
                <h3 className="style-selection-title">
                  <img
                    className="public-sidebar--content-button-img"
                    src={image}
                    alt="window view icon"
                  />
                  Select a window view
                </h3>
                <div className="style-selection-container-views">
                  <CustomSelect
                    options={EnvironmentTypeOptions}
                    value={environmentType}
                    changeHandler={setEnvironmentType}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="style-selection-option-third">
            <h3 className="style-selection-title">
              <img
                className="public-sidebar--content-button-img"
                src={mirror}
                alt="window type icon"
              />
              Window type
            </h3>
            <div className="style-selection-title-switch">
              <span>Panoramic</span>
              <input
                type="checkbox"
                id="switch"
                checked={windowType === 'standard'}
                onChange={(e) => setWindowType(e.target.checked ? 'standard' : 'panoramic')}
              />
              <label htmlFor="switch"></label>
              <span>Standard</span>
            </div>
          </div>
        </div>
      </div>
      <div className="order-modal-buttons">
        <button className="order-modal-button order-modal-button-second" onClick={openPrevStep}>
          Back
        </button>
        <button className={nextButtonClass} onClick={openNextStep}>
          Next
        </button>
      </div>
    </div>
  );
});

export default StyleSelection;
