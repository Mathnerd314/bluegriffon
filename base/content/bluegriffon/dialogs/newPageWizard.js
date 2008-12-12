/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is BlueGriffon.
 *
 * The Initial Developer of the Original Code is
 * Disruptive Innovations SARL.
 * Portions created by the Initial Developer are Copyright (C) 2008
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Daniel Glazman <daniel.glazman@disruptive-innovations.com>, Original author
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
 
var gFpb = null;     // file picker
var gPreview = null; // preview iframe for colors
var gAuthor = "";
var gDescription = "";
var gKeywords = "";
var gRootElement;
var gTitleWasEdited = false;
var gAuthorWasEdited = false;
var gDescriptionWasEdited = false;
var gKeywordsWasEdited = false;
var gLanguageWasEdited = false;
var gPrefs;

var gUseSystemColors = true;

var gHorizPosition = "50%";
var gVertPosition = "50%";

function Startup()
{
  GetUIElements();

  var gFpb = gDialog["filepickerbutton"];
  if (gFpb)
    gFpb.appendFilters(Components.interfaces.nsIFilePicker.filterImages);

  gPreview = gDialog["pagePreview"];

  gRootElement = EditorUtils.getCurrentEditor().rootElement;
  InitDialog();

  SetTextboxFocus(gDialog.pageTitle);
}

function InitDialog()
{
  gDialog.pageTitle.value = EditorUtils.getDocumentTitle();
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

  // COLORS
  gUseSystemColors = gPrefs.getBoolPref("bluegriffon.display.use_system_colors");
  gForegroundColor = gPrefs.getCharPref("bluegriffon.display.foreground_color");
  gBackgroundColor = gPrefs.getCharPref("bluegriffon.display.background_color");
  gActiveColor = gPrefs.getCharPref("bluegriffon.display.active_color");
  gAnchorColor = gPrefs.getCharPref("bluegriffon.display.anchor_color");
  gVisitedColor = gPrefs.getCharPref("bluegriffon.display.visited_color");
  gDialog.underlineLinks.checked = gPrefs.getBoolPref("bluegriffon.display.underline_links");
  gDialog.userDefinedColors.checked = !gUseSystemColors;
  EnableUserDefinedColorsControls();
}

function EnableUserDefinedColorsControls()
{
  var enabled = gDialog.userDefinedColors.checked;
  gDialog.backgroundColorColorpicker.color = (enabled ? gBackgroundColor : "transparent");
  gDialog.textColorColorpicker.color = (enabled ? gForegroundColor : "transparent");
  gDialog.linksColorColorpicker.color = (enabled ? gAnchorColor : "transparent");
  gDialog.activeLinksColorColorpicker.color = (enabled ? gActiveColor : "transparent");
  gDialog.visitedLinksColorColorpicker.color = (enabled ? gVisitedColor : "transparent");

  gDialog.pagePreview.style.backgroundColor = enabled ? gBackgroundColor : "#ffffff";
  gDialog.textPreview.style.color = enabled ? gForegroundColor : "#000000";
  gDialog.linksPreview.style.color = enabled ? gAnchorColor : "#0000ee";
  gDialog.activeLinksPreview.style.color = enabled ? gActiveColor : "#ee0000";
  gDialog.visitedLinksPreview.style.color = enabled ? gVisitedColor : "#551a8b";

  var underline = gDialog.underlineLinks.checked || !enabled;
  gDialog.linksPreview.style.textDecoration = underline ? "underline" : "none";
  gDialog.activeLinksPreview.style.textDecoration = underline ? "underline" : "none";
  gDialog.visitedLinksPreview.style.textDecoration = underline ? "underline" : "none";
  
  SetEnabledElement(gDialog.backgroundColorColorpickerLabel, enabled);
  SetEnabledElement(gDialog.backgroundColorColorpicker, enabled);
  SetEnabledElement(gDialog.textColorColorpickerLabel, enabled);
  SetEnabledElement(gDialog.textColorColorpicker, enabled);
  SetEnabledElement(gDialog.linksColorColorpickerLabel, enabled);
  SetEnabledElement(gDialog.linksColorColorpicker, enabled);
  SetEnabledElement(gDialog.activeLinksColorColorpickerLabel, enabled);
  SetEnabledElement(gDialog.activeLinksColorColorpicker, enabled);
  SetEnabledElement(gDialog.visitedLinksColorColorpickerLabel, enabled);
  SetEnabledElement(gDialog.visitedLinksColorColorpicker, enabled);
  SetEnabledElement(gDialog.textPreview, enabled);
  SetEnabledElement(gDialog.linksPreview, enabled);
  SetEnabledElement(gDialog.activeLinksPreview, enabled);
  SetEnabledElement(gDialog.visitedLinksPreview, enabled);
  SetEnabledElement(gDialog.underlineLinks, enabled);
}

function onColorChange(aColorPicker)
{
  switch (aColorPicker.id)
  {
    case "backgroundColorColorpicker":
      gBackgroundColor = aColorPicker.color;
      break;
    case "textColorColorpicker":
      gForegroundColor = aColorPicker.color;
      break;
    case "linksColorColorpicker":
      gAnchorColor = aColorPicker.color;
      break;
    case "activeLinksColorColorpicker":
      gActiveColor = aColorPicker.color;
      break;
    case "visitedLinksColorColorpicker":
      gVisitedColor = aColorPicker.color;
      break;
    default: break;  // sanity code
  }
  EnableUserDefinedColorsControls();
}

var gColorPicker = {};

function OpenColorDialog(aElt, aColorObjectId)
{
  switch(aElt.id)
  {
    case "backgroundColorColorpicker":
      ColorPickerHelper.openColorPickerPanel("backgroundColor", "", true,
                                             "colorPickerPopup",
                                             "colorPickerSheetIFrame",
                                             aElt);
      break;
    default:
      break;
  }
}

function SelectLanguage(aElt)
{
  var retValue = { lang: "" };
  window.openDialog("chrome://bluegriffon/content/dialogs/languages.xul","_blank",
                    "chrome,modal=no,dialog=yes,titlebar", null, retValue);
  gDialog.pageLanguage.value = retValue.lang;
}

function ShowBackgroundPosition(aEvent)
{
  var x = aEvent.screenX  - gDialog.backgroundPositionBox.boxObject.screenX;
  var y = aEvent.screenY + 1 - gDialog.backgroundPositionBox.boxObject.screenY;
  if (x < 0 || y < 0 || x > 100 | y > 100)
    ExitBackgroundPosition(aEvent);

  gDialog.horizPosition.value = x + "%";
  gDialog.vertPosition.value  = y + "%";
  gDialog.horizPosition.style.color = "";
  gDialog.vertPosition.style.color = "";
  gDialog.horizPosition.style.fontWeight = "";
  gDialog.vertPosition.style.fontWeight = "";
  gDialog.backgroundPositionBox.style.backgroundPosition = (100-x) + "% " + (100-y) +"%";
}

function SetBackgroundPosition(aEvent)
{
  var x = aEvent.screenX  - gDialog.backgroundPositionBox.boxObject.screenX;
  var y = aEvent.screenY + 1 - gDialog.backgroundPositionBox.boxObject.screenY;
  if (x < 0 || y < 0 || x > 100 | y > 100)
    ExitBackgroundPosition(aEvent);

  ShowBackgroundPosition(aEvent)

  gDialog.horizPosition.style.color = "red";
  gDialog.vertPosition.style.color = "red";
  gDialog.horizPosition.style.fontWeight = "bold";
  gDialog.vertPosition.style.fontWeight = "bold";
  gHorizPosition = gDialog.horizPosition.value;
  gVertPosition = gDialog.vertPosition.value;
  gDialog.backgroundImageBox.style.backgroundPosition = gHorizPosition + " " + gVertPosition;
}

function ExitBackgroundPosition(event)
{
  gDialog.horizPosition.value = gHorizPosition;
  gDialog.vertPosition.value  = gVertPosition;
  gDialog.horizPosition.style.color = "";
  gDialog.vertPosition.style.color = "";
  gDialog.horizPosition.style.fontWeight = "";
  gDialog.vertPosition.style.fontWeight = "";
  var x = parseInt(gHorizPosition);
  var y = parseInt(gVertPosition);
  gDialog.backgroundPositionBox.style.backgroundPosition = (100-x) + "% " + (100-y) +"%";
}

function SetBackgroundRepeat(aElt)
{
  gDialog.backgroundImageBox.style.backgroundRepeat = aElt.value;
}

function onUsePageLayoutChanged(aCheckbox)
{
  var enabled = aCheckbox.checked;
  SetEnabledElementAndControl(gDialog.LayoutTypeMenulistLabel, enabled);
  SetEnabledElementAndControl(gDialog.LayoutSubtypeMenulistLabel, enabled);

  SetEnabledElement(gDialog.ContentRowsListbox, enabled);

  SetEnabledElement(gDialog.ContentRowsPlusButton, enabled);
  SetEnabledElement(gDialog.ContentRowsMinusButton, enabled && gDialog.ContentRowsListbox.itemCount);
  // SetEnabledElement(gDialog.ContentRowsConfigButton, enabled);

  SetEnabledElement(gDialog.LoremIpsumCheckbox, enabled);
}

function AddContentRow(aEvent)
{
  var item = aEvent.originalTarget;
  var label = item.label;
  var value = item.value;

  var listItem = gDialog.ContentRowsListbox.appendItem(label, value);
  gDialog.ContentRowsListbox.selectItem(listItem);
  SetEnabledElement(gDialog.ContentRowsMinusButton, true);
}

function RemoveContentRow()
{
  var listbox = gDialog.ContentRowsListbox;
  var item = listbox.selectedItem;
  if (item)
  {
    var index = listbox.getIndexOfItem(item);
    listbox.removeItemAt(index);
    var count = listbox.itemCount;
    if (count)
    {
      if (index >= count)
        index = count - 1;
      item = listbox.getItemAtIndex(index);
      listbox.selectItem(item);
    }
    else
      SetEnabledElement(gDialog.ContentRowsMinusButton, false);
  }
}

function Apply()
{
  var doc = EditorUtils.getCurrentDocument();

  // UI CSS GRID LAYOUT
  if (gDialog.usePageLayout.checked)
  {
    var loremIpusm = gDialog.LoremIpsumCheckbox.checked;

    var linkElt = doc.createElement("link");
    linkElt.setAttribute("type", "text/css");
    linkElt.setAttribute("rel", "stylesheet");
    linkElt.setAttribute("href", "http://yui.yahooapis.com/2.5.1/build/reset-fonts-grids/reset-fonts-grids.css");
    EditorUtils.getHeadElement().appendChild(linkElt);
    linkElt = doc.createElement("link");
    linkElt.setAttribute("type", "text/css");
    linkElt.setAttribute("rel", "stylesheet");
    linkElt.setAttribute("href", "http://yui.yahooapis.com/2.6.0/build/base/base-min.css");
    EditorUtils.getHeadElement().appendChild(linkElt);

    var docId    = gDialog.LayoutTypeMenulist.value;
    var docClass = gDialog.LayoutSubtypeMenulist.value;
    var outerDiv = doc.createElement("div");
    outerDiv.setAttribute("id", docId);
    outerDiv.setAttribute("class", docClass);
    doc.body.innerHTML = "";
    doc.body.appendChild(outerDiv);

    var headerDiv = doc.createElement("div");
    headerDiv.setAttribute("id", "hd");
    var bodyDiv = doc.createElement("div");
    bodyDiv.setAttribute("id", "bd");
    var footerDiv = doc.createElement("div");
    footerDiv.setAttribute("id", "ft");
    outerDiv.appendChild(headerDiv);
    outerDiv.appendChild(bodyDiv);
    outerDiv.appendChild(footerDiv);

    var loremIpsumStr = "<br>";
    var navProse = "";
    if (loremIpusm)
    {
      var loremIpsumProse = L10NUtils.getStringFromURL("loremIpsum",
                                             "chrome://bluegriffon/locale/newPageWizard.properties");
      var headerProse = L10NUtils.getStringFromURL("header",
                                             "chrome://bluegriffon/locale/newPageWizard.properties");
      var footerProse = L10NUtils.getStringFromURL("footer",
                                             "chrome://bluegriffon/locale/newPageWizard.properties");
      navProse =    L10NUtils.getStringFromURL("nav",
                                             "chrome://bluegriffon/locale/newPageWizard.properties");

      var h1 = doc.createElement("h1");
      var headerTextNode = doc.createTextNode(headerProse);
      h1.appendChild(headerTextNode);
      headerDiv.appendChild(h1);
      var p = doc.createElement("p");
      var footerTextNode = doc.createTextNode(footerProse);
      p.appendChild(footerTextNode);
      footerDiv.appendChild(p);

      loremIpsumStr = "<p>" + loremIpsumProse + "</p>";
    }
    else
    {
      var headerBr = doc.createElement("br");
      headerDiv.appendChild(headerBr);
      var footerBr = doc.createElement("br");
      footerDiv.appendChild(footerBr);
    }

    var mainContainer = bodyDiv;
    if (docClass != "yui-t7")
    {
      mainContainer = doc.createElement("div");
      mainContainer.setAttribute("class", "yui-b");
      mainContainerContainer = doc.createElement("div");
      mainContainerContainer.setAttribute("id", "yui-main");

      mainContainerContainer.appendChild(mainContainer);
      bodyDiv.appendChild(mainContainerContainer);
    }

    var listbox = gDialog.ContentRowsListbox;
    for (var i = 0 ; i < listbox.itemCount; i++)
    {
      var item = listbox.getItemAtIndex(i);
      var value = item.value;
      var ihtml = "";
      switch (value)
      {
	      case "1": // .yui-g
          ihtml = "<div class='yui-g'>" + loremIpsumStr + "</div>";
          break;  // oneColumn100

        case "2": // .yui-g > .yui-u.first + .yui-u 
          ihtml = "<div class='yui-g'><div class='yui-u first'>" + loremIpsumStr +
                               "</div><div class='yui-u'>" + loremIpsumStr +
                               "</div></div>";
          break;  // twoColumns5050

        case "3": // .yui-gc > .yui-u.first + .yui-u 
          ihtml = "<div class='yui-gc'><div class='yui-u first'>" + loremIpsumStr +
                               "</div><div class='yui-u'>" + loremIpsumStr +
                               "</div></div>";
          break;  // twoColumns6633

        case "4": // .yui-gd > .yui-u.first + .yui-u 
          ihtml = "<div class='yui-gd'><div class='yui-u first'>" + loremIpsumStr +
                               "</div><div class='yui-u'>" + loremIpsumStr +
                               "</div></div>";
          break;  // twoColumns3366

        case "5": // .yui-ge > .yui-u.first + .yui-u 
          ihtml = "<div class='yui-ge'><div class='yui-u first'>" + loremIpsumStr +
                               "</div><div class='yui-u'>" + loremIpsumStr +
                               "</div></div>";
          break;  // twoColumns7525

        case "6": // .yui-gf > .yui-u.first + .yui-u 
          ihtml = "<div class='yui-gf'><div class='yui-u first'>" + loremIpsumStr +
                               "</div><div class='yui-u'>" + loremIpsumStr +
                               "</div></div>";
          break;  // twoColumns2575

        case "7": // .yui-gb > .yui-u.first + .yui-u + .yui-u 
          ihtml = "<div class='yui-gb'><div class='yui-u first'>" + loremIpsumStr +
                               "</div><div class='yui-u'>" + loremIpsumStr +
                               "</div><div class='yui-u'>" + loremIpsumStr +
                               "</div></div>";
          break;  // threeColumns333333

        case "8": // .yui-g > .yui-u first + .yui-g > .yui-u.first + .yui-u
          ihtml = "<div class='yui-g'><div class='yui-u first'>" + loremIpsumStr +
                               "</div><div class='yui-g'><div class='yui-u first'>" + loremIpsumStr +
                                                   "</div><div class='yui-u'>" + loremIpsumStr +
                                       "</div></div></div>";
          break;  // threeColumns502525

        case "9": // .yui-g > .yui-g.first ( > .yui-u.first + .yui-u ) + .yui-u
          ihtml = "<div class='yui-g'><div class='yui-g first'><div class='yui-u first'>" + loremIpsumStr +
                                                   "</div><div class='yui-u'>" + loremIpsumStr +
                                       "</div></div><div class='yui-u'>" + loremIpsumStr +
                               "</div></div>";
          break;  // threeColumns252550

        case "10": // .yui-g > .yui-g.first ( > .yui-u.first + .yui-u ) + .yui-g ( > .yui-u.first + .yui-u )
          ihtml = "<div class='yui-g'><div class='yui-g first'><div class='yui-u first'>" + loremIpsumStr +
                                                   "</div><div class='yui-u'>" + loremIpsumStr +
                                       "</div></div><div class='yui-g'><div class='yui-u first'>" + loremIpsumStr +
                                                   "</div><div class='yui-u'>" + loremIpsumStr +
                                       "</div></div></div>";
          break;  // fourColumns25252525

        default: break // should not happen
      }
      mainContainer.innerHTML += ihtml;
    }

    // the sidebar now...
    if (docClass != "yui-t7")
    {
      bodyDiv.innerHTML += "<div class='yui-b'>" + navProse + "</div>";
    }
  }

  // DOCUMENT METADATA
  if (gDialog.pageTitle.value)
  {
    EditorUtils.setDocumentTitle(gDialog.pageTitle.value);
  }

  if (gDialog.pageAuthor.value)
  {
    var meta = EditorUtils.createMetaElement("author");
    EditorUtils.insertMetaElement(meta, gDialog.pageAuthor.value, true, false);
  }

  if (gDialog.pageDescription.value)
  {
    meta = EditorUtils.createMetaElement("description");
    EditorUtils.insertMetaElement(meta, gDialog.pageDescription.value, true, false);
  }

  if (gDialog.pageKeywords.value)
  {
    meta = EditorUtils.createMetaElement("keywords");
    EditorUtils.insertMetaElement(meta, gDialog.pageKeywords.value, true, false);
  }

  meta = EditorUtils.createMetaElement("generator");
  EditorUtils.insertMetaElement(meta, "BlueGriffon wysiwyg editor", true, false);

  if (gDialog.pageLanguage.value)
    EditorUtils.getCurrentDocument().documentElement.
      setAttribute("lang", gDialog.pageLanguage.value);

  // COLORS
  var prefs = GetPrefs();
  if (gDialog.makeColorsDefault.checked)
    prefs.setBoolPref("bluegriffon.display.use_system_colors", !gDialog.userDefinedColors.checked)
  if (gDialog.userDefinedColors.checked)
  {
    var bgColor      = gDialog.backgroundColorColorpicker.color;
    var fgColor      = gDialog.textColorColorpicker.color;
    var linksColor   = gDialog.linksColorColorpicker.color;
    var activeColor  = gDialog.activeLinksColorColorpicker.color;
    var visitedColor = gDialog.visitedLinksColorColorpicker.color;

    CssUtils.getStyleSheetForScreen(doc);
    CssUtils.addRuleForSelector(doc, "html", [ { property: "background-color",
                                                 value: bgColor,
                                                 priority: false } ] );
    CssUtils.addRuleForSelector(doc, "body", [ { property: "background-color",
                                                 value: bgColor,
                                                 priority: false },
                                               {
                                                 property: "color",
                                                 value: fgColor,
                                                 priority: false } ] );
    CssUtils.addRuleForSelector(doc, ":link", [ { property: "color",
                                                 value: linksColor,
                                                 priority: false } ] );
    if (!gDialog.underlineLinks.checked)
	    CssUtils.addRuleForSelector(doc, ":link", [ { property: "text-decoration",
	                                                 value: "none",
	                                                 priority: false } ] );
    CssUtils.addRuleForSelector(doc, ":link:active", [ { property: "color",
                                                          value: activeColor,
                                                          priority: false } ] );
    CssUtils.addRuleForSelector(doc, ":link:visited", [ { property: "color",
                                                          value: visitedColor,
                                                          priority: false } ] );

    if (gDialog.makeColorsDefault.checked)
    {
	    prefs.setCharPref("bluegriffon.display.foreground_color", fgColor);
	    prefs.setCharPref("bluegriffon.display.background_color", bgColor);
	    prefs.setCharPref("bluegriffon.display.active_color", activeColor);
	    prefs.setCharPref("bluegriffon.display.anchor_color", linksColor);
	    prefs.setCharPref("bluegriffon.display.visited_color", visitedColor);
	    prefs.setBoolPref("bluegriffon.display.underline_links", gDialog.underlineLinks.checked);
    }
  }

  // BACKGROUND IMAGE
  var bgImage = gDialog.backgroundImage.value; 
  if (bgImage)
  {
    var bgRepeat     = gDialog.backgroundTile.value;
    var bgAttachment = gDialog.backgroundScroll.value;
    var bgPosition   = gDialog.horizPosition.value + " " + gDialog.vertPosition.value;
    CssUtils.addRuleForSelector(doc, "body", [ { property: "background-image",
                                                 value: 'url("' + bgImage + '")',
                                                 priority: false },
                                               {
                                                 property: "background-repeat",
                                                 value: bgRepeat,
                                                 priority: false },
                                               {
                                                 property: "background-attachment",
                                                 value: bgAttachment,
                                                 priority: false },
                                               {
                                                 property: "background-position",
                                                 value: bgPosition,
                                                 priority: false } ] );
  }
}


