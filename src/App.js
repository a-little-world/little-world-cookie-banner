import {
  CustomThemeProvider,
  Modal,
} from '@a-little-world/little-world-design-system';
import $ from 'jquery';
import Cookies from 'js-cookie';
import React, { useEffect, useMemo, useState } from 'react';

import { BACKEND_URL } from './ENVIRONMENT';
import CookieBanner from './components/CookieBanner';
import CookieSettings from './components/CookieSettings';
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

const normalizeConsentCookieValue = value => (value || '').replace(/^"+|"+$/g, '');

const isAcceptedState = value =>
  value !== undefined && value !== null && value !== '' && value !== '-1';

const shouldOpenSettings = () =>
  typeof window !== 'undefined' && window.__lwOpenCookieSettings === true;

const shouldBannerBeShown = () => {
  const cookieValue = Cookies.get(SHOW_BANNER_COOKIE_NAME);
  return cookieValue === undefined ? true : false;
};

const selectionDoneCookieOptions = () => {
  const isProductionHost = window.location.hostname.endsWith('little-world.com');
  return {
    domain: isProductionHost ? SHARED_COOKIE_DOMAIN : undefined,
    expires: 30 /** cookie valid for 30 days then the cookie banner is shown again regardless */,
    path: '/',
    sameSite: 'Lax',
    secure: window.location.protocol === 'https:',
  };
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

  const normalizedGroups = useMemo(
    () =>
      (cookieGroups || []).map(group => ({
        varname: group.fields.varname,
        name: group.fields.name,
        description: group.fields.description,
        required: group.fields.is_required,
        cookies: (cookieSets || [])
          .filter(cookie => cookie.fields.cookiegroup === group.pk)
          .map(cookie => ({
            name: cookie.fields.name,
            description: cookie.fields.description,
            domain: cookie.fields.domain,
            path: cookie.fields.path,
          })),
      })),
    [cookieGroups, cookieSets],
  );

  const buildPreferences = () => {
    const next = {};
    normalizedGroups.forEach(group => {
      next[group.varname] = group.required ? true : isAcceptedState((cookieStates || {})[group.varname]);
    });
    return next;
  };

  const openSettingsInitially = shouldOpenSettings();
  const [show, setShow] = useState(openSettingsInitially ? true : shouldBannerBeShown());
  const [view, setView] = useState(openSettingsInitially ? 'settings' : 'banner');
  const [preferences, setPreferences] = useState(buildPreferences);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  const markSelectionDone = () => {
    Cookies.set(SHOW_BANNER_COOKIE_NAME, '1', selectionDoneCookieOptions());
  };

  const writeConsentCookie = () => {
    const cookieValue = normalizeConsentCookieValue(buildConsentCookieValue(cookieStates));
    const options = {
      domain: SHARED_COOKIE_DOMAIN,
      expires: 365,
      path: '/',
      sameSite: 'Lax',
      secure: window.location.protocol === 'https:',
    };

    Cookies.set(cookieConsentName, cookieValue, options);
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
    markSelectionDone();
    declineAllNonEssentialCookies();
    setShow(false);
  };

  const onAccept = () => {
    markSelectionDone();
    acceptAllNonEssentialCookies();
    setShow(false);
  };

  const openSettings = () => {
    setPreferences(buildPreferences());
    setSaved(false);
    setSaveFailed(false);
    setView('settings');
    setShow(true);
  };

  const handleToggle = (varname, value) => {
    setSaved(false);
    setSaveFailed(false);
    setPreferences(current => ({ ...current, [varname]: value }));
  };

  const applyPreferences = next => {
    normalizedGroups.forEach(group => {
      if (group.required) return;
      const desired = !!next[group.varname];
      if (desired !== isAcceptedState((cookieStates || {})[group.varname])) {
        cookieAcceptanceUpdate(desired, group.varname);
      }
    });
    markSelectionDone();
  };

  const onSave = () => {
    setSaving(true);
    try {
      applyPreferences(preferences);
      setSaved(true);
    } catch (e) {
      setSaveFailed(true);
    } finally {
      setSaving(false);
    }
  };

  const onAcceptAll = () => {
    const next = {};
    normalizedGroups.forEach(group => {
      next[group.varname] = true;
    });
    setPreferences(next);
    applyPreferences(next);
    setShow(false);
    setView('banner');
  };

  const onDeclineAll = () => {
    const next = {};
    normalizedGroups.forEach(group => {
      next[group.varname] = group.required;
    });
    setPreferences(next);
    applyPreferences(next);
    setShow(false);
    setView('banner');
  };

  useEffect(() => {
    // Allow any page (e.g. the dedicated /cookies page or an external trigger)
    // to open the settings view of this banner.
    window.openCookieSettings = openSettings;
  });

  useEffect(() => {
    // Ensure deprecated consent key is cleaned up everywhere.
    Cookies.remove(LEGACY_COOKIE_CONSENT_NAME, { path: '/' });
    Cookies.remove(LEGACY_COOKIE_CONSENT_NAME, {
      domain: SHARED_COOKIE_DOMAIN,
      path: '/',
    });

    if (cookieStates === null || Object.keys(cookieStates).length === 0) {
      //Means we should determine the state our selfs
      const current_accept_state =
        Cookies.get(cookieConsentName) || '';
      const normalized_accept_state = normalizeConsentCookieValue(current_accept_state);

      if (current_accept_state !== normalized_accept_state) {
        Cookies.set(cookieConsentName, normalized_accept_state, {
          domain: SHARED_COOKIE_DOMAIN,
          expires: 365,
          path: '/',
          sameSite: 'Lax',
          secure: window.location.protocol === 'https:',
        });
      }

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
        if (!group) return;

        const group_id = group.pk;
        acceptAndInjectScripts(group_id, cookieSets);
      }
    });
  }, [cookieConsentName, cookieGroups, cookieSets]);

  return (
    <>
      {cookieBannerIsHidden ? null : (
        <CustomThemeProvider>
          <style>{styles}</style>
          <Modal open={show} onClose={() => setShow(false)} createInPortal={false} locked>
            {view === 'settings' ? (
              <CookieSettings
                groups={normalizedGroups}
                preferences={preferences}
                onToggle={handleToggle}
                onAcceptAll={onAcceptAll}
                onDeclineAll={onDeclineAll}
                onSave={onSave}
                onBack={() => setView('banner')}
                saving={saving}
                saved={saved}
                saveFailed={saveFailed}
              />
            ) : (
              <CookieBanner
                onExit={onExit}
                onAccept={onAccept}
                toImpressumFunc={toImpressumFunc}
                toPrivacyFunc={toPrivacyFunc}
                onOpenSettings={openSettings}
              />
            )}
          </Modal>
          {!show && <OpenBannerButton onClick={() => setShow(true)} />}
        </CustomThemeProvider>
      )}
    </>
  );
}

export default App;