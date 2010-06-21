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
 * Portions created by the Initial Developer are Copyright (C) 2006
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

Components.utils.import("resource://gre/modules/cssHelper.jsm");
Components.utils.import("resource://gre/modules/editorHelper.jsm");
Components.utils.import("resource://gre/modules/l10nHelper.jsm");

const kWINDOWMEDIATOR_CID = "@mozilla.org/appshell/window-mediator;1";

const interfaces = Components.interfaces;
const nsIWindowMediator = interfaces.nsIWindowMediator;
const nsIDOMWindowInternal = interfaces.nsIDOMWindowInternal;
const nsIPlaintextEditor = interfaces.nsIPlaintextEditor;
const nsIHTMLEditor = interfaces.nsIHTMLEditor;
const nsIEditingSession = interfaces.nsIEditingSession;

var BlueGriffonVars = {
  kXUL_NS: "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
};

var gPrefs = null;

function TrimStringLeft(string)
{
  if(!string) return "";
  return string.replace(/^\s+/, "");
}

function TrimStringRight(string)
{
  if (!string) return "";
  return string.replace(/\s+$/, '');
}

// Remove whitespace from both ends of a string
function TrimString(string)
{
  if (!string) return "";
  return string.replace(/(^\s+)|(\s+$)/g, '')
}

function baseConverter (number,ob,nb) {
  // Created 1997 by Brian Risk.  http://members.aol.com/brianrisk
  number = String(number).toUpperCase();
  var list = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var dec = 0;
  for (var i = 0; i <=  number.length; i++) {
    dec += (list.indexOf(number.charAt(i))) * (Math.pow(ob , (number.length - i - 1)));
  }
  number = "";
  var magnitude = Math.floor((Math.log(dec))/(Math.log(nb)));
  for (var i = magnitude; i >= 0; i--) {
    var amount = Math.floor(dec/Math.pow(nb,i));
    number = number + list.charAt(amount); 
    dec -= amount*(Math.pow(nb,i));
  }
  return number;
}

// used by openLocation. see openLocation.js for additional notes.
function delayedOpenWindow(chrome, flags, param1, param2)
{
  dump("delayOpenWindow: setting timeout\n");
  setTimeout("window.openDialog('"+chrome+"','_blank','"+flags+"','"+param1+"','"+param2+"')", 10);
}

function GetPrefs()
{
  if (gPrefs)
    return gPrefs;
  try {
    gPrefs = Components.classes["@mozilla.org/preferences-service;1"]
                     .getService(Components.interfaces.nsIPrefBranch);
  } catch (ex) {
    // not critical, remain silent
  }
  return gPrefs;
}

function GetPrefsService()
{
  if (gPrefsService)
    return gPrefsService;

  try {
    gPrefsService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
  }
  catch(ex) {
    dump("failed to get prefs service!\n");
  }

  return gPrefsService;
}

function GetUnicharPref(aPrefName, aDefVal)
{
  var prefs = GetPrefs();
  if (prefs)
  {
    try {
      return prefs.getComplexValue(aPrefName, Components.interfaces.nsISupportsString).data;
    }
    catch(e) {}
  }
  return "";
}

function SetUnicharPref(aPrefName, aPrefValue)
{
  var prefs = GetPrefs();
  if (prefs)
  {
    try {
      var str = Components.classes["@mozilla.org/supports-string;1"]
                          .createInstance(Components.interfaces.nsISupportsString);
      str.data = aPrefValue;
      prefs.setComplexValue(aPrefName, Components.interfaces.nsISupportsString, str);
    }
    catch(e) {}
  }
}

function toOpenWindowByType(inType, uri)
{
  window.open(uri, "_blank", "chrome,extrachrome,menubar,resizable,scrollbars,status,toolbar");
}

function SetTextboxFocusById(aId)
{
  SetTextboxFocus(document.getElementById(aId));
}

function SetTextboxFocus(aElt)
{
  if (aElt)
  {
    setTimeout( function(textbox) { textbox.focus(); textbox.select(); }, 0, aElt);
  }
}

function SetEnabledElementAndControl(aElt, aEnabled)
{
  if (aElt)
  {
    SetEnabledElement(aElt, aEnabled);
    if (aElt.hasAttribute("control"))
    {
      SetEnabledElement(document.getElementById(aElt.getAttribute("control")),
                        aEnabled);
    }
  }
}

function SetEnabledElement(aElt, aEnabled)
{
  if (!aElt)
    return;
  if (aEnabled)
    aElt.removeAttribute("disabled");
  else
    aElt.setAttribute("disabled", "true");
}

function deleteAllChildren(aElt)
{
  var child = aElt.lastChild;
  while (child)
  {
    var tmp = child.previousSibling;
    aElt.removeChild(child);
    child = tmp;
  }
}

function initClassMenu(menuPopup, aUseSelection)
{
  deleteAllChildren(menuPopup);

  var mixedObj = new Object();
  var classesArray, classesArrayLength = 0;
  
  if (aUseSelection)
  {
    var classes  = EditorUtils.getClasses(EditorUtils.getSelectionContainer().node).classes;
    if (classes)
    {
      classesArray = classes.split(" ");
      classesArray.sort();
      classesArrayLength = classesArray.length;

      for (var index = 0; index < classesArrayLength; index++)
      {
        var menuEntry = document.createElementNS(BlueGriffonVars.kXUL_NS, "menuitem");
        menuEntry.setAttribute("type",    "checkbox");
        menuEntry.setAttribute("checked", "true");
        menuEntry.setAttribute("class",   "menuitem-iconic");
        menuEntry.setAttribute("label",   classesArray[index]);
        menuEntry.setAttribute("value",   classesArray[index]);
  
        menuPopup.appendChild(menuEntry);
      }
    }
  }
  else
  {
    var menuEntry = document.createElementNS(BlueGriffonVars.kXUL_NS, "menuitem");
    menuEntry.setAttribute("type",    "checkbox");
    menuEntry.setAttribute("class",   "menuitem-iconic");
    menuEntry.setAttribute("label",   L10NUtils.getString("NoClassAvailable"));
    menuEntry.setAttribute("value",   "");
    menuPopup.appendChild(menuEntry);

    var menuSep = document.createElementNS(BlueGriffonVars.kXUL_NS, "menuseparator");
    menuPopup.appendChild(menuSep);

    menuPopup.parentNode.selectedIndex = 0;
  }

  var classList =  CssUtils.getAllClassesForDocument(EditorUtils.getCurrentEditor().document);

  if (classList && classList.length)
  {
    if (classesArrayLength)
    {
      var menuSep = document.createElementNS(BlueGriffonVars.kXUL_NS, "menuseparator");
      menuPopup.appendChild(menuSep);
    }


    var classListLength = classList.length;

    classList.sort();

    var previousClass = "";
    for (var index = 0; index < classListLength; index++)
    {
      var classEntry = classList[index];
      if (classEntry != previousClass)
      {
        previousClass = classEntry;

        var found = false;
        if (classesArrayLength)
        {
          var existingClassesIndex;
          for (existingClassesIndex = 0; existingClassesIndex < classesArrayLength; existingClassesIndex++)
            if (classesArray[existingClassesIndex] == classEntry)
            {
              found = true;
              break;
            }
        }
        if (!found)
        {
          menuEntry = document.createElementNS(BlueGriffonVars.kXUL_NS, "menuitem");
          menuEntry.setAttribute("type",    "checkbox");
          menuEntry.setAttribute("class",   "menuitem-iconic");
          menuEntry.setAttribute("label",   classEntry);
          menuEntry.setAttribute("value",   classEntry);
          menuPopup.appendChild(menuEntry);
        }
      }
    }
  }
  else if (aUseSelection)
  {
    // no class defined in the document
    menuEntry = document.createElementNS(BlueGriffonVars.kXUL_NS, "menuitem");
    menuEntry.setAttribute("type",    "checkbox");
    menuEntry.setAttribute("label",   L10NUtils.getString("NoClassAvailable"));
    menuPopup.appendChild(menuEntry);
  }
}

function initIdMenu(menuPopup)
{
  deleteAllChildren(menuPopup);

  var menuEntry = document.createElementNS(BlueGriffonVars.kXUL_NS, "menuitem");
  menuEntry.setAttribute("type",    "checkbox");
  menuEntry.setAttribute("class",   "menuitem-iconic");
  menuEntry.setAttribute("label",   L10NUtils.getString("NoIdAvailable"));
  menuEntry.setAttribute("value",   "");
  menuPopup.appendChild(menuEntry);

  var menuSep = document.createElementNS(BlueGriffonVars.kXUL_NS, "menuseparator");
  menuPopup.appendChild(menuSep);

  menuPopup.parentNode.selectedIndex = 0;

  var idList =  CssUtils.getAllIdsForDocument(EditorUtils.getCurrentEditor().document);

  if (idList && idList.length)
  {
    var idListLength = idList.length;

    idList.sort();

    var previousId = "";
    for (var index = 0; index < idListLength; index++)
    {
      var idEntry = idList[index];
      if (idEntry != previousId)
      {
        previousId = idEntry;

        menuEntry = document.createElementNS(BlueGriffonVars.kXUL_NS, "menuitem");
        menuEntry.setAttribute("type",    "checkbox");
        menuEntry.setAttribute("class",   "menuitem-iconic");
        menuEntry.setAttribute("label",   idEntry);
        menuEntry.setAttribute("value",   idEntry);
        menuPopup.appendChild(menuEntry);
      }
    }
  }
}

function GetIndexOfNode(aNode)
{
  if (aNode)
  {
    // the following 3 lines are an excellent suggestion from Neil Rashbrook
    var range = aNode.ownerDocument.createRange();
    range.selectNode(aNode);
    return range.startOffset;
  }
  return null;
}

function OpenAppModalWindow(aParentWindow, aChromeURL, aWindowName, aResizable) 
{
  var ww = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
                     .getService(Components.interfaces.nsIWindowWatcher);
  var mutableArray = Components.classes["@mozilla.org/array;1"]
                       .createInstance(Components.interfaces.nsIMutableArray);

  const args = Components.classes["@mozilla.org/embedcomp/dialogparam;1"]
                 .createInstance(Components.interfaces.nsIDialogParamBlock);

  var a = [];
  for (var i = 4 ; i < arguments.length; i++)
    if (typeof arguments[i] == "string")
      mutableArray.appendElement({value:arguments[i]}, false);
    else
      mutableArray.appendElement(arguments[i], false);

  args.objects = mutableArray;

  // This lets the dialog get the raw js object
  //args.wrappedJSObject = args;

#ifdef XP_MACOSX
  ww.openWindow(null, // make this an app-modal window on Mac
#else
  ww.openWindow(aParentWindow,
#endif
                aChromeURL,
                aWindowName,
                "chrome,titlebar,centerscreen" +
                  (aResizable ? ",resizable" : ""),
                args);
};