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

  const cookieAcceptanceUpdate = (isAccepted, cookieVarName) => {
    if (isAccepted) {
      console.log('ACCEPTED: ', cookieVarName);
      const group_id = cookieGroups.filter(
        (g) => g.fields.varname === cookieVarName
      )[0].pk;
      console.log('Group id', group_id);

      cookieSets.forEach((cookie) => {
        if (cookie.fields.cookiegroup === group_id) {
          console.log('Means you accepted', cookie);
          cookie.fields.include_srcs.forEach((s) => {
            console.log('Addming', s);
            addScriptSrcToDom(
              s,
              'src-cookie-' +
                cookie.pk.toString() +
                '-group-' +
                group_id.toString()
            );
          });
          cookie.fields.include_scripts.forEach((s) => {
            console.log('Addming', s);
            addScriptToDom(
              s,
              'script-cookie-' +
                cookie.pk.toString() +
                '-group-' +
                group_id.toString()
            );
          });
        }
      });
    }
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
