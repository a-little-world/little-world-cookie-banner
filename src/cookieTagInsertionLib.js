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
