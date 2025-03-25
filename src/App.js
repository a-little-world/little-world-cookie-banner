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

const shouldBannerBeShown = () => {
  const cookieValue = Cookies.get(SHOW_BANNER_COOKIE_NAME);
  console.log({cookieValue})
  return cookieValue === undefined ? true : false;
};

function App({
  cookieGroups,
  cookieSets,
  cookieStates,
  toImpressumFunc,
  toPrivacyFunc,
}) {
  const styles = indexCSS; // All merged styles ( neeed to be included like this since we are using a shadow dom )

  const [show, setShow] = useState(shouldBannerBeShown());

  const statesToString = states => {
    const out = [];
    Object.keys(states).forEach(k => {
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
      g => g.fields.varname === cookieVarName,
    )[0];

    const group_id = group.pk;
    cookieStates[cookieVarName] = isAccepted ? group.fields.created : '-1';

    Cookies.remove('cookie_consent');
    const cookieString = statesToString(cookieStates);
    Cookies.set('cookie_consent', cookieString, {
      domain: '.little-world.com',
      expires: 30 /** cookie valid for 30 days then the cookie banner is shown again regardless */,
      path: '/',
    });

    if (isAccepted) {
      acceptAndInjectScripts(group_id, cookieSets);
    }
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
      domain: '.little-world.com',
      expires: 30 /** cookie valid for 30 days then the cookie banner is shown again regardless */,
      path: '/',
    });
    declineAllNonEssentialCookies();
    setShow(false); // We still hide the banner, but we don't store the cookie as accepted
  };

  const onAccept = () => {
    Cookies.set(SHOW_BANNER_COOKIE_NAME, '1', {
      domain: '.little-world.com',
      expires: 30 /** cookie valid for 30 days then the cookie banner is shown again regardless */,
      path: '/',
    });
    acceptAllNonEssentialCookies();
    setShow(false);
  };

  useEffect(() => {
    if (cookieStates === null) {
      //Means we should determine the state our selfs
      const current_accept_state = Cookies.get('cookie_consent') || '';

      if (current_accept_state === '') {
        cookieStates = {};
      } else {
        //cookieStages = current_accept_state.split('|');

        cookieStates = {};
        current_accept_state.split('|').forEach(e => {
          const keys = e.split('=');
          cookieStates[keys[0]] = keys[1];
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
  );
}

export default App;
