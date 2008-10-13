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
 * The Original Code is Mozilla.org.
 *
 * The Initial Developer of the Original Code is
 * Neil Marshall.
 * Portions created by the Initial Developer are Copyright (C) 2003
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Neil Marshall (neil.marshall@sympatico.ca), Original author
 *   Daniel Glazman (glazman@disruptive-innovations.com), on behalf of Linspire Inc.
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

var colours;
var satSlider = new objColour();
var hexChars = "0123456789ABCDEF";
var selectedColour = 0;
var mouseDown = false;
var eventInitiator = null;
var mouseX, mouseY, offsetLeft, offsetTop;

var gColor = "";
var LastPickedColor = "";
var ColorType = "Text";
var TextType = false;
var HighlightType = false;
var TableOrCell = false;
var LastPickedIsDefault = false;
var NoDefault = false;
var gColorObj;

function StartUp()
{

  if (!window.arguments[1])
  {
    dump("colourPicker: Missing color object param\n");
    return;
  }

  // window.arguments[1] is object to get initial values and return color data
  gColorObj = window.arguments[1];
  gColorObj.Cancel = false;

  gDialog.red              = document.getElementById("red");
  gDialog.blue             = document.getElementById("blue");
  gDialog.green            = document.getElementById("green");
  gDialog.hue              = document.getElementById("hue");
  gDialog.saturation       = document.getElementById("saturation");
  gDialog.brightness       = document.getElementById("brightness");
  gDialog.hexColour        = document.getElementById("hexColour");
  gDialog.nameColour       = document.getElementById("nameColour");

  gDialog.redLabel = document.getElementById("redLabel");
  gDialog.blueLabel = document.getElementById("blueLabel");
  gDialog.greenLabel = document.getElementById("greenLabel");
  gDialog.hueLabel = document.getElementById("hueLabel");
  gDialog.saturationLabel = document.getElementById("saturationLabel");
  gDialog.brightnessLabel = document.getElementById("brightnessLabel");
  gDialog.hexColourLabel = document.getElementById("hexColourLabel");
  gDialog.nameColourLabel = document.getElementById("nameColourLabel");

  gDialog.hueAndSaturationImg = document.getElementById("hueAndSaturationImg");
  gDialog.hueAndSaturationCrosshair = document.getElementById("hueAndSaturationCrosshair");
  gDialog.brightnessImg    = document.getElementById("brightnessImg");
  gDialog.swatch           = document.getElementById("swatch");
  gDialog.brightnessArrow  = document.getElementById("brightnessArrow");
  gDialog.colorpicker      = document.getElementById("colorpicker");
  gDialog.Ok               = document.documentElement.getButton("accept");
  gDialog.transparencyCheckbox = document.getElementById("transparencyCheckbox");

  gDialog.CellOrTableGroup = document.getElementById("CellOrTableGroup");
  gDialog.TableRadio       = document.getElementById("TableRadio");
  gDialog.CellRadio        = document.getElementById("CellRadio");
  gDialog.LastPickedColor  = document.getElementById("LastPickedColor");

  // The type of color we are setting: 
  //  text: Text, Link, ActiveLink, VisitedLink, 
  //  or background: Page, Table, or Cell
  var prefs = GetPrefs();
  if (gColorObj.Type)
  {
    ColorType = gColorObj.Type;
    // Get string for dialog title from passed-in type 
    //   (note constraint on editor.properties string name)
    var IsCSSPrefChecked = prefs.getBoolPref("editor.use_css");

    if (GetCurrentEditor())
    {
      window.title = GetString(ColorType+"Color");
      if (ColorType == "Page" && IsCSSPrefChecked && IsHTMLEditor())
        window.title = GetString("BlockColor");
    }
  }
  if (!window.title)
    window.title = GetString("Color");

  colours = new objColour();

  makeDraggable(gDialog.hueAndSaturationImg);
  makeDraggable(gDialog.hueAndSaturationCrosshair);
  makeDraggable(gDialog.brightnessImg);

  gDialog.hexColour.value = "";
  var tmpColor;
  var haveTableRadio = false;
  var showTransparencyCheckbox = false;

  switch (ColorType)
  {
    case "Page":
      tmpColor = gColorObj.PageColor;
      if (tmpColor && tmpColor.toLowerCase() != "window")
        gColor = tmpColor;
      showTransparencyCheckbox = true;
      break;
    case "Table":
      if (gColorObj.TableColor)
        gColor = gColorObj.TableColor;
      break;
    case "Cell":
      if (gColorObj.CellColor)
        gColor = gColorObj.CellColor;
      break;
    case "TableOrCell":
      TableOrCell = true;
      document.getElementById("TableOrCellGroup").collapsed = false;
      showTransparencyCheckbox = true;
      haveTableRadio = true;
      if (gColorObj.SelectedType == "Cell")
      {
        gColor = gColorObj.CellColor;
        gDialog.CellOrTableGroup.selectedItem = gDialog.CellRadio;
        gDialog.CellRadio.focus();
      }
      else
      {
        gColor = gColorObj.TableColor;
        gDialog.CellOrTableGroup.selectedItem = gDialog.TableRadio;
        gDialog.TableRadio.focus();
      }
      break;
    case "Highlight":
      HighlightType = true;
      if (gColorObj.HighlightColor)
        gColor = gColorObj.HighlightColor;
      showTransparencyCheckbox = true;
      break;
    default:
      // Any other type will change some kind of text,
      TextType = true;
      tmpColor = gColorObj.TextColor;
      if (tmpColor && tmpColor.toLowerCase() != "windowtext")
        gColor = gColorObj.TextColor;
      break;
  }

  if (!gColor)
  {
    var useCustomColors = prefs.getBoolPref("editor.use_custom_colors");
    switch (ColorType)
    {
      case "Page":
      case "Highlight":
        if (useCustomColors)
          gColor = prefs.getCharPref("editor.background_color");
        else
        {
          gColor = prefs.getCharPref("browser.display.background_color");
        }
        break;
      case "Table":
      case "Cell":
      case "TableOrCell":
        gColor = "transparent";
        showTransparencyCheckbox = true;
        break;
      default:
        if (useCustomColors)
          gColor = prefs.getCharPref("editor.text_color");
        else
        {
          gColor = prefs.getCharPref("browser.display.foreground_color");
        }
        break;
    }
  }

  if (!showTransparencyCheckbox)
    gDialog.transparencyCheckbox.setAttribute("hidden", true);

  // Use last-picked colors passed in, or those persistent on dialog
  if (TextType)
  {
    if ( !("LastTextColor" in gColorObj) || !gColorObj.LastTextColor)
      gColorObj.LastTextColor = gDialog.LastPickedColor.getAttribute("LastTextColor");
    LastPickedColor = gColorObj.LastTextColor;
  }
  else if (HighlightType)
  {
    if ( !("LastHighlightColor" in gColorObj) || !gColorObj.LastHighlightColor)
      gColorObj.LastHighlightColor = gDialog.LastPickedColor.getAttribute("LastHighlightColor");
    LastPickedColor = gColorObj.LastHighlightColor;
  }
  else
  {
    if ( !("LastBackgroundColor" in gColorObj) || !gColorObj.LastBackgroundColor)
      gColorObj.LastBackgroundColor = gDialog.LastPickedColor.getAttribute("LastBackgroundColor");
    LastPickedColor = gColorObj.LastBackgroundColor;
  }
  gDialog.LastPickedColor.setAttribute("style","background-color: "+LastPickedColor);

  // Set initial color in input field and in the colorpicker
  SetCurrentColor(gColor);
  if (!showTransparencyCheckbox)
    gDialog.colorpicker.initColor(gColor);

  // Caller can prevent user from submitting an empty, i.e., default color
  NoDefault = gColorObj.NoDefault;
  if (NoDefault)
  {
    // Hide the "Default button -- user must pick a color
    var defaultColorButton = document.getElementById("DefaultColorButton");
    if (defaultColorButton)
      defaultColorButton.collapsed = true;
  }

  // Set focus to colorpicker if not set to table radio buttons above
  if (!haveTableRadio)
    gDialog.colorpicker.focus();

  SetWindowLocation();
}

function ValidateData()
{
  if (gDialog.transparencyCheckbox.checked)
    gColor = "transparent";
  else if (LastPickedIsDefault)
    gColor = LastPickedColor;
  else
    gColor = gDialog.hexColour.value;

  if (ColorType == "TableOrCell" &&
      gColor == "transparent")
    gColor = "";
  gColor = TrimString(gColor).toLowerCase();

  // TODO: Validate the color string!

  if (NoDefault && !gColor)
  {
    ShowInputErrorMessage(GetString("NoColorError"));
    SetTextboxFocus(gDialog.hexColour);
    return false;   
  }
  return true;
}

function onAccept()
{
  if (!ValidateData())
    return false;

  // Set return values and save in persistent color attributes
  if (TextType)
  {
    gColorObj.TextColor = gColor;
    if (gColor.length > 0)
    {
      gDialog.LastPickedColor.setAttribute("LastTextColor", gColor);
      gColorObj.LastTextColor = gColor;
    }
  }
  else if (HighlightType)
  {
    gColorObj.HighlightColor = gColor;
    if (gColor.length > 0)
    {
      gDialog.LastPickedColor.setAttribute("LastHighlightColor", gColor);
      gColorObj.LastHighlightColor = gColor;
    }
  }
  else
  {
    gColorObj.BackgroundColor = gColor;
    if (gColor.length > 0)
    {
      gDialog.LastPickedColor.setAttribute("LastBackgroundColor", gColor);
      gColorObj.LastBackgroundColor = gColor;
    }
    // If table or cell requested, tell caller which element to set on
    if (TableOrCell && gDialog.TableRadio.selected)
      gColorObj.Type = "Table";
  }
  SaveWindowLocation();

  return true; // do close the window
}


