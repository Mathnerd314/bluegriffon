var gDoc = null;
var gEditor = null;

function Startup()
{
  GetUIElements();
  gEditor = EditorUtils.getCurrentEditor();
  gDoc = editor.document;

  var headElt = doc.querySelector("head");
  var styleElts = headElt.querySelectorAll("style,link[rel='stylesheet'],link[rel='alternate stylesheet']");
}