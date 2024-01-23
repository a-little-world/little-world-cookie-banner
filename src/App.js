import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import { BACKEND_URL } from './ENVIRONMENT';
import Cookies from 'js-cookie';

import { indexCSS } from './styles';
import CookieBanner from './components/CookieBanner';
import OpenBannerButton from './components/OpenBannerButton';
import Modal from './components/Modal';

const SHOW_BANNER_COOKIE_NAME = 'cookieSelectionDone';

function App({
  cookieGroups,
  cookieSets,
  cookieStates,
  toImpressumFunc,
  toPrivacyFunc,
  cookieScriptMap = {},
}) {
  const styles = indexCSS; // All merged styles ( neeed to be included like this since we are using a shadow dom )

  const consentState = useRef();

  const [show, setShow] = useState(false);

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

  const addAllOfCookieGroup = groupname => {
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

  const acceptAllNonEssentialCookies = () => {
    // Declines all cookies that are not essential
    cookieGroups.forEach(e => {
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
      consentState.current[e.fields.varname] = '1';
    });
    /*
        TODO set the cookies in the browser if it's not done by request
        Cookies.set(
        'cookie_consent',
        Object.entries(consentState.current)
            .map(
            ([k, v]) =>
                `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
            )
            .join('&')
            .toString()
        );
        */
  };

  const declineAllNonEssentialCookies = () => {
    // Declines all cookies that are not essential
    cookieGroups.forEach(e => {
      if (!e.fields.is_required) {
        cookieAcceptanceUpdate(false, e.fields.varname);
      }
    });
  };

  const onExit = () => {
    Cookies.set(SHOW_BANNER_COOKIE_NAME, '1');
    declineAllNonEssentialCookies();
    setShow(false); // We still hide the banner, but we don't store the cookie as accepted
  };

  const onAccept = () => {
    Cookies.set(SHOW_BANNER_COOKIE_NAME, '1');
    acceptAllNonEssentialCookies();
    setShow(false);
  };

  useEffect(() => {
    const cookieValue = Cookies.get(SHOW_BANNER_COOKIE_NAME);
    setShow(cookieValue === undefined ? true : false);
  }, []);

  useEffect(() => {
    console.log({ cookieStates, cookieSets, cookieGroups });
    consentState.current = Object.assign({}, loadCurrentConsents(), cookieSets);

    cookieGroups?.forEach(e => {
      if (e.fields.varname in consentState.current) {
        if (consentState.current[e.fields.varname] === '1') {
          addAllOfCookieGroup(e.fields.varname);
        }
      } else {
        // Then add all scripts of that kind regardless
        addAllOfCookieGroup(e.fields.varname);
      }
    });
    Cookies.set('cookie_consent', consentState.current);
  }, [cookieGroups, cookieSets, cookieStates]);

  return (
    <div id="reset-this-root" className="reset-this">
      <style>{styles}</style>
      <Modal open={show} onClose={() => setShow(false)} locked>
        <CookieBanner
          onExit={onExit}
          onAccept={onAccept}
          toImpressumFunc={toImpressumFunc}
          toPrivacyFunc={toPrivacyFunc}
        />
      </Modal>
      {!show && <OpenBannerButton onClick={() => setShow(true)} />}
    </div>
  );
}

export default App;
