Components.utils.import("resource://gre/modules/cssHelper.jsm");
Components.utils.import("resource://gre/modules/editorHelper.jsm");
Components.utils.import("resource://gre/modules/urlHelper.jsm");
Components.utils.import("resource://gre/modules/projectManager.jsm");

var gNode = null;

function Startup()
{
  gNode = window.arguments[0];

  GetUIElements();

  InitDialog();

  var docUrl = EditorUtils.getDocumentUrl();
  var docUrlScheme = UrlUtils.getScheme(docUrl);
  if (docUrlScheme && docUrlScheme != "resource") {
    gDialog.relativeURLCheckbox.disabled = false;
    gDialog.relativeURLCheckboxWarning.hidden = true;
  }


  document.documentElement.getButton("accept").setAttribute("disabled", "true");
  var nproj = 0;
  if ("ProjectManager" in window)
    for (var i in ProjectManager.projects)
      nproj++
  gDialog.selectfromProjectButton.hidden = (nproj == 0);
  window.sizeToContent();
#ifndef XP_MACOSX
  CenterDialogOnOpener();
#endif
}

function onAccept()
{
  // general
  var url = gDialog.imageURLTextbox.value;
  var title = gDialog.titleTextbox.value;
  var altText = gDialog.alternateTextTextbox.value;

  var editor = EditorUtils.getCurrentEditor(); 
  if (gNode) {
    editor.beginTransaction();
    editor.setAttribute(gNode, "src", url);
    if (altText)
      editor.setAttribute(gNode, "alt", altText);
    else
      editor.removeAttribute(gNode, "alt");
    if (title)
      editor.setAttribute(gNode, "title", title);
    else
      editor.removeAttribute(gNode, "title");
    editor.endTransaction();
  }
  else {
	  var imgElement = EditorUtils.getCurrentDocument().createElement("img");
	  imgElement.setAttribute("src", url);
	  imgElement.setAttribute("alt", altText);
	  if (title)
	    imgElement.setAttribute("title", title);
	  editor.insertElementAtSelection(imgElement, true);
  }
}


function LoadImage()
{
  gDialog.previewImage.style.backgroundImage = 'url("' +
    UrlUtils.makeAbsoluteUrl(gDialog.imageURLTextbox.value.trim()) + '")';
  UpdateButtons();
}

function UpdateButtons()
{
  var ok = (gDialog.imageURLTextbox.value &&
            (gDialog.emptyAltOkCheckbox.checked || gDialog.alternateTextTextbox.value));
  SetEnabledElement(document.documentElement.getButton("accept"), ok);
}

function MakeRelativeUrl()
{
  var spec = gDialog.imageURLTextbox.value;
  var docUrl = EditorUtils.getDocumentUrl();
  var docUrlScheme = UrlUtils.getScheme(docUrl);
  if (docUrlScheme && docUrlScheme != "resource") {
    spec = UrlUtils.makeRelativeUrl(spec);
    gDialog.imageURLTextbox.value = spec;
    gDialog.relativeURLCheckbox.checked = true;
  }
}

function SetFocusToAlt()
{
  gDialog.alternateTextTextbox.focus();
}

function MakeAbsoluteUrl()
{
  var spec = gDialog.imageURLTextbox.value;
  var docUrl = EditorUtils.getDocumentUrl();
  var docUrlScheme = UrlUtils.getScheme(docUrl);
  if (docUrlScheme && docUrlScheme != "resource") {
    spec = UrlUtils.makeAbsoluteUrl(spec);
    gDialog.imageURLTextbox.value = spec;
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

function OpenInProjectPicker()
{
  var rv = { value: "" };
  window.openDialog("chrome://projectmanager/content/dialogs/inprojectPicker.xul","_blank",
                    "chrome,modal,titlebar,resizable=yes", rv, "images");  
  gDialog.imageURLTextbox.value = rv.value;
  gDialog.relativeURLCheckbox.checked = false;
  LoadImage();
  gDialog.alternateTextTextbox.focus();
}

function InitDialog()
{
  if (!gNode)
    return;

  gDialog.imageURLTextbox.value = gNode.getAttribute("src");
  LoadImage();
  gDialog.titleTextbox.value = gNode.getAttribute("title");
  gDialog.alternateTextTextbox.value = gNode.getAttribute("alt");
}

