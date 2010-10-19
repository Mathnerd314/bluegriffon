Components.utils.import("resource://gre/modules/editorHelper.jsm");
Components.utils.import("resource://gre/modules/urlHelper.jsm");

var gDocUrlScheme = null;

function Startup()
{
  var docUrl = EditorUtils.getDocumentUrl();
  gDocUrlScheme = UrlUtils.getScheme(docUrl);

  GetUIElements();

  UpdateType();
  window.sizeToContent();
}

function CheckURL(aTextboxId, aCheckboxId)
{
  var url = gDialog[aTextboxId].value;
  if (url) {
    gDialog[aCheckboxId].disabled = !(gDocUrlScheme && gDocUrlScheme != "resource");
    gDialog[aCheckboxId].checked = !gDialog[aCheckboxId].disabled && (url == UrlUtils.makeRelativeUrl(url));
  }
  else {
    gDialog[aCheckboxId].checked = false;
    gDialog[aCheckboxId].disabled = true;
  }
}

function MakeRelativeUrl(aTextboxId, aCheckboxId)
{
  var spec = gDialog[aTextboxId].value;
  if (gDocUrlScheme && gDocUrlScheme != "resource") {
    spec = UrlUtils.makeRelativeUrl(spec);
    gDialog[aTextboxId].value = spec;
    gDialog[aCheckboxId].checked = true;
  }
}

function MakeAbsoluteUrl(aTextboxId, aCheckboxId)
{
  var spec = gDialog[aTextboxId].value;
  if (gDocUrlScheme && gDocUrlScheme != "resource") {
    spec = UrlUtils.makeAbsoluteUrl(spec);
    gDialog[aTextboxId].value = spec;
    gDialog[aCheckboxId].checked = false;
  }
}

function ToggleRelativeOrAbsolute(aTextboxId, aCheckboxId)
{
  if (gDialog[aCheckboxId].checked) {
    MakeRelativeUrl(aTextboxId, aCheckboxId);
  }
  else {
    MakeAbsoluteUrl(aTextboxId, aCheckboxId);
  }
}

function UpdateType()
{
  var type = gDialog.typeRadiogroup.value;
  switch (type) {
    case "embedded":
      gDialog.alternateCheckbox.checked = false;
      gDialog.alternateCheckbox.disabled = true;
      gDialog.hrefLabel.disabled = true;
      gDialog.urlTextbox.value = "";
      gDialog.urlTextbox.disabled = true;
      gDialog.urlFilepickerbutton.disabled = true;
      gDialog.relativeURLCheckbox.checked = false;
      gDialog.relativeURLCheckbox.disabled = true;
      break;
    case "linked":
      gDialog.alternateCheckbox.checked = false;
      gDialog.alternateCheckbox.disabled = false;
      gDialog.hrefLabel.disabled = false;
      gDialog.urlTextbox.value = "";
      gDialog.urlTextbox.disabled = false;
      gDialog.urlFilepickerbutton.disabled = false;
      gDialog.relativeURLCheckbox.checked = false;
      gDialog.relativeURLCheckbox.disabled = false;
      break;
    default: break; // should never happen
  }
}