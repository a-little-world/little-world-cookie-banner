import { indexCSS, cookieBannerCSS, overlayCSS } from './styles';
import { CookieBig, CookieSmall } from './svg';
import React, { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation, initReactI18next } from 'react-i18next';
import $ from 'jquery';
import { BACKEND_URL, STORYBOOK } from './ENVIRONMENT';
import { OverlayMacro } from './overlay';

function CookieBanner({
  cookieGroups,
  cookieSets,
  cookieStates,
  toImpressumFunc,
  toPrivacyFunc,
  cookieScriptMap = {},
}) {
  const styles =
    indexCSS + '\n' + cookieBannerCSS + '\n' + overlayCSS; // All merged styles ( neeed to be included like this since we are using a shadow dom )

  const showBannerCookieName = 'cookieSelectionDone';
  const shouldBannerBeShown = () => {
    const cookieValue = Cookies.get(showBannerCookieName);
    return cookieValue === undefined ? true : false;
  };
  const [show, setShow] = useState(shouldBannerBeShown());
  const { t } = useTranslation();
  const getAllCookiesFromGroup = (group) => {
    return cookieSets.filter(
      (cookie) => cookie.fields.cookiegroup === group.pk
    );
  };
  var currentConsentState = {};

  const cookieAcceptanceUpdate = (isAccepted, cookieVarName) => {
    $.ajax({
      type: 'POST',
      url: `${BACKEND_URL}/cookies/${
        isAccepted ? 'accept' : 'decline'
      }/${cookieVarName}/`,
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      data: {},
      success: () => {
        console.log('Operation suceeded');
      },
      error: () => {
        console.log('Operation failed');
      },
    });
  };

  const loadCurrentConsents = () => {
    const cookieName = 'cookie_consent';
    return Cookies.get(cookieName, {}); //The current acceptance state
  };

  const addScriptBySrc = (scriptSrc, id) => {
    const script = document.createElement('script');
    document.head.appendChild(script);
    script.async = true;
    script.id = id;
    script.src = scriptSrc;
  };

  const addScriptFromString = (scriptString, id) => {
    const script = document.createElement('script');
    document.head.appendChild(script);
    var inlineScript = document.createTextNode(scriptString);
    script.appendChild(inlineScript);
    document.head.appendChild(script);
    script.async = true;
    script.id = id;
  };

  const declineAllNonEssentialCookies = () => {
    // Declines all cookies that are not essential
    cookieGroups.forEach((e) => {
      if (!e.fields.is_required) {
        cookieAcceptanceUpdate(false, e.fields.varname);
      }
    });
  };

  const addAllOfCookieGroup = (groupname) => {
    console.log('adding all script of ', groupname);
    if (groupname in cookieScriptMap) {
      cookieScriptMap[groupname].src.forEach((src, i) => {
        addScriptBySrc(src, groupname + '-' + i);
      });
      cookieScriptMap[groupname].codes.forEach((code, i) => {
        addScriptFromString(code, groupname + '-' + i);
      });
    }
  };

  const acceptAllNonEssentialCookies = () => {
    // Declines all cookies that are not essential
    cookieGroups.forEach((e) => {
      console.log('COOK', e);
      if (!e.fields.is_required) {
        cookieAcceptanceUpdate(true, e.fields.varname);
      }
      console.log('varname', e.fields.varname);
      if (e.fields.varname in cookieScriptMap) {
        console.log('Found existing tag');
        console.log('Adding: ', cookieScriptMap[e.fields.varname]);
        addAllOfCookieGroup(e.fields.varname);
      }
      currentConsentState[e.fields.varname] = '1';
    });
    /*
    TODO set the cookies in the browser if it's not done by request
    Cookies.set(
      'cookie_consent',
      Object.entries(currentConsentState)
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
        )
        .join('&')
        .toString()
    );
    */
  };

  const onExit = () => {
    Cookies.set(showBannerCookieName, '1');
    declineAllNonEssentialCookies();
    setShow(false); // We still hide the banner, but we don't store the cookie as accepted
  };
  const onOk = () => {
    Cookies.set(showBannerCookieName, '1');
    acceptAllNonEssentialCookies();
    setShow(false);
  };

  const clickSmallCookie = () => {
    setShow(true);
  };

  useEffect(() => {
    console.log(
      'Banner rendered',
      cookieGroups,
      cookieSets,
      cookieStates
    );
    console.log(cookieStates);
    currentConsentState = Object.assign(
      {},
      loadCurrentConsents(),
      cookieSets
    );

    cookieGroups.forEach((e) => {
      if (e.fields.varname in currentConsentState) {
        if (currentConsentState[e.fields.varname] === '1') {
          addAllOfCookieGroup(e.fields.varname);
        }
      } else {
        // Then add all scripts of that kind regardless
        addAllOfCookieGroup(e.fields.varname);
      }
    });
    Cookies.set('cookie_consent', currentConsentState);
  });

  return (
    <div id="reset-this-root" className="reset-this">
      <style>{styles}</style>
      {show ? (
        <OverlayMacro>
          <div className="banner-dynamic-break">
            <div className="banner-img-container">
              <CookieBig></CookieBig>
            </div>
            <div className="banner-body">
              <h1>Cookie Einstellungen</h1>
              <p>
                <b>Wir verwenden Cookies und Daten, um </b>
                <ul>
                  <li>
                    Die Anmeldung, Registration und sichere Nutzung
                    von Little World zu ermöglichen
                  </li>
                  <li>Cookie Einwilligungen zu verwalten.</li>
                  <li>verschiedene sprachen anzuzeigen.</li>
                </ul>
              </p>
              <p>
                <b>
                  Wenn Sie „Alle akzeptieren“ auswählen, verwenden wir
                  Cookies und Daten auch, um{' '}
                </b>
                <ul>
                  <li>
                    die Nutzung unserer Webseite statistisch
                    auszuwerten.
                  </li>
                  <li>auf Sie zugeschnittene Werbung anzuzeigen.</li>
                </ul>
              </p>
              <p>
                <b>
                  {' '}
                  Wenn Sie „Alle ablehnen“ auswählen, verwenden wir
                  Cookies nicht für diese zusätzlichen Zwecke.{' '}
                </b>{' '}
                <br></br>
                Die Einstellungen für Cookies können Sie jederzeit
                aufrufen und diese auch nachträglich abwählen.
              </p>
              <div className="banner-button-container clearfix">
                <button
                  type="button"
                  className="av-setup-decline left"
                  onClick={onExit}
                >
                  Alle ablehnen
                </button>
                <button
                  type="button"
                  className="av-setup-confirm right"
                  onClick={onOk}
                >
                  Alle akzeptieren
                </button>
              </div>
              <div className="banner-extra-options-dyn-container">
                <div className="banner-spacer"></div>
                <div
                  className="banner-more-options"
                  style={{ display: 'none' }}
                >
                  <a href="/cookies">Weitere optionen</a>
                </div>
                <div className="banner-more-options">
                  <div className="banner-button-container banner-small-container">
                    <button
                      className="left link-button"
                      onClick={() => {
                        toImpressumFunc();
                      }}
                    >
                      Impressum
                    </button>
                    <button
                      className="right link-button"
                      onClick={() => {
                        toPrivacyFunc();
                      }}
                    >
                      Datenschutz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </OverlayMacro>
      ) : (
        <div
          className="cookieBannerHidden"
          onClick={() => {
            clickSmallCookie();
          }}
        >
          <CookieSmall></CookieSmall>
        </div>
      )}
    </div>
  );
}

export default CookieBanner;
