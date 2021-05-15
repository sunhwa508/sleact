import React, { CSSProperties, FC, useCallback } from 'react';
import { CreateModal, CloseModalButton } from './styles';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  style?: CSSProperties;
  closeButton?: boolean;
}

const Modal: FC<Props> = ({ show, style, closeButton, children, onCloseModal }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }
  return (
    <CreateModal onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateModal>
  );
};

export default Modal;
