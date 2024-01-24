export const addScriptSrcToDom = (scriptSrc, id) => {
  const script = document.createElement('script');
  script.async = true;
  script.id = id;
  script.src = scriptSrc;
  document.head.appendChild(script);
};

export const addScriptToDom = (scriptString, id) => {
  const script = document.createElement('script');
  document.head.appendChild(script);
  var inlineScript = document.createTextNode(scriptString);
  script.appendChild(inlineScript);
  script.async = true;
  script.id = id;
  document.head.appendChild(script);
};

export const acceptAndInjectScripts = (cookieGroup, cookieSets) => {
  /**
   * This will load all script source ore tags for a specific cookieGroup
   * It will also check if the script id are present already and in that case would not add them again
   */
  cookieSets.forEach(cookie => {
    if (cookie.fields.cookiegroup === cookieGroup) {
      cookie.fields.include_srcs.forEach(s => {
        const setId =
          'src-cookie-' +
          cookie.pk.toString() +
          '-group-' +
          cookieGroup.toString();
        if (!document.getElementById(setId)) addScriptSrcToDom(s, setId);
        else console.log('Element already present' + setId);
      });
      cookie.fields.include_scripts.forEach(s => {
        const setId =
          'script-cookie-' +
          cookie.pk.toString() +
          '-group-' +
          cookieGroup.toString();
        if (!document.getElementById(setId)) addScriptToDom(s, setId);
        else console.log('Element already present' + setId);
      });
    }
  });
};
