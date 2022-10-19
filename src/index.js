import React from 'react';
import ReactDOM from 'react-dom/client';
import CookieBanner from './App';
import reportWebVitals from './reportWebVitals';
import { DEVELOPMENT, LOCAL_DEV } from "./ENVIRONMENT"

const renderApp = (cookieGroupsJSON, cookieSetsJSON, cookieStateDictJSON) => {
  const host = document.querySelector('#shadow-root');
  const shadow = host.attachShadow({ mode: 'open' });
  const para = document.createElement('div');
  shadow.appendChild(para);
  para.id = "cookie-root";

  const root = ReactDOM.createRoot(para);
  root.render(
    <React.StrictMode>
      <CookieBanner cookieGroups={JSON.parse(cookieGroupsJSON)} cookieSets={JSON.parse(cookieSetsJSON)} cookieStates={cookieStateDictJSON} ></CookieBanner>
    </React.StrictMode>,
  );
};

if (DEVELOPMENT) {
  renderApp("[{\"model\": \"cookie_consent.cookiegroup\", \"pk\": 1, \"fields\": {\"varname\": \"LittleWorldFunctionalityCookies\", \"name\": \"Little World Functionality Cookies\", \"description\": \"Cookies that are required and used for the little world web application.\", \"is_required\": true, \"is_deletable\": true, \"ordering\": 0, \"created\": \"2022-09-30T10:31:30.191Z\"}}, {\"model\": \"cookie_consent.cookiegroup\", \"pk\": 2, \"fields\": {\"varname\": \"AnalyticsCookies\", \"name\": \"Analytics Cookies\", \"description\": \"Cookies used for analytics, this includes cookies used my Matomo.\", \"is_required\": false, \"is_deletable\": true, \"ordering\": 0, \"created\": \"2022-09-30T11:06:23.763Z\"}}]", "[{\"model\": \"cookie_consent.cookie\", \"pk\": 3, \"fields\": {\"cookiegroup\": 1, \"name\": \"cookieSelectionDone\", \"description\": \"Used to determine if the user viewed the cookie banner and if it should be shown again on page load.\", \"path\": \"/\", \"domain\": \"little-world.com\", \"created\": \"2022-09-30T16:20:02.118Z\"}}, {\"model\": \"cookie_consent.cookie\", \"pk\": 2, \"fields\": {\"cookiegroup\": 2, \"name\": \"mathomo\", \"description\": \"was\", \"path\": \"/\", \"domain\": \"little-world.com\", \"created\": \"2022-09-30T11:06:51.880Z\"}}, {\"model\": \"cookie_consent.cookie\", \"pk\": 1, \"fields\": {\"cookiegroup\": 1, \"name\": \"frontnendLang\", \"description\": \"Stores the front-end language.\", \"path\": \"/\", \"domain\": \"little-world.com\", \"created\": \"2022-09-30T10:32:14.529Z\"}}]", {"AnalyticsCookies": "-1"});
} else {
  // Window function registered to be called from inside a django view
  window.cookieBanner = renderApp;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
