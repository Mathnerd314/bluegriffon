Components.utils.import("resource://gre/modules/editorHelper.jsm");
Components.utils.import("resource://gre/modules/urlHelper.jsm");

var gNode = null;
var gEditor = null;
var gDocUrlScheme = null;
function Startup()
{
  gNode = window.arguments[0];
  gEditor = EditorUtils.getCurrentEditor();

  var docUrl = EditorUtils.getDocumentUrl();
  gDocUrlScheme = UrlUtils.getScheme(docUrl);

  GetUIElements();

  InitDialog();
  CheckURL();
}

function InitDialog()
{
  document.documentElement.getButton("accept").setAttribute("disabled", "true");

  if (gNode) {
    gDialog.linkTextbox.hidden = true;
    gDialog.linkLabel.setAttribute("value", gNode.textContent.trim());
  }
  else {
    var collapsedSelection = gEditor.selection.isCollapsed;
    if (collapsedSelection) {
	    gDialog.linkTextbox.hidden = false;
	    gDialog.linkLabel.hidden = true;
    }
    else {
	    gDialog.linkTextbox.hidden = true;
	    gDialog.linkLabel.hidden = false;
      gDialog.linkLabel.setAttribute("value", GetSelectionAsText().trim());
    }
  }

  var targets = gEditor.document.querySelectorAll("[id],a[name]");
  var targetsArray = [];
  for (var i = 0; i< targets.length; i++) {
    var t = targets[i];
    if (t.id)
      targetsArray.push(t.id);
    if (t.nodeName.toLowerCase() == "a" && t.hasAttribute("name"))
      targetsArray.push(t.getAttribute("name"));
  }
  targetsArray.sort();
  if (targetsArray.length) {
    for (var i = 0; i < targetsArray.length; i++) {
      var item = "#" + targetsArray[i];
      gDialog.urlMenulist.appendItem(item, item);
    }
  }
  else {
    var s = gDialog.bundleString.getString("noAnchorsInDocument");
    var item = gDialog.urlMenulist.appendItem(s);
    item.setAttribute("disabled", "true");
  }
}

function GetSelectionAsText()
{
  try {
    return gEditor.outputToString("text/plain", 1); // OutputSelectionOnly
  } catch (e) {}

  return "";
}


function CheckURL()
{
  var url = gDialog.urlMenulist.value;
  if (url) {
    gDialog.emailCheckbox.disabled = false;
    gDialog.relativeURLCheckbox.disabled = !(gDocUrlScheme && gDocUrlScheme != "resource");
  }
  else {
    gDialog.emailCheckbox.checked = false;
    gDialog.relativeURLCheckbox.checked = false;
    gDialog.emailCheckbox.disabled = true;
    gDialog.relativeURLCheckbox.disabled = true;
  }
}