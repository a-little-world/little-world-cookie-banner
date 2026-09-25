export const addScriptSrcToDom = (scriptSrc, id) => {
  if (/[?&]noscript=1(?:&|$)/i.test(scriptSrc)) {
    // `noscript=1` endpoints are tracking pixel fallbacks, not executable JS.
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.id = id;
  script.src = scriptSrc;
  document.head.appendChild(script);
};

export const addScriptToDom = (scriptString, id) => {
  const script = document.createElement('script');
  const inlineScript = document.createTextNode(scriptString);
  script.appendChild(inlineScript);
  script.async = true;
  script.id = id;
  document.head.appendChild(script);
};

const scriptId = (prefix, cookiePk, cookieGroup) =>
  `${prefix}-cookie-${cookiePk}-group-${cookieGroup}`;

export const removeInjectedScripts = cookieGroup => {
  const groupSuffix = `-group-${cookieGroup}`;
  document
    .querySelectorAll(
      `script[id^="src-cookie-"][id$="${groupSuffix}"], script[id^="script-cookie-"][id$="${groupSuffix}"]`,
    )
    .forEach(script => script.remove());
};

export const acceptAndInjectScripts = (cookieGroup, cookieSets) => {
  /**
   * This will load all script source ore tags for a specific cookieGroup
   * It will also check if the script id are present already and in that case would not add them again
   */
  cookieSets.forEach(cookie => {
    if (cookie.fields.cookiegroup !== cookieGroup) return;

    cookie.fields.include_srcs.forEach(src => {
      const id = scriptId('src', cookie.pk, cookieGroup);
      if (!document.getElementById(id)) addScriptSrcToDom(src, id);
      else console.log('Element already present' + id);
    });
    cookie.fields.include_scripts.forEach(script => {
      const id = scriptId('script', cookie.pk, cookieGroup);
      if (!document.getElementById(id)) addScriptToDom(script, id);
      else console.log('Element already present' + id);
    });
  });
};
