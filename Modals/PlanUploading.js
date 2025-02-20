import React, { useState, useRef } from 'react';
import { observer } from 'mobx-react';
import { TariffType } from 'enums';
import { StepOrderStore } from 'store/StepOrderStore';
import { getMetrikaClass } from 'helpers';

import planIcon from 'assets/img/order-form/plan-icon.svg';
import deleteIcon from 'assets/img/deleteFileIcon.svg';
import moreIcon from 'assets/img/order-form/plus-icon.svg';
import infoIcon from 'assets/img/order-form/info.svg';
import closeIcon from 'assets/img/close-icon.svg';
import houseSmileIcon from 'assets/img/order-form/house-smile.svg';

const PlanUploading = observer(() => {
  const { tariff, logo, link, comment } = StepOrderStore;

  const [uploadPlans, setUploadPlans] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(undefined);
  const [logoInfoVisible, setLogoInfoVisible] = useState(false);
  const [commentInfoVisible, setCommentInfoVisible] = useState(false);
  const [tryNextStep, setTryNextStep] = useState(false);
  const [buttonText, setButtonText] = useState('Next');

  const inputRef = useRef();
  const logoInputRef = useRef();

  const setLogo = (logo) => {
    StepOrderStore.setLogo(logo || undefined);
    if (logoInputRef.current) {
      logoInputRef.current.value = null;
    }
  };
  const setLink = (link) => StepOrderStore.setLink(link || undefined);
  const setComment = (comment) => StepOrderStore.setComment(comment || undefined);

  const tryOpenNextStep = async () => {
    setTryNextStep(true);

    const hasBranding = tariff === TariffType.Pro || tariff === TariffType.Max;
    const isLinkAndLogoProvided = logo && link;
    if (hasBranding && !isLinkAndLogoProvided) return;
    if (uploadPlans.length === 0) return;

    setButtonText('Wait');

    StepOrderStore.setPlans(uploadPlans);
    await StepOrderStore.calculatePrice();

    openNextStep();

    setButtonText('Next');
  };
  const openNextStep = () => StepOrderStore.openNextStep();
  const openPrevStep = () => StepOrderStore.openPrevStep();

  const upload = (e) => {
    setUploadPlans((plans) => [...plans, ...e.target.files]);
  };

  const deleteFileAndCloseModal = () => {
    const newUploadPlans = [...uploadPlans];
    newUploadPlans.splice(deleteIndex, 1);
    setUploadPlans(newUploadPlans);
    setDeleteIndex(undefined);
    setModalVisible(false);

    if (inputRef.current) {
      inputRef.current.value = null;
      logoInputRef.current.value = null;
    }
  };

  const openModal = (index) => {
    setDeleteIndex(index);
    setModalVisible(true);
  };

  const nextButtonClass = `order-modal-button ${getMetrikaClass('file', tariff)}`;

  return (
    <div className="plan-uploading">
      <h3 className="plan-uploading-title">Upload floor plans of your property</h3>
      <div className="plan-uploading-container">
        <div className="plan-uploading-container-files">
          <div className="plan-uploading-container-files-list">
            {uploadPlans.map((plan, index) => (
              <div key={plan.name + index} className="plan-uploading-container-files-list-item">
                <img
                  className="plan-uploading-container-files-list-item-img"
                  src={planIcon}
                  alt="plan-icon"
                />
                <span className="plan-uploading-container-files-list-item-name">{plan.name}</span>
                <button
                  type="button"
                  className="plan-uploading-container-files-list-item-delete"
                  onClick={() => openModal(index)}
                >
                  <img src={deleteIcon} alt="delete-icon" />
                </button>
              </div>
            ))}
          </div>
          <div className="plan-uploading-container-files-more">
            <label htmlFor="upload-plan-input">
              <img src={moreIcon} alt="plus-icon" />
              <input
                id="upload-plan-input"
                ref={inputRef}
                multiple
                type="file"
                name="uploaded-plan"
                accept="image/*,application/pdf"
                title=""
                onChange={upload}
                style={{ display: 'none' }}
              />
              <span>Add files</span>
            </label>
            {tryNextStep && uploadPlans.length === 0 && (
              <p className="plan-uploading-container-files-more-error">files are required</p>
            )}
          </div>
        </div>
        <div className="plan-uploading-container-additional">
          {(tariff === TariffType.Pro || tariff === TariffType.Max) && (
            <div className="plan-uploading-container-additional-brand">
              <div
                className={`plan-uploading-container-additional-brand-logo ${
                  tryNextStep && !logo ? 'error' : ''
                }`}
              >
                <h5 className="plan-uploading-container-additional-title info">Add a logo</h5>
                <label>
                  <div
                    className={`plan-uploading-container-additional-brand-logo-input ${
                      tryNextStep && !logo ? 'error-input' : ''
                    }`}
                  />
                  <input
                    ref={logoInputRef}
                    accept="image/*,application/pdf"
                    type="file"
                    title=""
                    className={`plan-uploading-container-additional-brand-logo-input ${
                      tryNextStep && !logo ? 'error-input' : ''
                    }`}
                    placeholder="Logo.png or Logo.svg"
                    onChange={(e) => setLogo(e.target.files[0])}
                    hidden
                  />
                  <p
                    className={`plan-uploading-container-additional-brand-logo-name ${
                      tryNextStep && !logo ? 'error-text' : logo ? '' : 'opacity'
                    }`}
                  >
                    {logo ? logo.name : 'Logo.png or Logo.svg'}
                  </p>
                </label>
                {logo && (
                  <button
                    onClick={() => setLogo(undefined)}
                    className="plan-uploading-container-additional-brand-delete"
                  >
                    <img src={deleteIcon} alt="delete-icon" />
                  </button>
                )}
              </div>
              <div className="plan-uploading-container-additional-brand-link">
                <h5 className="plan-uploading-container-additional-title">Link to your website</h5>
                <input
                  value={StepOrderStore.link || ''}
                  onChange={(e) => setLink(e.target.value)}
                  className={`plan-uploading-container-additional-brand-link-input ${
                    tryNextStep && !link ? 'error-input' : ''
                  }`}
                  placeholder="Example: https://property.com"
                />
                {StepOrderStore.link && (
                  <button
                    onClick={() => setLink('')}
                    className="plan-uploading-container-additional-brand-delete"
                  >
                    <img src={deleteIcon} alt="delete-icon" />
                  </button>
                )}
              </div>
              <img
                className="plan-uploading-container-additional-info"
                src={infoIcon}
                alt="info"
                onClick={() => setLogoInfoVisible(true)}
              />
              {logoInfoVisible && (
                <div className="plan-uploading-info">
                  AI will include your logo and the website link of your company or property in the
                  360 virtual tour
                  <img
                    className="plan-uploading-info-close"
                    src={closeIcon}
                    alt="close-icon"
                    onClick={() => setLogoInfoVisible(false)}
                  />
                </div>
              )}
            </div>
          )}
          <div className="plan-uploading-container-additional-comment">
            <h5 className="plan-uploading-container-additional-title info">Comment on the order</h5>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="plan-uploading-container-additional-comment-input"
              placeholder="What are your wishes for AI processing?"
            />
            <img
              className="plan-uploading-container-additional-info"
              src={infoIcon}
              alt="info"
              onClick={() => setCommentInfoVisible(true)}
            />
            {commentInfoVisible && (
              <div className="plan-uploading-info plan-uploading-info-right">
                You can share your thoughts on AI processing of your floor plan or comments about
                furniture size and placement
                <img
                  className="plan-uploading-info-close"
                  src={closeIcon}
                  alt="close-icon"
                  onClick={() => setCommentInfoVisible(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="order-modal-buttons">
        <button className="order-modal-button order-modal-button-second" onClick={openPrevStep}>
          Back
        </button>
        <button className={nextButtonClass} onClick={tryOpenNextStep}>
          {buttonText}
        </button>
      </div>
      {modalVisible && (
        <div className="plan-uploading-modal" onClick={() => setModalVisible(false)}>
          <div onClick={(e) => e.stopPropagation()} className="plan-uploading-modal-body">
            <img className="plan-uploading-modal-body-house" src={houseSmileIcon} alt="house" />
            <h3 className="plan-uploading-modal-body-title">Are you sure?</h3>
            <p className="plan-uploading-modal-body-subtitle">You won’t be able to revert this</p>
            <div className="plan-uploading-modal-body-buttons">
              <button
                className="plan-uploading-modal-body-buttons-item"
                onClick={deleteFileAndCloseModal}
              >
                Yes, delete it
              </button>
              <button
                className="plan-uploading-modal-body-buttons-item"
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </button>
            </div>
            <img
              className="plan-uploading-modal-body-close"
              src={closeIcon}
              alt="close-icon"
              onClick={() => setModalVisible(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default PlanUploading;
