import i18n from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initReactI18next } from 'react-i18next';
import { StyleSheetManager } from 'styled-components';

import App from './App';

i18n.use(initReactI18next).init({
  resources: {
    de: {
      translation: {
        title: 'Cookie Einstellungen',
        paragraph1: 'Wir verwenden Cookies und Daten, um ',
        listItem1:
          'die Anmeldung, Registration und sichere Nutzung von Little World zu ermöglichen',
        listItem2: 'Cookie Einwilligungen zu verwalten.',
        listItem3: 'verschiedene Sprachen anzuzeigen.',
        paragraph2:
          'Wenn Sie „Alle akzeptieren“ auswählen, verwenden wir Cookies und Daten auch, um',
        listItem4: 'die Nutzung unserer Webseite statistisch auszuwerten.',
        listItem5: 'unsere Öffentlichkeitsarbeit zu verbessern.',
        disclaimer1:
          'Wenn Sie „Alle ablehnen“ auswählen, verwenden wir Cookies nicht für diese zusätzlichen Zwecke.',
        disclaimer2:
          'Die Einstellungen für Cookies können Sie jederzeit aufrufen und diese auch nachträglich abwählen.',
        declineButton: 'Alle ablehnen',
        acceptButton: 'Alle akzeptieren',
        cookieSettings: 'Cookie-Einstellungen',
        moreOptions: 'Weitere Optionen',
        impressum: 'Impressum',
        dataPrivacy: 'Datenschutz',
        settingsTitle: 'Cookie-Einstellungen',
        settingsIntro:
          'Hier können Sie auswählen, welche Cookies wir verwenden dürfen. Notwendige Cookies sind für den Betrieb der Seite erforderlich und können nicht deaktiviert werden.',
        requiredBadge: 'Immer aktiv',
        toggleLabel: 'Aktiviert',
        showCookies: 'Details anzeigen',
        saveButton: 'Einstellungen speichern',
        back: 'Zurück',
        saved: 'Einstellungen erfolgreich gespeichert',
        saveError: 'Einstellungen konnten nicht gespeichert werden.',
        'groups.analytics.name': 'Statistik',
        'groups.analytics.description':
          'Google Analytics und Facebook Pixel helfen uns zu verstehen, wie unsere Seite genutzt wird.',
        'groups.lw_func_cookies.name': 'Notwendige Cookies',
        'groups.lw_func_cookies.description':
          'Diese Cookies sind für die grundlegende Funktionalität von Little World erforderlich.',
      },
    },
    en: {
      translation: {
        title: 'Cookie settings',
        paragraph1: 'We use cookies and data to ',
        listItem1: 'enable sign-up, registration and secure use of Little World',
        listItem2: 'manage cookie consents.',
        listItem3: 'display different languages.',
        paragraph2: 'If you select "Accept all", we also use cookies and data to',
        listItem4: 'statistically analyse how our website is used.',
        listItem5: 'improve our public outreach.',
        disclaimer1: 'If you select "Decline all", we do not use cookies for these additional purposes.',
        disclaimer2: 'You can open the cookie settings at any time and change them afterwards.',
        declineButton: 'Decline all',
        acceptButton: 'Accept all',
        cookieSettings: 'Cookie settings',
        moreOptions: 'More options',
        impressum: 'Imprint',
        dataPrivacy: 'Privacy',
        settingsTitle: 'Cookie settings',
        settingsIntro:
          'Here you can choose which cookies we may use. Necessary cookies are required for the site to work and cannot be disabled.',
        requiredBadge: 'Always active',
        toggleLabel: 'Enabled',
        showCookies: 'Show details',
        saveButton: 'Save settings',
        back: 'Back',
        saved: 'Settings saved successfully',
        saveError: 'Could not save the settings.',
        'groups.analytics.name': 'Statistics',
        'groups.analytics.description':
          'Google Analytics and Facebook Pixel help us understand how our site is used.',
        'groups.lw_func_cookies.name': 'Necessary cookies',
        'groups.lw_func_cookies.description':
          'These cookies are required for the basic functionality of Little World.',
      },
    },
  },
  lng:
    typeof document !== 'undefined' &&
    (document.documentElement.getAttribute('lang') || '').toLowerCase().startsWith('en')
      ? 'en'
      : 'de',
  fallbackLng: 'de',

  interpolation: {
    escapeValue: false,
  },
});

const renderApp = (
  cookieGroupsJSON,
  cookieSetsJSON,
  cookieStateDictJSON,
  toImpressumFunc,
  toPrivacyFunc,
  cookieBannerIsHidden = false,
  scriptsToAdd = {},
  cookieConsentName = 'backend_cookie_consent',
) => {
  const host = document.querySelector('#shadow-root');
  const shadow = host.attachShadow({ mode: 'open' });

  // slot where we will attach the StyleSheetManager
  const styleSlot = document.createElement('section');
  shadow.appendChild(styleSlot);

  // element where we would render our app
  const renderIn = document.createElement('div');
  renderIn.id = 'cookie-root';
  // append the renderIn element inside the styleSlot
  styleSlot.appendChild(renderIn);

  const root = ReactDOM.createRoot(renderIn);
  root.render(
    <React.StrictMode>
      <StyleSheetManager target={styleSlot}>
        <App
          cookieGroups={JSON.parse(cookieGroupsJSON)}
          cookieSets={JSON.parse(cookieSetsJSON)}
          cookieStates={cookieStateDictJSON}
          cookieConsentName={cookieConsentName}
          toImpressumFunc={toImpressumFunc}
          toPrivacyFunc={toPrivacyFunc}
          cookieBannerIsHidden={cookieBannerIsHidden}
          cookieScriptMap={scriptsToAdd}
        />
      </StyleSheetManager>
    </React.StrictMode>,
  );
};

window.cookieBanner = renderApp;