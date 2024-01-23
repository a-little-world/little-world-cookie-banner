import React from 'react';
import ReactDOM from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { DEVELOPMENT } from './ENVIRONMENT';

i18n.use(initReactI18next).init({
  resources: {
    de: {
      translation: {
        title: 'Cookie Einstellungen',
        paragraph1: 'Wir verwenden Cookies und Daten, um ',
        listItem1:
          'Die Anmeldung, Registration und sichere Nutzung von Little World zu ermöglichen',
        listItem2: 'Cookie Einwilligungen zu verwalten.',
        listItem3: 'verschiedene sprachen anzuzeigen.',
        paragraph2:
          'Wenn Sie „Alle akzeptieren“ auswählen, verwenden wir Cookies und Daten auch, um',
        listItem4: 'die Nutzung unserer Webseite statistisch auszuwerten.',
        listItem5: 'auf Sie zugeschnittene Werbung anzuzeigen.',
        disclaimer1:
          'Wenn Sie „Alle ablehnen“ auswählen, verwenden wir Cookies nicht für diese zusätzlichen Zwecke.',
        disclaimer2:
          'Die Einstellungen für Cookies können Sie jederzeit aufrufen und diese auch nachträglich abwählen.',
        declineButton: 'Alle ablehnen',
        acceptButton: 'Alle akzeptieren',
        moreOptions: 'Weitere Optionen',
        impressum: 'Impressum',
        dataPrivacy: 'Datenschutz',
      },
    },
  },
  lng: 'de',
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
  scriptsToAdd = {},
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
          toImpressumFunc={toImpressumFunc}
          toPrivacyFunc={toPrivacyFunc}
          cookieScriptMap={scriptsToAdd}
        />
      </StyleSheetManager>
    </React.StrictMode>,
  );
};

if (DEVELOPMENT) {
  renderApp(
    '[{"model": "cookie_consent.cookiegroup", "pk": 1, "fields": {"varname": "LittleWorldFunctionalityCookies", "name": "Little World Functionality Cookies", "description": "Cookies that are required and used for the little world web application.", "is_required": true, "is_deletable": true, "ordering": 0, "created": "2022-09-30T10:31:30.191Z"}}, {"model": "cookie_consent.cookiegroup", "pk": 2, "fields": {"varname": "AnalyticsCookies", "name": "Analytics Cookies", "description": "Cookies used for analytics, this includes cookies used my Matomo.", "is_required": false, "is_deletable": true, "ordering": 0, "created": "2022-09-30T11:06:23.763Z"}}]',
    '[{"model": "cookie_consent.cookie", "pk": 3, "fields": {"cookiegroup": 1, "name": "cookieSelectionDone", "description": "Used to determine if the user viewed the cookie banner and if it should be shown again on page load.", "path": "/", "domain": "little-world.com", "created": "2022-09-30T16:20:02.118Z"}}, {"model": "cookie_consent.cookie", "pk": 2, "fields": {"cookiegroup": 2, "name": "mathomo", "description": "was", "path": "/", "domain": "little-world.com", "created": "2022-09-30T11:06:51.880Z"}}, {"model": "cookie_consent.cookie", "pk": 1, "fields": {"cookiegroup": 1, "name": "frontnendLang", "description": "Stores the front-end language.", "path": "/", "domain": "little-world.com", "created": "2022-09-30T10:32:14.529Z"}}]',
    { AnalyticsCookies: '-1' },
    () => {},
    () => {},
    {},
  );
} else {
  // Window function registered to be called from inside a django view
  window.cookieBanner = renderApp;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
