Components.utils.import("resource://gre/modules/editorHelper.jsm");

function Startup()
{
  GetUIElements();
}

function onAccept()
{
  EditorUtils.getCurrentEditor().insertHTML(gDialog.htmlTextbox.value);
  return true;
}