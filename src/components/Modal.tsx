import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import '../style/Modal.scss';

interface ModalProps {
  isOpen: boolean;
  icon: IconDefinition;
  text: string;
};

const translations: Record<string, string> = {
  "\"name\" is not allowed to be empty": "Lütfen bir isim giriniz.",
  "\"email\" is not allowed to be empty": "Lütfen bir e-posta adresi giriniz.",
  "\"password\" is not allowed to be empty": "Lütfen bir şifre giriniz.",
  "\"email\" must be a valid email": "Lütfen geçerli bir e-posta adresi giriniz.",
  "\"password\" with value \"12\" fails to match the required pattern: /^[a-zA-Z0-9]{6,12}$/": "Şifre en az 6 karakter olmalıdır.",
  "User already exists": "Kullanıcı zaten var.",
  "\"name\" must only contain alpha-numeric characters": "İsim yalnızca alfasayısal karakterler içermelidir.",
  "Invalid email or password": "Lütfen geçerli bir e-posta/şifre giriniz."
};

const translate = (text: string): string => {
  return translations[text] || text;
};

const Modal: React.FC<ModalProps> = ({ isOpen, icon, text }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content bg-blue-200 bg-opacity-70">
        <div className="modal-icon-circle">
          <FontAwesomeIcon icon={icon} size="2x" color="#121A4D" />
        </div>
        <div className="modal-text">{translate(text)}</div>
      </div>
    </div>
  );
};
export default Modal;
