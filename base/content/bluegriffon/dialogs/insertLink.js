Components.utils.import("resource://app/modules/editorHelper.jsm");
Components.utils.import("resource://app/modules/urlHelper.jsm");

var gNode = null;
var gEditor = null;
var gDocUrlScheme = null;
var gCollapsedSelection = false;

function Startup()
{
  window.sizeToContent();
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
  //document.documentElement.getButton("accept").setAttribute("disabled", "true");

  if (gNode) {
    gDialog.linkTextbox.hidden = true;
    gDialog.linkLabel.setAttribute("value", gNode.textContent.trim());
    var url = gNode.getAttribute("href");
    gDialog.urlMenulist.value = url;
    gDialog.relativeURLCheckbox.checked =
       !(url.substr(0,7) == "http://" ||
         url.substr(0,8) == "https://" ||
         url.substr(0,6) == "ftp://" ||
         url.substr(0,7) == "file://");
    gDialog.urlMenulist.focus();
  }
  else {
    gCollapsedSelection = gEditor.selection.isCollapsed;
    if (gCollapsedSelection) {
      gDialog.linkTextbox.hidden = false;
      gDialog.linkLabel.hidden = true;
      gDialog.linkTextbox.focus();
    }
    else {
      gDialog.linkTextbox.hidden = true;
      gDialog.linkLabel.hidden = false;
      gDialog.linkLabel.setAttribute("value", GetSelectionAsText().trim());
      gDialog.urlMenulist.focus();
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

function MakeRelativeUrl()
{
  var spec = gDialog.urlMenulist.value;
  if (gDocUrlScheme && gDocUrlScheme != "resource") {
    spec = UrlUtils.makeRelativeUrl(spec);
    gDialog.urlMenulist.value = spec;
    gDialog.relativeURLCheckbox.checked = true;
  }
}

function MakeAbsoluteUrl()
{
  var spec = gDialog.urlMenulist.value;
  if (gDocUrlScheme && gDocUrlScheme != "resource") {
    spec = UrlUtils.makeAbsoluteUrl(spec);
    gDialog.urlMenulist.value = spec;
    gDialog.relativeURLCheckbox.checked = false;
  }
}

function ToggleRelativeOrAbsolute()
{
  if (gDialog.relativeURLCheckbox.checked) {
    MakeRelativeUrl();
  }
  else {
    MakeAbsoluteUrl();
  }
}

function onAccept()
{
  var url = gDialog.urlMenulist.value;
  if (url && gDialog.emailCheckbox.checked)
    url = "mailto:" + url;

  if (gNode) {
    if (url)
      gEditor.setAttribute(gNode, "href", url);
    else {
      var offset = 0;
      var parent = gNode.parentNode;
      var childNodes = parent.childNodes;
      gEditor.setShouldTxnSetSelection(false);
      gEditor.beginTransaction();

      while (childNodes[offset] != gNode)
        ++offset;

      childNodes = gNode.childNodes;
      var childNodesLength = childNodes.length;
      for (var i = childNodesLength - 1; i >= 0; i--) {
        var clone = childNodes.item(i).cloneNode(true);
        gEditor.insertNode(clone, parent, offset + 1);
      }

      gEditor.deleteNode(gNode);

      gEditor.endTransaction();
      gEditor.setShouldTxnSetSelection(true);
    }
  }
  else if (gCollapsedSelection) {
    var textNode = gEditor.document.createTextNode(gDialog.linkTextbox.value);
    var anchor = gEditor.document.createElement("a");
    anchor.appendChild(textNode);
    anchor.setAttribute("href", url);
    try {
      gEditor.insertElementAtSelection(anchor, false);
    }
    catch (e) {}
  }
  else {
    var anchor = gEditor.document.createElement("a");
    anchor.setAttribute("href", url);
    try {
      gEditor.insertLinkAroundSelection(anchor);
    }
    catch (e) {}
  }
}
