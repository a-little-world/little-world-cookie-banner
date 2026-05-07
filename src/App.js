import {
  CustomThemeProvider,
  Modal,
} from '@a-little-world/little-world-design-system';
import $ from 'jquery';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

import { BACKEND_URL } from './ENVIRONMENT';
import CookieBanner from './components/CookieBanner';
import OpenBannerButton from './components/OpenBannerButton';
import { acceptAndInjectScripts } from './cookieTagInsertionLib';
import { indexCSS } from './styles';

const SHOW_BANNER_COOKIE_NAME = 'cookieSelectionDone';
const LEGACY_COOKIE_CONSENT_NAME = 'cookie_consent';
const SHARED_COOKIE_DOMAIN = '.little-world.com';

const buildConsentCookieValue = (states = {}) =>
  Object.entries(states)
    .map(([key, value]) => `${key}=${value}`)
    .join('|');

const shouldBannerBeShown = () => {
  const cookieValue = Cookies.get(SHOW_BANNER_COOKIE_NAME);
  return cookieValue === undefined ? true : false;
};

function App({
  cookieGroups,
  cookieSets,
  cookieStates,
  cookieConsentName = 'backend_cookie_consent',
  toImpressumFunc,
  toPrivacyFunc,
  cookieBannerIsHidden,
}) {
  const styles = indexCSS; // All merged styles ( neeed to be included like this since we are using a shadow dom )

  const [show, setShow] = useState(shouldBannerBeShown());

  const writeConsentCookie = () => {
    const cookieValue = buildConsentCookieValue(cookieStates);
    const options = {
      domain: SHARED_COOKIE_DOMAIN,
      expires: 365,
      path: '/',
      sameSite: 'Lax',
      secure: window.location.protocol === 'https:',
    };

    Cookies.set(cookieConsentName, cookieValue, options);
    // Keep legacy key in sync until all consumers fully migrate.
    Cookies.set(LEGACY_COOKIE_CONSENT_NAME, cookieValue, options);
  };

  const cookieAcceptanceUpdate = (isAccepted, cookieVarName) => {
    $.ajax({
      type: 'POST',
      url: `${BACKEND_URL}/cookies/${isAccepted ? 'accept' : 'decline'
        }/${cookieVarName}/`,
      crossDomain: true,
      xhrFields: {
        withCredentials: true,
      },
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      data: {},
      success: () => {
        console.log('Operation succeeded');
      },
      error: () => {
        // Keep UI state consistent even if backend cookie write fails.
        console.log('Operation failed, using frontend consent cookie fallback');
      },
    });
    const group = cookieGroups.filter(
      g => g.fields.varname === cookieVarName,
    )[0];

    const group_id = group.pk;
    cookieStates[cookieVarName] = isAccepted ? group.fields.created : '-1';

    if (isAccepted) {
      acceptAndInjectScripts(group_id, cookieSets);
    }

    writeConsentCookie();
  };

  const declineAllNonEssentialCookies = () => {
    // Declines all cookies that are not essential
    cookieGroups.forEach(e => {
      if (!e.fields.is_required) {
        cookieAcceptanceUpdate(false, e.fields.varname);
      }
    });
  };

  const acceptAllNonEssentialCookies = () => {
    // Declines all cookies that are not essential
    cookieGroups.forEach(e => {
      if (!e.fields.is_required) {
        cookieAcceptanceUpdate(true, e.fields.varname);
      }
    });
  };

  const onExit = () => {
    Cookies.set(SHOW_BANNER_COOKIE_NAME, '1', {
      domain: SHARED_COOKIE_DOMAIN,
      expires: 30 /** cookie valid for 30 days then the cookie banner is shown again regardless */,
      path: '/',
      sameSite: 'Lax',
      secure: window.location.protocol === 'https:',
    });
    declineAllNonEssentialCookies();
    setShow(false);
  };

  const onAccept = () => {
    Cookies.set(SHOW_BANNER_COOKIE_NAME, '1', {
      domain: SHARED_COOKIE_DOMAIN,
      expires: 30 /** cookie valid for 30 days then the cookie banner is shown again regardless */,
      path: '/',
      sameSite: 'Lax',
      secure: window.location.protocol === 'https:',
    });
    acceptAllNonEssentialCookies();
    setShow(false);
  };

  useEffect(() => {
    if (cookieStates === null || Object.keys(cookieStates).length === 0) {
      //Means we should determine the state our selfs
      const current_accept_state =
        Cookies.get(cookieConsentName)
        || Cookies.get(LEGACY_COOKIE_CONSENT_NAME)
        || '';
      const normalized_accept_state = current_accept_state.replace(/^"|"$/g, '');

      if (normalized_accept_state === '') {
        cookieStates = {};
      } else {
        //cookieStages = current_accept_state.split('|');

        cookieStates = {};
        normalized_accept_state.split('|').forEach(e => {
          const [key, ...valueParts] = e.split('=');
          if (key) {
            cookieStates[key] = valueParts.join('=');
          }
        });
      }
    }
    // Then we might have to load in script that that category wants
    Object.keys(cookieStates).forEach(set => {
      if (cookieStates[set] !== '-1') {
        const group = cookieGroups.filter(g => g.fields.varname === set)[0];

        const group_id = group.pk;
        acceptAndInjectScripts(group_id, cookieSets);
      }
    });
  });

  return (
    <>
      {cookieBannerIsHidden ? null : (
        <CustomThemeProvider>
          <style>{styles}</style>
          <Modal open={show} onClose={() => setShow(false)} createInPortal={false} locked>
            <CookieBanner
              onExit={onExit}
              onAccept={onAccept}
              toImpressumFunc={toImpressumFunc}
              toPrivacyFunc={toPrivacyFunc}
            />
          </Modal>
          {!show && <OpenBannerButton onClick={() => setShow(true)} />}
        </CustomThemeProvider>
      )}
    </>
  );
}

export default App;
