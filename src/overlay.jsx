export function OverlayMacro({children}) {
  return (
    <div className="overlay">
      <div className="overlay-modal">
        {children}
      </div>
    </div>
  );

}

export function OverlayMin({title, subtitle, children}){
  return (
    <div className="overlay">
      <div className="overlay-modal">
        <div className="modal-top">
          <div className="modal-header">
            <h3 className="title">{title}</h3>
            <span className="subtitle">{subtitle}</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );

}

export function Overlay({ title, subtitle, text, acceptButtonText, declineButtonText, onOk, onExit }) {
  // const { t } = useTranslation();

  return (
    <div className="overlay">
      <div className="overlay-modal">
        <div className="modal-top">
          <div className="modal-header">
            <h3 className="title">{title}</h3>
            <span className="subtitle">{subtitle}</span>
          </div>
        </div>
        {text}
        <div className="av-setup-button-container">
          <button type="button" className="av-setup-decline" onClick={onExit}>
            {declineButtonText}
          </button>
          <button type="button" className="av-setup-confirm" onClick={onOk}>
            {acceptButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function OverlayButtonsChild({ title, subtitle, children, acceptButtonText, declineButtonText, onOk, onExit }) {
  // const { t } = useTranslation();

  return (
    <div className="overlay">
      <div className="overlay-modal">
        <div className="modal-top">
          <div className="modal-header">
            <h3 className="title">{title}</h3>
            <span className="subtitle">{subtitle}</span>
          </div>
        </div>
        {children}
        <div className="av-setup-button-container">
          <button type="button" className="av-setup-decline" onClick={onExit}>
            {declineButtonText}
          </button>
          <button type="button" className="av-setup-confirm" onClick={onOk}>
            {acceptButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function OverlayOnlyCloseButton({ title, subtitle, text, acceptButtonText, onOk }) {
  return (
    <div className="overlay">
      <div className="overlay-modal">
        <div className="modal-top">
          <div className="modal-header">
            <h3 className="title">{title}</h3>
            <span className="subtitle">{subtitle}</span>
          </div>
        </div>
        {text}
        <div className="av-setup-button-container">
          <button type="button" className="av-setup-confirm" onClick={onOk}>
            {acceptButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
export function OverlayOnlyCloseButtonChilds({ title, subtitle, children, acceptButtonText, onOk }) {
  return (
    <div className="overlay">
      <div className="overlay-modal">
        <div className="modal-top">
          <div className="modal-header">
            <h3 className="title">{title}</h3>
            <span className="subtitle">{subtitle}</span>
          </div>
        </div>
        {children}
        <div className="av-setup-button-container">
          <button type="button" className="av-setup-confirm" onClick={onOk}>
            {acceptButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}