const kITS_NAMESPACE = "http://www.w3.org/2005/11/its";

var gRV;
var gRule = null;
var gQueryLanguage = "xpath";
var gSourceDocument = null;
var gCurrentElement = null;

function Startup()
{
  gRV             = window.arguments[0];
  gRule           = window.arguments[1];
  gQueryLanguage  = window.arguments[2];
  gSourceDocument = window.arguments[3];

  gCurrentElement = window.arguments[4];

  GetUIElements();

  InitSelectorGroupbox(gQueryLanguage);

  if (gRule) {
    gDialog.selectorTextbox.value = gRule.getAttribute("selector");
    if (gRule.getAttribute("translate") == "yes") {
      gDialog.translateYesButton.setAttribute("checked", "true");
      gDialog.translateNoButton.removeAttribute("checked");
    }
    else {
      gDialog.translateNoButton.setAttribute("checked", "true");
      gDialog.translateYesButton.removeAttribute("checked");
    }
  }
  gDialog.selectorTextbox.focus();
}

function Shutdown()
{
  
}

function Accept()
{
  var rule;
  if (gRule) {
    rule = gRule;
  }
  else {
    rule = gSourceDocument.createElementNS(kITS_NAMESPACE, "translateRule");
    gSourceDocument.documentElement.appendChild(rule);
  }
  rule.setAttribute("selector", gDialog.selectorTextbox.value);
  rule.setAttribute("translate", gDialog.translateYesButton.hasAttribute("checked") ? "yes" : "no");
  gRV.cancelled = true;
}
