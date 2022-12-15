import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import $ from 'jquery';
import {
  addScriptSrcToDom,
  addScriptToDom,
  acceptAndInjectScripts,
} from './cookieTagInsertionLib';
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
}) {
  const styles = indexCSS; // All merged styles ( neeed to be included like this since we are using a shadow dom )

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
