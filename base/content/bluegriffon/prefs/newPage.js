Components.utils.import("resource://gre/modules/Services.jsm");

function OnNewPagePaneLoad()
{
  GetUIElements();
  var zoom = Math.floor(parseFloat(Services.prefs.getCharPref("bluegriffon.zoom.default")) * 100);
  gDialog.zoomScale.value = zoom;
  OnScaleChange(false);

  var elt = document.getElementById("sourceThemeMenupopup");
  for (var i = 0; i < kTHEMES.length; i++) {
    var s = document.createElement("menuitem");
    s.setAttribute("label", kTHEMES[i]);
    s.setAttribute("value", kTHEMES[i]);
    elt.appendChild(s);
  }
  var currentTheme = Services.prefs.getCharPref("bluegriffon.source.theme");
  document.getElementById("sourceThemeMenulist").value = currentTheme;

  toggleWrapping();
}

function toggleWrapping()
{
  var wrapArray = ["maxColumnLabel", "maxColumnCheckbox", "noWrapForLanguagesCheckbox",
                   "langExclusionsTextbox", "langExclusionExampleLabel"];
  var wrapping = gDialog.wrapCheckbox.checked;
  for (var i = 0; i < wrapArray.length; i++)
    if (wrapping)
      gDialog[wrapArray[i]].removeAttribute("disabled");
    else
      gDialog[wrapArray[i]].setAttribute("disabled", "true");
}

function OnScaleChange(aChangePref)
{
  if (gDialog.zoomText) {
    gDialog.zoomText.value = gDialog.zoomScale.value;
    if (aChangePref)
      Services.prefs.setCharPref("bluegriffon.zoom.default", gDialog.zoomScale.value/100);
  }
}

function OnZoomTextInput(aElt)
{
  var value = parseInt(aElt.value);
  gDialog.zoomScale.value = value;
}