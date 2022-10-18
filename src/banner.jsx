import "./overlay.css";
import "./cookieBanner.css"
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
// import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation, initReactI18next } from "react-i18next";
import $ from "jquery";
import { BACKEND_URL, STORYBOOK } from "./ENVIRONMENT";

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

export const CookieBannerNew = ({cookieGroups, cookieSets, cookieStates }) => {
  const showBannerCookieName = "cookieSelectionDone";
  const shouldBannerBeShown = () => {
    const cookieValue = Cookies.get(showBannerCookieName);
    return cookieValue === undefined ? true : false;
  }
  const [show, setShow] = useState(shouldBannerBeShown());
  const { t } = useTranslation();
  const getAllCookiesFromGroup = (group) => {
    return cookieSets.filter(cookie => cookie.fields.cookiegroup === group.pk)
  }

  const cookieAcceptanceUpdate = (isAccepted, cookieVarName) => {
      $.ajax({
        type: "POST",
        url: `${BACKEND_URL}/cookies/${isAccepted ? "accept" : "decline"}/${cookieVarName}/`,
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
        data: {
        },
        success : () => {console.log("Operation suceeded")},
        error : () => {console.log("Operation failed")}
      });
  }

  const declineAllNonEssentialCookies = () => {
    // Declines all cookies that are not essential
    cookieGroups.forEach(e => {
      if(!e.fields.is_required){
        cookieAcceptanceUpdate(false, e.fields.varname);
      }
    })
  }

  const acceptAllNonEssentialCookies = () => {
    // Declines all cookies that are not essential
    cookieGroups.forEach(e => {
      console.log("COOK", e);
      if(!e.fields.is_required){
        cookieAcceptanceUpdate(true, e.fields.varname);
      }
    })
  }

  const onExit = () => {
    Cookies.set(showBannerCookieName, "1");
    declineAllNonEssentialCookies();
    setShow(false); // We still hide the banner, but we don't store the cookie as accepted
  }
  const onOk = () => {
    Cookies.set(showBannerCookieName, "1")
    acceptAllNonEssentialCookies()
    setShow(false);
  }

  const clickSmallCookie = () => {
    setShow(true);
  }
  return ( show ? <OverlayMacro>
    <div className="banner-dynamic-break">
      <div className="banner-img-container">
        <img alt="cookie missing"></img>
      </div>
      <div className="banner-body">
        <h1>
          Cookie Einstellungen
        </h1>
        <p>
          <b>Wir verwenden Cookies und Daten, um </b>
          <ul>
            <li>Die Anmeldung, Registration und sichere Nutzung von Little World zu ermöglichen</li>
            <li>Cookie Einwilligungen zu verwalten.</li>
            <li>verschiedene sprachen anzuzeigen.</li>
          </ul>
        </p>
        <p>
          <b>Wenn Sie „Alle akzeptieren“ auswählen, verwenden wir Cookies und Daten auch, um </b>
          <ul>
            <li>die Nutzung unserer Webseite statistisch auszuwerten.</li>
            <li>auf Sie zugeschnittene Werbung anzuzeigen.</li>
          </ul>
        </p>
        <p>
          <b> Wenn Sie „Alle ablehnen“ auswählen, verwenden wir Cookies nicht für diese zusätzlichen Zwecke. </b> <br></br>
          Die Einstellungen für Cookies können Sie jederzeit aufrufen und diese auch nachträglich abwählen.
        </p>
        <div className="banner-button-container clearfix">
          <button type="button" className="av-setup-decline left" onClick={onExit}>
            Alle ablehnen
          </button>
          <button type="button" className="av-setup-confirm right" onClick={onOk}>
            Alle akzeptieren
          </button>
        </div>
        <div className="banner-extra-options-dyn-container">
          <div className="banner-spacer"></div>
          <div className="banner-more-options" style={{ display: "none"}}>
            <a href="/cookies">
              Weitere optionen
            </a>
          </div>
          <div className="banner-more-options">
            <div className="banner-button-container banner-small-container">
              <button className="left link-button" onClick={() => {window.showImpressum()}}>Impressum</button>
              <button className="right link-button" onClick={() => {window.showAGB()}}>Datenschutz</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </OverlayMacro> :
    <div className="cookieBannerHidden" onClick={() => {clickSmallCookie()}}>
    </div>);
}
