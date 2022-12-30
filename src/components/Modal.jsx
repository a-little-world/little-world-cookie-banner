import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
// import FocusTrap from 'focus-trap-react';
import {
  bool,
  element,
  func,
  node,
  object,
  oneOfType,
  string,
} from 'prop-types';

export const BACKDROP_LABEL = 'dialog backdrop';
const ROOT_LABEL = '#root';

const BackdropContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 32px;
  background-color: rgba(51, 51, 51, 0.3);
  backdrop-filter: blur(8px);
  opacity: 0;
  transition: all 100ms cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 200ms;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;

  > div {
    transform: translateY(100px);
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
  }

  ${({ $active }) => $active && css`
    transition-duration: 250ms;
    transition-delay: 0ms;
    opacity: 1;

    > div {
      transform: translateY(0);
      opacity: 1;
      transition-delay: 150ms;
      transition-duration: 350ms;
    }
  `
  }
}
`

const Modal = ({ children, open, onClose, locked, parent, className }) => {
  const [active, setActive] = useState(false);

  const backdrop = useRef(null);
  const el = useMemo(() => document.createElement('div'), []);

  useEffect(() => {
    const target = parent && parent.appendChild ? parent : document.body;
    target.appendChild(el);

    return () => {
      target.removeChild(el);
    };
  }, [el, parent, className]);

  useEffect(() => {
    const { current } = backdrop;
    const transitionEnd = () => setActive(open);
    const keyHandler = e => !locked && [27].indexOf(e.which) >= 0 && onClose();
    const clickHandler = e => !locked && e.target === current && onClose();
    let openTimeout;

    if (current) {
      current.addEventListener('transitionend', transitionEnd);
      current.addEventListener('click', clickHandler);
      window.addEventListener('keyup', keyHandler);
    }

    if (open) {
      openTimeout = window.setTimeout(() => {
        document.activeElement.blur();
        setActive(open);
        document.querySelector(ROOT_LABEL)?.setAttribute('inert', 'true');
      }, 10);
    }

    return () => {
      if (current) {
        current.removeEventListener('transitionend', transitionEnd);
        current.removeEventListener('click', clickHandler);
      }

      clearTimeout(openTimeout);
      document.querySelector(ROOT_LABEL)?.removeAttribute('inert');
      window.removeEventListener('keyup', keyHandler);
    };
  }, [open, locked, onClose]);

  const Backdrop = (
      <BackdropContainer
        aria-modal={true}
        aria-label={BACKDROP_LABEL}
        ref={backdrop}
        $active={active && open}
      >
        {children}
      </BackdropContainer>
  );

  if (open || active) return Backdrop;
  return null;
};

Modal.propTypes = {
  children: node.isRequired,
  className: string,
  locked: bool,
  open: oneOfType([bool, string]).isRequired,
  onClose: func.isRequired,
  parent: oneOfType([element, object]),
};

Modal.defaultProps = {
  locked: false,
};

export default Modal;
