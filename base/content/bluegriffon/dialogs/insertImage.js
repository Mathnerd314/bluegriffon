Components.utils.import("resource://gre/modules/cssHelper.jsm");
Components.utils.import("resource://gre/modules/editorHelper.jsm");

function Startup()
{
  NotifierUtils.addNotifierCallback("cssPolicyChanged", cssPolicyChanged, null);
  GetUIElements();
  gDialog.cssToggler.init();
}

function onAccept()
{
  
}

function cssPolicyChanged(aKeyword, aCssPolicy)
{
  
}