import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CookieBannerNew } from "./banner.jsx"

window.cookieBanner = (cookieGroupsJSON, cookieSetsJSON, cookieStateDictJSON) => {
  console.log("Cookie data groups",JSON.parse(cookieGroupsJSON));
  console.log("Cookie sets",JSON.parse(cookieSetsJSON));
  console.log("Cookie stateDict",cookieStateDictJSON);

  const rootCookie = ReactDOM.createRoot(
    document.getElementById('cookie-root')
  );

  rootCookie.render(
    <React.StrictMode>
      <BrowserRouter>
        <CookieBannerNew cookieGroups={JSON.parse(cookieGroupsJSON)} cookieSets={JSON.parse(cookieSetsJSON)} cookieStates={cookieStateDictJSON} />
      </BrowserRouter>
    </React.StrictMode>,
  );
}

window.cookieBanner()

//reportWebVitals();
