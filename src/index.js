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
  cookieBannerIsHidden = false,
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
          cookieBannerIsHidden={cookieBannerIsHidden}
          cookieScriptMap={scriptsToAdd}
        />
      </StyleSheetManager>
    </React.StrictMode>,
  );
};

window.cookieBanner = renderApp;