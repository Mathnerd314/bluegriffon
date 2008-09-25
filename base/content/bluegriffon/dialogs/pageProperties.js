var gAuthorElement;
var gDescriptionElement;
var gKeywordsElement;
var gAuthor = "";
var gDescription = "";
var gKeywords = "";
var gInsertNewAuthor = false;
var gInsertNewDescription = false;
var gInsertNewKeywords = false;
var gRootElement;
var gTitleWasEdited = false;
var gAuthorWasEdited = false;
var gDescriptionWasEdited = false;
var gKeywordsWasEdited = false;
var gPrefs;

var gDefaultColors;

function Startup()
{
  GetUIElements();

  var fpb = gDialog["filepickerbutton"];
  fpb.appendFilters(Components.interfaces.nsIFilePicker.filterImages);

  var iframe = gDialog["pagePreview"];

  var location = UrlUtils.getDocumentUrl();
  var lastmodString = L10NUtils.getString("Unknown");

  if (!UrlUtils.isUrlAboutBlank(location))
  {
    gDialog.pageLocation.setAttribute("value",
                                      UrlUtils.stripUsernamePassword(location));

    // retrieve the last-modification date and time
    var lastmod;
    try {
      lastmod = EditorUtils.getCurrentEditor().document.lastModified;
    }
    catch (e) {}
    // convert date+time into readable form
    if (Date.parse(lastmod))
    {
      try {
        const nsScriptableDateFormat_CONTRACTID = "@mozilla.org/intl/scriptabledateformat;1";
        const nsIScriptableDateFormat = Components.interfaces.nsIScriptableDateFormat;
        var dateService = Components.classes[nsScriptableDateFormat_CONTRACTID]
                            .getService(nsIScriptableDateFormat);

        var lastModDate = new Date();
        lastModDate.setTime(Date.parse(lastmod));
        lastmodString =  dateService.FormatDateTime("", 
                                      dateService.dateFormatLong,
                                      dateService.timeFormatSeconds,
                                      lastModDate.getFullYear(),
                                      lastModDate.getMonth()+1,
                                      lastModDate.getDate(),
                                      lastModDate.getHours(),
                                      lastModDate.getMinutes(),
                                      lastModDate.getSeconds());
      } catch (e) {}

    }
  }
  gDialog.pageLastModified.value = lastmodString;

  gAuthorElement = EditorUtils.getMetaElement("author");
  if (!gAuthorElement)
  {
    gAuthorElement = EditorUtils.createMetaElement("author");
    if (!gAuthorElement)
    {
      window.close();
      return;
    }
    gInsertNewAuthor = true;
  }

  gDescriptionElement = EditorUtils.getMetaElement("description");
  if (!gDescriptionElement)
  {
    gDescriptionElement = EditorUtils.createMetaElement("description");
    if (!gDescriptionElement)
      window.close();

    gInsertNewDescription = true;
  }

  gKeywordsElement = EditorUtils.getMetaElement("keywords");
  if (!gKeywordsElement)
  {
    gKeywordsElement = EditorUtils.createMetaElement("keywords");
    if (!gKeywordsElement)
      window.close();

    gInsertNewKeywords = true;
  }

  gRootElement = EditorUtils.getCurrentEditor().rootElement;
  InitDialog();

  SetTextboxFocus(gDialog.pageTitle);

  // SetWindowLocation();
}

function InitDialog()
{
  gDialog.pageTitle.value = EditorUtils.getDocumentTitle();

  var gAuthor = TrimString(gAuthorElement.getAttribute("content"));
  if (!gAuthor)
    try {
      // Fill in with value from editor prefs
      gPrefs = GetPrefs();
      if (gPrefs) 
        gAuthor = gPrefs.getCharPref("bluegriffon.author");
    }
    catch(e) {}
  // if we still have no author name, use the system username if any
  if (!gAuthor)
    try {
      gAuthor = Components.classes["@mozilla.org/userinfo;1"]
                  .getService(Components.interfaces.nsIUserInfo).username;
    }
    catch(e) {}
  gDialog.pageAuthor.value = gAuthor;
  
  gDialog.pageDescription.value = gDescriptionElement.getAttribute("content");
  gDialog.pageKeywords.value    = gKeywordsElement.getAttribute("content");

  gDefaultColors = ColorUtils.getDefaultBrowserColors();
  if (gDefaultColors.UseSysColors)
    gDialog.colorRadiogroup.selectedItem = gDialog.useSystemColors;
  else
    gDialog.colorRadiogroup.selectedItem = gDialog.userDefinedColors;

  SetEnabledElementAndControl(gDialog.backgroundColorColorpickerLabel, !gDefaultColors.UseSysColors);
  SetEnabledElementAndControl(gDialog.textColorColorpickerLabel, !gDefaultColors.UseSysColors);
  SetEnabledElementAndControl(gDialog.linksColorColorpickerLabel, !gDefaultColors.UseSysColors);
  SetEnabledElementAndControl(gDialog.activeLinksColorColorpickerLabel, !gDefaultColors.UseSysColors);
  SetEnabledElementAndControl(gDialog.visitedLinksColorColorpickerLabel, !gDefaultColors.UseSysColors);

  gDialog.pagePreview.style.backgroundColor = gDefaultColors.BackgroundColor;
  gDialog.pagePreview.style.backgroundImage = "none";
  gDialog.textPreview.style.color = gDefaultColors.TextColor;
  gDialog.linksPreview.style.color = gDefaultColors.LinkColor;
  gDialog.activeLinksPreview.style.color = gDefaultColors.ActiveLinkColor;
  gDialog.visitedLinksPreview.style.color = gDefaultColors.VisitedLinkColor;
  gDialog.linksPreview.style.textDecoration = "underline";
  gDialog.activeLinksPreview.style.textDecoration = "underline";
  gDialog.visitedLinksPreview.style.textDecoration = "underline";
}

function onAccept()
{
  var editor = EditorUtils.getCurrentEditor();
  editor.beginTransaction();

  // general properties
  if (gTitleWasEdited)
    EditorUtils.setDocumentTitle(TrimString(gDialog.pageTitle.value));

  if (gAuthorWasEdited)
    EditorUtils.insertMetaElement(gAuthorElement, TrimString(gDialog.pageAuthor.value),
                                  gInsertNewAuthor, false);

  if (gDescriptionWasEdited)
    EditorUtils.insertMetaElement(gDescriptionElement, TrimString(gDialog.pageDescription.value),
                                  gInsertNewDescription, false);

  if (gKeywordsWasEdited)
    EditorUtils.insertMetaElement(gKeywordsElement, TrimString(gDialog.pageKeywords.value),
                                  gInsertNewKeywords, false);

  // style properties

  
  editor.endTransaction();

  editor.transactionManager.clear();
  editor.resetModificationCount();
  var tabeditorElt = EditorUtils.getCurrentTabEditor();
  tabeditorElt.showCurrentTabAsModified(EditorUtils.isDocumentModified());

  return true;
}

function onCancel()
{
  return true;
}

function TextboxChanged(aId)
{
  switch(aId)
  {
    case "pageTitle":       gTitleWasEdited = true; break;
    case "pageAuthor":      gAuthorWasEdited = true; break;
    case "pageDescription": gDescriptionWasEdited = true; break;
    case "pageKeywords":    gKeywordsWasEdited = true; break;
    default: break;
  }
}

function UseDefaultColors()
{
  SetColorPreview("textCW",       defaultTextColor);
  SetColorPreview("linkCW",       defaultLinkColor);
  SetColorPreview("activeCW",     defaultActiveColor);
  SetColorPreview("visitedCW",    defaultVisitedColor);
  SetColorPreview("backgroundCW", defaultBackgroundColor);

  // Setting to blank color will remove color from buttons,
  setColorWell("textCW",       "");
  setColorWell("linkCW",       "");
  setColorWell("activeCW",     "");
  setColorWell("visitedCW",    "");
  setColorWell("backgroundCW", "");

  // Disable color buttons and labels
  SetElementEnabledById("Text", false);
  SetElementEnabledById("TextButton", false);

  SetElementEnabledById("Link", false);
  SetElementEnabledById("LinkButton", false);

  SetElementEnabledById("Active", false);
  SetElementEnabledById("ActiveLinkButton", false);

  SetElementEnabledById("VisitedLinkButton", false);
  SetElementEnabledById("Visited", false);

  SetElementEnabledById("BackgroundButton", false);
  SetElementEnabledById("Background", false);
}

function SetColorPreview(ColorWellID, color)
{
  switch( ColorWellID )
  {
    case "textCW":
      gDialog.NormalText.setAttribute(styleStr,colorStyle+color);
      break;
    case "linkCW":
      gDialog.LinkText.setAttribute(styleStr,colorStyle+color);
      break;
    case "activeCW":
      gDialog.ActiveLinkText.setAttribute(styleStr,colorStyle+color);
      break;
    case "visitedCW":
      gDialog.VisitedLinkText.setAttribute(styleStr,colorStyle+color);
      break;
    case "backgroundCW":
      // Must combine background color and image style values
      var styleValue = backColorStyle+color;
      if (gBackgroundImage)
        styleValue += ";"+backImageStyle+gBackgroundImage+");";

      gDialog.ColorPreview.setAttribute(styleStr,styleValue);
      previewBGColor = color;
      break;
  }
}