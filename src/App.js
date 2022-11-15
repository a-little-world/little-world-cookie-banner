import { indexCSS, cookieBannerCSS, overlayCSS } from './styles';
import { CookieBig, CookieSmall } from './svg';
import React, { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation, initReactI18next } from 'react-i18next';
import $ from 'jquery';
import { BACKEND_URL, STORYBOOK } from './ENVIRONMENT';
import { OverlayMacro } from './overlay';
import {
  addScriptSrcToDom,
  addScriptToDom,
  acceptAndInjectScripts,
} from './cookieTagInsertionLib';

function CookieBanner({
  cookieGroups,
  cookieSets,
  cookieStates,
  toImpressumFunc,
  toPrivacyFunc,
}) {
  const styles =
    indexCSS + '\n' + cookieBannerCSS + '\n' + overlayCSS; // All merged styles ( neeed to be included like this since we are using a shadow dom )

  const showBannerCookieName = 'cookieSelectionDone';
  const shouldBannerBeShown = () => {
    const cookieValue = Cookies.get(showBannerCookieName);
    console.log('current show state', cookieValue);
    return cookieValue === undefined ? true : false;
  };
  const [show, setShow] = useState(shouldBannerBeShown());
  const { t } = useTranslation();
  const getAllCookiesFromGroup = (group) => {
    return cookieSets.filter(
      (cookie) => cookie.fields.cookiegroup === group.pk
    );
  };
  console.log(cookieGroups, cookieSets, cookieStates);

  const statesToString = (states) => {
    const out = [];
    Object.keys(states).forEach((k) => {
      out.push(k.toString() + '=' + states[k].toString());
    });
    return out.join('|');
  };

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
    const group = cookieGroups.filter(
      (g) => g.fields.varname === cookieVarName
    )[0];

    const group_id = group.pk;
    console.log(group, cookieVarName, isAccepted);
    cookieStates[cookieVarName] = isAccepted
      ? group.fields.created
      : '-1';

    Cookies.remove('cookie_consent');
    const cookieString = statesToString(cookieStates);
    console.log('Writing cookie string', cookieString);
    Cookies.set('cookie_consent', cookieString);

    console.log('Updated cookie states', cookieStates);

    if (isAccepted) {
      console.log('ACCEPTED: ', cookieVarName);
      console.log('Group id', group_id);
      acceptAndInjectScripts(group_id, cookieSets);
    }
  };
  var currentConsentState = {};

  const loadCurrentConsents = () => {
    const cookieName = 'cookie_consent';
    return Cookies.get(cookieName, ''); //The current acceptance state
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

  const acceptAllNonEssentialCookies = () => {
    // Declines all cookies that are not essential
    cookieGroups.forEach((e) => {
      console.log('COOK', e);
      if (!e.fields.is_required) {
        cookieAcceptanceUpdate(true, e.fields.varname);
      }
    });
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
    console.log('STARUP', Cookies.get('cookieSelectionDone'));
    const current_accept_state = Cookies.get('cookie_consent') || '';
    if (cookieStates === null) {
      //Means we should determine the state our selfs
      console.log('Cookie state null was passsed');
      const current_accept_state =
        Cookies.get('cookie_consent') || '';
      console.log('current acceptance', current_accept_state);
      if (current_accept_state === '') {
        cookieStates = {};
        console.log('Set empty state dict');
      } else {
        console.log(
          'Trying to self determine state',
          current_accept_state.split('|')
        );
        //cookieStages = current_accept_state.split('|');

        cookieStates = {};
        current_accept_state.split('|').forEach((e) => {
          const keys = e.split('=');
          console.log(keys);
          cookieStates[keys[0]] = keys[1];
        });
        console.log('Determined', cookieStates);
      }
    }
    // Then we might have to load in script that that category wants
    Object.keys(cookieStates).forEach((set) => {
      if (cookieStates[set] !== '-1') {
        console.log('Found existing cookie to be accepted', set);
        const group = cookieGroups.filter(
          (g) => g.fields.varname === set
        )[0];

        const group_id = group.pk;
        console.log('belonging to group', group, 'adding...');
        acceptAndInjectScripts(group_id, cookieSets);
      }
    });
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
