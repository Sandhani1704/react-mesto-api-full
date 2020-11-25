import React from 'react';
import closeIcon from '../images/Close_Icon.svg';


function InfoTooltip({ onClose, isOpen, image, message }) {

    return (
        <section className={`popup ${isOpen && 'popup_opened'}`}>
            <div className="popup__container">
                <img className="popup__info-image" alt="Картинка" src={image} />
                <p className="popup__info-text">{message}</p>
                <button type="button" className="popup__close" onClick={onClose}><img className="popup__close-icon" src={closeIcon} alt="закрыть" /></button>
            </div>
        </section>

    );
}

export default InfoTooltip;