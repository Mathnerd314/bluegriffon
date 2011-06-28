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

Components.utils.import("resource://gre/modules/InlineSpellChecker.jsm");
Components.utils.import("resource://gre/modules/Services.jsm");

Components.utils.import("resource://app/modules/urlHelper.jsm");
Components.utils.import("resource://app/modules/prompterHelper.jsm");
Components.utils.import("resource://app/modules/editorHelper.jsm");
Components.utils.import("resource://app/modules/cssHelper.jsm");
Components.utils.import("resource://app/modules/fileHelper.jsm");
Components.utils.import("resource://app/modules/l10nHelper.jsm");
Components.utils.import("resource://app/modules/handlersManager.jsm");
Components.utils.import("resource://app/modules/screens.jsm");

#include blanks.inc

#include observers.inc

#include startup.inc

#include shutdown.inc


function OpenLocation(aEvent, type)
{
  window.openDialog("chrome://bluegriffon/content/dialogs/openLocation.xul","_blank",
              "chrome,modal,titlebar", type);
  if (aEvent) aEvent.stopPropagation();
}

function OpenNewWindow(aURL)
{
  // warning, the first argument MUST be null here because when the
  // first window is created, it gets the cmdLine as an argument
  window.delayedOpenWindow("chrome://bluegriffon/content/xul/bluegriffon.xul", "chrome,all,dialog=no", null, aURL);
}

function GetPreferredNewDocumentURL()
{
  var url = window["kHTML_TRANSITIONAL"];
  try {
    urlId = GetPrefs().getCharPref("bluegriffon.defaults.doctype");
    url = window[urlId]; 
  }
  catch(e) {}
  return url;
}

function NewDocument(aEvent)
{
  var url = GetPreferredNewDocumentURL();

  OpenFile(url, true);
  if (aEvent) aEvent.stopPropagation();
}

function NewDocumentInNewWindow(aEvent)
{
  var url = GetPreferredNewDocumentURL();

  OpenFile(url, false);
  if (aEvent) aEvent.stopPropagation();
}

function NewDocumentWithOptions(aEvent)
{
  var rv = {value: "", where:"tab"};
  window.openDialog("chrome://bluegriffon/content/dialogs/newDocument.xul","_blank",
              "chrome,modal,titlebar", rv);
  if (aEvent) aEvent.stopPropagation();
  if (rv.value)
  {
    OpenFile(window[rv.value], (rv.where == "tab"));
  }
}

function OpenFile(aURL, aInTab)
{
  // early way out if no URL
  if (!aURL)
    return;
 
  var alreadyEdited = EditorUtils.isAlreadyEdited(aURL);
  if (alreadyEdited)
  {
    var win    = alreadyEdited.window;
    var editor = alreadyEdited.editor;
    var index  = alreadyEdited.index;
    win.document.getElementById("tabeditor").selectedIndex = index;
    win.document.getElementById("tabeditor").mTabpanels.selectedPanel = editor;

    // nothing else to do here...
    win.focus();
    return;
  }

  // force new window if we don't have one already
  var tabeditor = document.getElementById("tabeditor");
  if (tabeditor && aInTab) {
    document.getElementById("tabeditor").addEditor(
         UrlUtils.stripUsernamePassword(aURL, null, null),
         aURL);
    gDialog.structurebar.removeAttribute("class");
  }
  else
    OpenNewWindow(aURL);
}

function EditorLoadUrl(aElt, aURL)
{
  try {
    if (aURL)
    {
      var Ci = Components.interfaces;
      var url = UrlUtils.normalizeURL(aURL);

      aElt.webNavigation.loadURI(url, // uri string
             Components.interfaces.nsIWebNavigation.LOAD_FLAGS_BYPASS_CACHE,     // load flags
             null,                                         // referrer
             null,                                         // post-data stream
             null);
    }
  } catch (e) { }
}

function AboutComposer()
{
  var wm = Services.wm;
  var enumerator = wm.getEnumerator( "BlueGriffon:About" );
  while ( enumerator.hasMoreElements() )
  {
    var win = enumerator.getNext().QueryInterface(Components.interfaces.nsIDOMWindowInternal);
    win.focus();
    return;
  }
  window.open('chrome://bluegriffon/content/dialogs/aboutDialog.xul',"_blank",
              "chrome,resizable,scrollbars=yes");
}

function OpenConsole()
{
  window.open("chrome://global/content/console.xul","_blank",
              "chrome,extrachrome,menubar,resizable,scrollbars,status,toolbar");
}

function OpenExtensionsManager()
{
  window.openDialog("chrome://mozapps/content/extensions/extensions.xul?type=extensions",
                    "",
                    "chrome,dialog=no,resizable");
}

function StopLoadingPage()
{
  gDialog.tabeditor.stopWebNavigation();
}

//--------------------------------------------------------------------
function onButtonUpdate(button, commmandID)
{
  var commandNode = gDialog[commmandID];
  var state = commandNode.getAttribute("state");
  button.checked = state == "true";
}

function UpdateWindowTitle()
{
  try {
    var windowTitle = EditorUtils.getDocumentTitle();
    if (!windowTitle)
      windowTitle = L10NUtils.getString("untitled");

    // Append just the 'leaf' filename to the Doc. Title for the window caption
    var docUrl = UrlUtils.getDocumentUrl();
    if (docUrl && !UrlUtils.isUrlOfBlankDocument(docUrl))
    {
      var scheme = UrlUtils.getScheme(docUrl);
      var filename = UrlUtils.getFilename(docUrl);
      if (filename)
        windowTitle += " [" + scheme + ":/.../" + filename + "]";

      // TODO: 1. Save changed title in the recent pages data in prefs
    }

    // Set window title with
    var titleModifier = L10NUtils.getString("titleModifier");
    document.title    = L10NUtils.getBundle()
                                 .formatStringFromName("titleFormat",
                                                       [windowTitle, titleModifier],
                                                       2);
  } catch (e) { }
}

function onParagraphFormatChange(paraMenuList, commandID)
{
  if (!paraMenuList)
    return;

  var commandNode = gDialog[commandID];
  var state = commandNode.getAttribute("state");

  // force match with "normal"
  if (state == "body")
    state = "";

  if (state == "mixed")
  {
    //Selection is the "mixed" ( > 1 style) state
    paraMenuList.selectedItem = null;
    //paraMenuList.setAttribute("label",GetString('Mixed'));
    paraMenuList.setAttribute("label", "mixed");
  }
  else
  {
    var menuPopup = gDialog.ParagraphPopup;
    var menuItems = menuPopup.childNodes;
    for (var i=0; i < menuItems.length; i++)
    {
      var menuItem = menuItems.item(i);
      if ("value" in menuItem && menuItem.value == state)
      {
        paraMenuList.selectedItem = menuItem;
        break;
      }
    }
  }
}

function onARIARoleChange(menuList, commandID)
{
  var commandNode = document.getElementById(commandID);
  var state = commandNode.getAttribute("state");
  menuList.value = state;
}

function onARIARoleChangeStructureBar(commandID)
{
  var commandNode = document.getElementById(commandID);
  var state = commandNode.getAttribute("state");
  var popup = gDialog.ARIARoleStructureBarPopup;
  var child = popup.firstElementChild;
  while (child) {
    if (child.getAttribute("value") == state)
      child.setAttribute("checked", "true");
    else
      child.removeAttribute("checked");
    child = child.nextElementSibling;
  }
}

/************* GLOBAL VARS *************/



/************* FONT FACE ****************/

function initFontFaceMenu(menuPopup)
{
  initLocalFontFaceMenu(menuPopup);

  if (menuPopup)
  {
    var children = menuPopup.childNodes;
    if (!children) return;

    var firstHas = { value: false };
    var anyHas = { value: false };
    var allHas = { value: false };

    // we need to set or clear the checkmark for each menu item since the selection
    // may be in a new location from where it was when the menu was previously opened

    // Fixed width (second menu item) is special case: old TT ("teletype") attribute
    EditorUtils.getTextProperty("tt", "", "", firstHas, anyHas, allHas);
    children[1].setAttribute("checked", allHas.value);

    if (!anyHas.value)
      EditorUtils.getTextProperty("font", "face", "", firstHas, anyHas, allHas);

    children[0].setAttribute("checked", !anyHas.value);

    // Skip over default, TT, and separator
    for (var i = 3; i < children.length; i++)
    {
      var menuItem = children[i];
      var faceType = menuItem.getAttribute("value");

      if (faceType)
      {
        EditorUtils.getTextProperty("font", "face", faceType, firstHas, anyHas, allHas);

        // Check the menuitem only if all of selection has the face
        if (allHas.value)
        {
          menuItem.setAttribute("checked", "true");
          break;
        }

        // in case none match, make sure we've cleared the checkmark
        menuItem.removeAttribute("checked");
      }
    }
  }
}

const kFixedFontFaceMenuItems = 7; // number of fixed font face menuitems

function initLocalFontFaceMenu(menuPopup)
{
  // fill in the menu only once...
  var callingId = menuPopup.parentNode.id;

  if(!BlueGriffonVars.fontMenuOk)
    BlueGriffonVars.fontMenuOk = {};
  if (BlueGriffonVars.fontMenuOk[callingId ] &&
      menuPopup.childNodes.length != kFixedFontFaceMenuItems)
    return;
  BlueGriffonVars.fontMenuOk[callingId ] = callingId ;

  if (!BlueGriffonVars.localFonts)
  {
    // Build list of all local fonts once per editor
    try 
    {
      var enumerator = Components.classes["@mozilla.org/gfx/fontenumerator;1"]
                                 .getService(Components.interfaces.nsIFontEnumerator);
      var localFontCount = { value: 0 }
      BlueGriffonVars.localFonts = enumerator.EnumerateAllFonts(localFontCount);
    }
    catch(e) { }
  }
  
  var useRadioMenuitems = (menuPopup.parentNode.localName == "menu"); // don't do this for menulists  
  if (menuPopup.childNodes.length == kFixedFontFaceMenuItems) 
  {
    if (BlueGriffonVars.localFonts.length == 0) {
      menuPopup.childNodes[kFixedFontFaceMenuItems - 1].hidden = true;
    }
    for (var i = 0; i < BlueGriffonVars.localFonts.length; ++i)
    {
      if (BlueGriffonVars.localFonts[i] != "")
      {
        var itemNode = document.createElementNS(BlueGriffonVars.kXUL_NS, "menuitem");
        itemNode.setAttribute("label", BlueGriffonVars.localFonts[i]);
        itemNode.setAttribute("value", BlueGriffonVars.localFonts[i]);
        if (useRadioMenuitems) {
          itemNode.setAttribute("type", "radio");
          itemNode.setAttribute("name", "2");
          itemNode.setAttribute("observes", "cmd_renderedHTMLEnabler");
        }
        menuPopup.appendChild(itemNode);
      }
    }
  }
}

function onFontFaceChange(fontFaceMenuList, commandID)
{
  var commandNode = document.getElementById(commandID);
  var state = commandNode.getAttribute("state");

  if (state == "mixed")
  {
    //Selection is the "mixed" ( > 1 style) state
    fontFaceMenuList.selectedItem = null;
    fontFaceMenuList.setAttribute("label",GetString('Mixed'));
  }
  else
  {
    var menuPopup = document.getElementById("FontFacePopup");
    var menuItems = menuPopup.childNodes;
    for (var i=0; i < menuItems.length; i++)
    {
      var menuItem = menuItems.item(i);
      if (menuItem.getAttribute("label") && ("value" in menuItem && menuItem.value.toLowerCase() == state.toLowerCase()))
      {
        fontFaceMenuList.selectedItem = menuItem;
        break;
      }
    }
  }
}

/************** CLASS MANAGEMENT **************/

function onClassChange(classMenuList, commandID)
{
  var commandNode = document.getElementById(commandID);
  var state = commandNode.getAttribute("state");
  classMenuList.value = state;
}

var gChangingClass = false;
function OnKeyPressInClassMenulist(aEvent)
{
  gChangingClass = true;
  var keyCode = aEvent.keyCode;
  if (keyCode == 13) {
    gDialog.ClassSelect.blur();
  }  
}

function OnBlurFromClassMenulist(aEvent)
{
  if (gChangingClass) {
    gChangingClass = false;
    var node = EditorUtils.getSelectionContainer().node;
    var className = gDialog.ClassSelect.value;
    if (className)
      EditorUtils.getCurrentEditor().setAttribute(node, "class", className);
    else
      EditorUtils.getCurrentEditor().removeAttribute(node, "class");
    // be kind with the rest of the world
    NotifierUtils.notify("selection", node, false);
  }  
}

/************** ID MANAGEMENT **************/

function onIdChange(idMenuList, commandID)
{
  var commandNode = document.getElementById(commandID);
  var state = commandNode.getAttribute("state");
  idMenuList.value = state;
}

var gChangingId = false;
function OnKeyPressInIdMenulist(aEvent)
{
  gChangingId = true;
  var keyCode = aEvent.keyCode;
  if (keyCode == 13) {
    gDialog.IdSelect.blur();
  }  
}

function OnBlurFromIdMenulist(aEvent)
{
  if (gChangingId) {
    gChangingId = false;
    var node = EditorUtils.getSelectionContainer().node;
    var id = gDialog.IdSelect.value;
    if (id)
      EditorUtils.getCurrentEditor().setAttribute(node, "id", id);
    else
      EditorUtils.getCurrentEditor().removeAttribute(node, "id");
    // be kind with the rest of the world
    NotifierUtils.notify("selection", node, false);
  }  
}

/************** STRUCTUREBAR *************/

function UpdateStructureBarContextMenu()
{
  var popupNode = document.popupNode;
  var target    = null;
  if (popupNode)
    target = popupNode.getUserData("node");
  if (target) // sanity check
    try {
      EditorUtils.getCurrentEditor().selectElement(target);
    }
    catch(e) {}

  if (target && target.hasAttribute("lang"))
    gDialog.resetElementLanguageMenuitem.removeAttribute("disabled");
  else
    gDialog.resetElementLanguageMenuitem.setAttribute("disabled", "true");

  if (target && target == target.ownerDocument.body)
  {
    gDialog.deleteElementMenuitem.setAttribute("disabled", "true");
    gDialog.removeTagMenuitem.setAttribute("disabled", "true");
    gDialog.changeTagMenuitem.setAttribute("disabled", "true");
  }
  else
  {
    gDialog.deleteElementMenuitem.removeAttribute("disabled");
    gDialog.removeTagMenuitem.removeAttribute("disabled");
    gDialog.changeTagMenuitem.removeAttribute("disabled");
  }
}

function ResetLanguage(aEvent)
{
  var popupNode = document.popupNode;
  if (popupNode)
  {
    var target = popupNode.getUserData("node");
    if (target)
    {
      var editor = EditorUtils.getCurrentEditor();
      editor.removeAttribute(target, "lang");
    }
  }
}

function ShowLanguageDialog(aEvent)
{
  var popupNode = document.popupNode;
  if (popupNode)
  {
    var target = popupNode.getUserData("node");
    if (target)
      window.openDialog("chrome://bluegriffon/content/dialogs/languages.xul","_blank",
                        "chrome,modal,titlebar,resizable", target);
  }
}

function DeleteElement(aEvent)
{
  var popupNode = document.popupNode;
  if (popupNode)
  {
    var target = popupNode.getUserData("node");
    if (target)
    {
      var editor = EditorUtils.getCurrentEditor();
      editor.deleteNode(target);
    }
  }
}

function ExplodeElement(aEvent)
{
  var popupNode = document.popupNode;
  if (popupNode)
  {
    var target = popupNode.getUserData("node");
    if (target)
    {
      var editor = EditorUtils.getCurrentEditor();
      var parent = target.parentNode;
      editor.beginTransaction();

      var child = target.firstChild;
      while (child) {
        var tmp = child.nextSibling;
        var clone = child.cloneNode(true)
        var txn = new diNodeInsertionTxn(clone, parent, target);
        editor.transactionManager.doTransaction(txn);

        child = tmp;
      }
      editor.deleteNode(target);

      editor.endTransaction();
    }
  }
}

function ChangeTag(aEvent)
{
  var popupNode = gDialog.structurebar.querySelector("[checked='true']");
  var textbox = document.createElement("textbox");
  textbox.setAttribute("value", popupNode.getAttribute("value"));
  textbox.setAttribute("width", popupNode.boxObject.width);
  textbox.className = "struct-textbox";

  var target = popupNode.getUserData("node");
  textbox.setUserData("node", target, null);
  popupNode.parentNode.replaceChild(textbox, popupNode);

  textbox.addEventListener("keypress", OnKeyPressWhileChangingTag, false);
  textbox.addEventListener("blur", ResetStructToolbar, true);

  textbox.select();
}

function ResetStructToolbar(event)
{
  var editor = EditorUtils.getCurrentEditor();
  var textbox = event.target;
  var element = textbox.getUserData("node");
  textbox.parentNode.removeChild(textbox);
  editor.selectElement(element);
}

function OnKeyPressWhileChangingTag(event)
{
  var editor = EditorUtils.getCurrentEditor();
  var textbox = event.target;

  var keyCode = event.keyCode;
  if (keyCode == 13) {
    var newTag = textbox.value;
    var element = textbox.getUserData("node");
    textbox.parentNode.removeChild(textbox);

    if (newTag.toLowerCase() == element.nodeName.toLowerCase())
    {
      // nothing to do
      window.content.focus();
      return;
    }

    var offset = 0;
    var childNodes = element.parentNode.childNodes;
    while (childNodes.item(offset) != element) {
      offset++;
    }

    editor.beginTransaction();

    try {
      var newElt = editor.document.createElement(newTag);
      if (newElt) {
        childNodes = element.childNodes;
        var childNodesLength = childNodes.length;
        var i;
        for (i = 0; i < childNodesLength; i++) {
          var clone = childNodes.item(i).cloneNode(true);
          newElt.appendChild(clone);
        }
        editor.insertNode(newElt, element.parentNode, offset+1);
        editor.deleteNode(element);
        editor.selectElement(newElt);

        window.content.focus();
      }
    }
    catch (e) {}

    editor.endTransaction();

  }
  else if (keyCode == 27) {
    // if the user hits Escape, we discard the changes
    window.content.focus();
  }
}

/************ VIEW MODE ********/
function GetCurrentViewMode()
{
  return EditorUtils.getCurrentEditorElement().parentNode.getAttribute("currentmode") ||
         "wysiwyg";
}

function ToggleViewMode(aElement)
{
  if (!aElement) // sanity case
    return;

  var mode =  aElement.getAttribute("value");
  if (mode == GetCurrentViewMode())
    return;

  var child = aElement.parentNode.firstChild;
  while (child) {
    if (child == aElement)
      child.setAttribute("selected", "true");
    else
      child.removeAttribute("selected");
    child = child.nextSibling;
  }

  var editor = EditorUtils.getCurrentEditor();
  var editorElement = EditorUtils.getCurrentEditorElement();
  editorElement.parentNode.setAttribute("currentmode", mode);

  gDialog.bespinToolbox1.hidden = true;
  gDialog.bespinToolbox2.hidden = true;
  if (mode == "source")
  {
    gDialog.structurebar.style.visibility = "hidden";
    HandlersManager.hideAllHandlers();

    const nsIDE = Components.interfaces.nsIDocumentEncoder;
    var flags = nsIDE.OutputFormatted ;
    flags |= nsIDE.OutputWrap;
    flags |= nsIDE.OutputLFLineBreak;
    flags |= nsIDE.OutputPersistNBSP;

    var encodeEntity = GetPrefs().getCharPref("bluegriffon.source.entities");
    switch (encodeEntity) {
      case "basic"  : flags |= nsIDE.OutputEncodeBasicEntities;     break;
      case "latin1" : flags |= nsIDE.OutputEncodeLatin1Entities;    break;
      case "html"   : flags |= nsIDE.OutputEncodeHTMLEntities;      break;
      case "unicode": flags |= nsIDE.OutputEncodeCharacterEntities; break;
      default: break;
    }

    var mimeType = EditorUtils.getCurrentDocument().contentType;
    var encoder = Components.classes["@mozilla.org/layout/documentEncoder;1?type=" + mimeType]
                   .createInstance(Components.interfaces.nsIDocumentEncoder);
    encoder.setCharset("UTF-8");
    encoder.init(EditorUtils.getCurrentDocument(), mimeType, flags);

    NotifierUtils.notify("beforeEnteringSourceMode");
    var source = encoder.encodeToString();
    var bespinIframe = editorElement.previousSibling;
    var bespinEditor = bespinIframe.contentWindow.gEditor;
    bespinIframe.setUserData("oldSource", source, null);

    MarkSelection();
    source = encoder.encodeToString();

    UnmarkSelection();

    //bespinEditor.value = "";
    bespinEditor.getSession().setValue(source);
    NotifierUtils.notify("afterEnteringSourceMode");
    editorElement.parentNode.selectedIndex = 0;

    MarkSelectionInAce(bespinEditor, source);

    bespinIframe.focus();
    bespinEditor.focus();
  }
  else if (mode == "wysiwyg")
  {
    // Reduce the undo count so we don't use too much memory
    //   during multiple uses of source window 
    //   (reinserting entire doc caches all nodes)
    var bespinIframe = editorElement.previousSibling;
    var bespinEditor = bespinIframe.contentWindow.gEditor;
    if (bespinEditor)
    {
      NotifierUtils.notify("beforeLeavingSourceMode");
      source = bespinEditor.getSession().getValue();
      bespinEditor.blur();
      var oldSource = bespinIframe.getUserData("oldSource"); 
      if (source != oldSource) {
        var doctype = EditorUtils.getCurrentDocument().doctype;
        var publicId = doctype ? doctype.publicId : null;
        var isXML = false;
        switch (publicId) {
          case "http://www.w3.org/TR/html4/strict.dtd": // HTML 4
          case "http://www.w3.org/TR/html4/loose.dtd":
          case null:
            isXML = false;
            break;
          case "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd": // XHTML 1
          case "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd":
            isXML = true;
            break;
          case "":
            isXML = (EditorUtils.getCurrentDocument().documentElement.getAttribute("xmlns") == "http://www.w3.org/1999/xhtml");
            break;
        }
        if (isXML) {
          var xmlParser = new DOMParser();
          try {
            var doc = xmlParser.parseFromString(source, "text/xml");
            if (doc.documentElement.nodeName == "parsererror") {
              var message = doc.documentElement.firstChild.data.
                replace( /Location\: chrome\:\/\/bluegriffon\/content\/xul\/bluegriffon.xul/g , ", ");
              var error = doc.documentElement.lastChild.textContent;
              window.openDialog("chrome://bluegriffon/content/dialogs/parsingError.xul", "_blank",
                                "chrome,modal,titlebar", message, error);
              gDialog.wysiwygModeButton.removeAttribute("selected");
              gDialog.sourceModeButton.setAttribute("selected", "true");
              editorElement.parentNode.setAttribute("currentmode", "source");
              return;
            }
            gDialog.structurebar.style.visibility = "";
            RebuildFromSource(doc);
          }
          catch(e) {alert(e)}
        }
        else {
          var hp = new htmlParser(gDialog.parserIframe);
          hp.parseHTML(source,
                       EditorUtils.getDocumentUrl(),
                       function(aDoc, ctx) { gDialog.structurebar.style.visibility = "";; RebuildFromSource(aDoc, ctx); },
                       hp);
        }
      }
      else {
        NotifierUtils.notify("afterLeavingSourceMode");
        editorElement.parentNode.selectedIndex = 1;
        gDialog.structurebar.style.visibility = "";
        window.content.focus();
      }
    }
  }
  editorElement.parentNode.setAttribute("previousMode", mode);
  window.updateCommands("style");
}

function CloneElementContents(editor, sourceElt, destElt)
{
  editor.cloneAttributes(destElt, sourceElt);
  var lastChild = destElt.lastChild;
  if (!lastChild || lastChild.nodeName.toLowerCase() != "br") {
    lastChild = editor.document.createElement("br");
    lastChild.setAttribute("type", "_moz");
    editor.insertNode(lastChild, destElt, destElt.childNodes.length);
  }

  var sourceChild = sourceElt.firstChild;
  while (sourceChild) {
    if (sourceChild.nodeType == Node.ELEMENT_NODE) {
      var destChild = editor.document.importNode(sourceChild, true);
      editor.insertNode(destChild, destElt, destElt.childNodes.length);
    }
    else if (sourceChild.nodeType == Node.TEXT_NODE) {
      t = editor.document.createTextNode(sourceChild.data);
      editor.insertNode(t, destElt, destElt.childNodes.length);
    }
    else if (sourceChild.nodeType == Node.COMMENT_NODE) {
      t = editor.document.createComment(sourceChild.data);
      editor.insertNode(t, destElt, destElt.childNodes.length);
    }

    sourceChild = sourceChild.nextSibling;
  }

  var child = destElt.firstChild;
  do {
    var stopIt = (child == lastChild);
    editor.deleteNode(child);
    child = destElt.firstChild;
  } while (!stopIt);
}

function RebuildFromSource(aDoc, aContext)
{
  if (aContext)
    delete aContext;
  EditorUtils.getCurrentEditorElement().parentNode.selectedIndex = 1;
  var editor = EditorUtils.getCurrentEditor();
  try {

    // make sure everything is aggregated under one single txn
    editor.beginTransaction();
    // clone html attributes
    editor.cloneAttributes(editor.document.documentElement, aDoc.documentElement);
    // clone head
    CloneElementContents(editor, aDoc.querySelector("head"), editor.document.querySelector("head"));
    // clone body
    CloneElementContents(editor, aDoc.querySelector("body"), editor.document.body);
    editor.endTransaction();

    // the window title is updated by DOMTitleChanged event
  } catch(ex) {
  }
  NotifierUtils.notify("afterLeavingSourceMode");
  window.content.focus();
  EditorUtils.getCurrentEditorElement().focus();
}

function doCloseTab(aTab)
{
  var tabbox = aTab.parentNode.parentNode.parentNode;
  var tabs = aTab.parentNode;
  var tabpanels = tabbox.parentNode.mTabpanels;
  var index = tabs.getIndexOfItem(aTab);
  var selectedIndex = tabbox.selectedIndex;
  var editorBox = tabpanels.childNodes[index];
  tabpanels.removeChild(tabpanels.childNodes[index]);
  tabs.removeChild(aTab);
  if (selectedIndex < tabpanels.childNodes.length)
    tabbox.selectedIndex = selectedIndex;
  else if (tabpanels.childNodes.length)
    tabbox.selectedIndex = selectedIndex - 1;
  if (!tabpanels.childNodes.length) {
    tabbox.parentNode.mHruler.setAttribute("disabled", "true");
    tabbox.parentNode.mVruler.setAttribute("disabled", "true");
    tabbox.parentNode.setAttribute("visibility", "hidden");
    if (gDialog.structurebar)
      gDialog.structurebar.className = "hidden";
  }
  window.updateCommands("style");
  NotifierUtils.notify("tabClosed");
#ifdef XP_MACOSX
  if (gDialog.tabeditor)
    gDialog.tabeditor.updateOSXCloseButton();
  UpdateBadge();
#endif
}

function SetLocationDB()
{
  var mDBConn = GetDBConn();

  mDBConn.executeSimpleSQL("CREATE TABLE IF NOT EXISTS 'bgLocations' ('id' INTEGER PRIMARY KEY NOT NULL, 'query' VARCHAR NOT NULL, 'querydate' INTEGER NOT NULL, UNIQUE(query))");
  mDBConn.close();
}

function GetDBConn()
{
  var file = Components.classes["@mozilla.org/file/directory_service;1"]
                       .getService(Components.interfaces.nsIProperties)
                       .get("ProfD", Components.interfaces.nsIFile);
  file.append("bgLocations.sqlite");
  
  var storageService = Components.classes["@mozilla.org/storage/service;1"]
                          .getService(Components.interfaces.mozIStorageService);
  return storageService.openDatabase(file);
}

function doSaveTabsBeforeQuit()
{
  var tabeditor = EditorUtils.getCurrentTabEditor();
  if (!tabeditor)
    return true;
  var tabs = tabeditor.mTabs.childNodes;
  var l = tabs.length;
  for (var i = l-1; i >= 0; i--) {
    var tab = tabs.item(i);
    tabeditor.mTabbox = tab;
    var closed = cmdCloseTab.doCommand();
    if (1 == closed)
      return false;
  }
  return true;
}

function doQuit()
{
  return doSaveTabsBeforeQuit();
}

function OpenPreferences()
{
  var features = "chrome,titlebar,toolbar,centerscreen,dialog=yes";
  window.openDialog("chrome://bluegriffon/content/prefs/prefs.xul", "Preferences", features);
}

function UpdateSidebarsMenuStatus()
{
  gDialog.leftSidebarMenuitem.setAttribute("checked",  (gDialog.splitter1.getAttribute("state") != "collapsed"));
  gDialog.rightSidebarMenuitem.setAttribute("checked", (gDialog.splitter2.getAttribute("state") != "collapsed"));
}

function ToggleSidebarCollapsing(aElt, aId)
{
  var checked = aElt.getAttribute("checked");
  if (checked == "true")
    gDialog[aId].removeAttribute("state");
  else
    gDialog[aId].setAttribute("state", "collapsed");
}

var JSEditor = {

  deleteSelection: function(aEvent) {
    if (!aEvent.isChar || aEvent.which != 97)
      return;
    aEvent.preventDefault();

    var doc = EditorUtils.getCurrentDocument();
    var selection = EditorUtils.getCurrentEditor().selection;
    if (selection.isCollapsed) // early way out if we can
      return;

    var nodes = [];
    for (var count = 0; count < selection.rangeCount; count++) {
      var range = selection.getRangeAt(count);
      var startContainer = range.startContainer;
      var endContainer   = range.endContainer;
      var startOffset    = range.startOffset;
      var endOffset      = range.endOffset;
      var node;
      if (startContainer.nodeType == Node.TEXT_NODE)
        node = startContainer;
      else
        node = startContainer.childNodes.item(startOffset);

      var endNode;
      if (endContainer.nodeType == Node.TEXT_NODE)
        endNode = endContainer;
      else
        endNode = endContainer.childNodes.item(endOffset);

      selection.collapseToStart();
      var nextOrUp = false;
      do {
        var dir = "";
        if (nextOrUp) {
          if (node.nextSibling) {
            node = node.nextSibling;
            dir = "next";
            nextOrUp = false;
          }
          else {
            node = node.parentNode;
            dir = "up";
          }
        }
        else if (node.firstChild) {
          node = node.firstChild;
          dir = "down";
        }
        else if (node.nextSibling) {
          node = node.nextSibling;
          dir = "next";
        }
        else
          nextOrUp = true;
        nodes.push({node: node, dir: dir});
      }
      while (node && node != endNode);

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (i && n.dir == "next" && n.node.nodeType == Node.ELEMENT_NODE) {
          var previousNode = this.getPreviousVisibleNode(n.node);
          if (previousNode &&
              previousNode.nodeType == Node.ELEMENT_NODE &&
              previousNode.nodeName.toLowerCase() == n.node.nodeName.toLowerCase()) {
            var mergeable = false;
            switch (n.node.nodeName.toLowerCase()) {
              case "dl":
              case "ul":
              case "ol":
              case "p":
              case "h1":
              case "h2":
              case "h3":
              case "h4":
              case "h5":
              case "h6":
                mergeable = true;
                break;
              default: break;
            }
            if (mergeable) {
              while (n.node.firstChild)
                previousNode.appendChild(n.node.firstChild);
              n.node.parentNode.removeChild(n.node);
            }
          }
        }
      }

      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i].node;
        if (node.firstChild || !node.parentNode)
          continue;

        if (node == range.startContainer &&
            range.startOffset) {
          var t = doc.createTextNode(node.data.substr(0, range.startOffset));
          node.parentNode.insertBefore(t, node);
        }
        if (node == endContainer &&
                 endOffset != node.data.length) {
          var t = doc.createTextNode(node.data.substr(range.endOffset));
          node.parentNode.insertBefore(t, node.nextSibling);
        }

        var parent = node.parentNode;
        if (parent) {
          parent.removeChild(node);
          while (!parent.firstChild) {
            var tmp = parent.parentNode;
            tmp.removeChild(parent);
            parent = tmp;
          }
        }
      }
    }
  },

  getPreviousVisibleNode: function (aNode) {
    var node = aNode.previousSibling;
    var retNode = null;
    while (!retNode && node) {
      if (node.nodeType != Node.TEXT_NODE ||
          node.data.match ( /\S/g ))
        retNode = node;
      else
        node = node.previousSibling;
    }
    return retNode;
  }
};

function OnDoubleClick(aEvent)
{
  var node = aEvent.target;
  while (node && node.nodeType != Node.ELEMENT_NODE)
    node = node.parentNode;
  //EditorUtils.getCurrentEditor().selectElement(node);
  if (!node) // sanity check
    return;

  switch (node.nodeName.toLowerCase()) {
    case "a":
      if (node.hasAttribute("href"))
        cmdInsertLinkCommand.doCommand();
      if (node.hasAttribute("name") || node.id)
        cmdInsertAnchorCommand.doCommand();
      break;
    case "img":
      cmdInsertImageCommand.doCommand();
      break;
    case "video":
      cmdInsertVideoCommand.doCommand();
      break;
    case "audio":
      cmdInsertAudioCommand.doCommand();
      break;
    case "hr":
      cmdInsertHRCommand.doCommand();
      break;
    case "form":
      cmdInsertFormCommand.doCommand();
      break;
    case "input":
      window.openDialog("chrome://bluegriffon/content/dialogs/insertFormInput.xul","_blank",
                        "chrome,modal,titlebar,resizable=no,dialog=yes", node, node.getAttribute("type"));
      break;
   case "fieldset":
      cmdInsertFieldsetCommand.doCommand();
      break;
   case "label":
      cmdInsertLabelCommand.doCommand();
      break;
    case "button":
      cmdInsertButtonCommand.doCommand();
      break;
    case "select":
    case "option":
    case "optgroup":
      cmdInsertSelectCommand.doCommand();
      break;
    case "textarea":
      cmdInsertTextareaCommand.doCommand();
      break;
    case "keygen":
      cmdInsertKeygenCommand.doCommand();
      break;
    case "output":
      cmdInsertOutputCommand.doCommand();
      break;
    case "progress":
      cmdInsertProgressCommand.doCommand();
      break;
    case "meter":
      cmdInsertMeterCommand.doCommand();
      break;
    case "datalist":
      cmdInsertDatalistCommand.doCommand();
      break;
    case "td":
    case "th":
      // fire the table properties dialog only if the selection is collapsed
      if (EditorUtils.getCurrentEditor().selection.isCollapsed)
        OpenAppModalWindow(window, "chrome://bluegriffon/content/dialogs/insertTable.xul", "Tables", false, node); 
      break;
    case "li":
    case "ul":
    case "ol":
      cmdEditListCommand.doCommand();
      break;
    default:
      if (node.namespaceURI == "http://www.w3.org/2000/svg")
      {
        while (node.parentNode && node.parentNode.namespaceURI == "http://www.w3.org/2000/svg")
          node = node.parentNode;
        EditorUtils.getCurrentEditor().selectElement(node);
        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(node);
        source = '<?xml version="1.0"?>\n' + source;
        try {
          start_svg_edit(source);
        }
        catch(e) {}
      }
    
  }
}

#include findbar.inc

#include autoInsertTable.inc


function AlignAllPanels()
{
  ScreenUtils.alignPanelsForWindow(window);
  return;
}

function UpdatePanelsStatusInMenu()
{
#ifdef XP_UNIX
#ifndef XP_MACOSX
  return;
#endif
#endif
  var child = gDialog.beforeAllPanelsMenuseparator.nextSibling;
  while (child) {
    var panel = gDialog[child.getAttribute("panel")];
    if (panel.popupBoxObject.popupState == "open")
      child.setAttribute("checked", "true");
    else
      child.removeAttribute("checked");

    child = child.nextSibling;
  }
}

function TogglePanel(aEvent)
{
#ifdef XP_UNIX
#ifndef XP_MACOSX
  start_css();
  return;
#endif
#endif
  var menuitem = aEvent.originalTarget;
  if (!menuitem.hasAttribute("panel"))
    return;

  var panel = gDialog[aEvent.originalTarget.getAttribute("panel")];
  if (menuitem.getAttribute("checked") == "true") {
    panel.openPanel(null, false);
    NotifierUtils.notify("redrawPanel", panel.id);
  }
  else {
    NotifierUtils.notify("panelClosed", panel.id);
    panel.closePanel();
  }
}


function OnClick(aEvent)
{
  // this is necessary to be able to select for instance video elements
  var target = aEvent.explicitOriginalTarget;
  if (target && (target instanceof Components.interfaces.nsIDOMHTMLVideoElement ||
                 target instanceof Components.interfaces.nsIDOMHTMLAudioElement)) {
    EditorUtils.getCurrentEditor().selectElement(target);
  }
}

// LINUX ONLY :-(
function start_css()
{
  var w = null;
  try {
    w = Services.wm.getMostRecentWindow("BlueGriffon:CSSProperties");
  }
  catch(e){}
  if (w)
    w.focus();
  else
    window.open('chrome://cssproperties/content/cssproperties.xul',"_blank",
               "chrome,resizable,scrollbars=yes");
}

function UpdateTabHTMLDialect(editor)
{
  var doctype = editor.document.doctype;
  var systemId = doctype ? doctype.systemId : null;
  var tab = gDialog.tabeditor.selectedTab;
  switch (systemId) {
    case "http://www.w3.org/TR/html4/strict.dtd": // HTML 4
    case "http://www.w3.org/TR/html4/loose.dtd":
    case null:
      tab.setAttribute("tooltiptext", "HTML 4");
      break;
    case "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd": // XHTML 1
    case "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd":
      tab.setAttribute("tooltiptext", "XHTML 1");
      break;
    case "":
      tab.setAttribute("tooltiptext",
         (editor.document.documentElement.getAttribute("xmlns") == "http://www.w3.org/1999/xhtml") ?
           "XHTML 5" : "HTML 5");
      break;
    default: break; // should never happen...
  }
}

function OpenAddonsSite()
{
  loadExternalURL("http://bluegriffon.com/");
}

function initFontStyleMenu(menuPopup)
{
  for (var i = 0; i < menuPopup.childNodes.length; i++)
  {
    var menuItem = menuPopup.childNodes[i];
    var theStyle = menuItem.getAttribute("state");
    if (theStyle)
    {
      menuItem.setAttribute("checked", theStyle);
    }
  }
}

function ToggleAllTagsMode()
{
  var tab = gDialog.tabeditor.selectedTab;
  if (tab) {
    var editor = EditorUtils.getCurrentEditor();
    editor instanceof Components.interfaces.nsIEditorStyleSheets;
    if (tab.hasAttribute("alltags")) {
      tab.removeAttribute("alltags");
      editor.enableStyleSheet("chrome://bluegriffon/content/EditorAllTags.css", false);
    }
    else {
      tab.setAttribute("alltags", "true");
      editor.enableStyleSheet("chrome://bluegriffon/content/EditorAllTags.css", true);
    }
  }
}

function UpdateViewMenu()
{
  var tab = gDialog.tabeditor.selectedTab;
  if (tab) {
    if (tab.hasAttribute("alltags")) {
      gDialog.allTagsModeMenuitem.setAttribute("checked", "true");
      return;
    }
  }
  gDialog.allTagsModeMenuitem.removeAttribute("checked");
}

/*********** CONTEXT MENU ***********/

function GetParentTable(element)
{
  var node = element;
  while (node)
  {
    if (node.nodeName.toLowerCase() == "table")
      return node;

    node = node.parentNode;
  }
  return node;
}

function UpdateEditorContextMenu(event, aMenupopup)
{
  if (event.explicitOriginalTarget.id == "editorContextMenu") {
    var sc = EditorUtils.getCurrentEditorElement().getUserData("spellchecker");
    sc.initFromEvent(document.popupRangeParent, document.popupRangeOffset);

    gDialog.spellCheckMenu.disabled = !sc.overMisspelling;

    // the following is finally not desirable ; commented out for the time being
    /*try {
      EditorUtils.getCurrentEditor().selectElement(document.popupNode);
    }
    catch(e) {}*/

    var element = GetParentTable(document.popupNode);
    var idstart = "separator_before_ctableInsertMenu";
    var idend   = "cmenu_tableProperties";
    var elt = gDialog[idstart];
    var currentId;
    do {
      if (element)
        elt.removeAttribute("hidden");
      else
        elt.setAttribute("hidden", "true");
      currentId = elt.id;
      elt = elt.nextElementSibling;
    } while (currentId != idend);
  }
}

function UpdateSpellCheckMenu(aMenupopup)
{
  var sc = EditorUtils.getCurrentEditorElement().getUserData("spellchecker");

  var suggestions = 10;
  try {
    var prefs = GetPrefs();
    suggestions = prefs.getIntPref("bluegriffon.spellCheck.suggestions");
  }
  catch(e) {}

  sc.addSuggestionsToMenu(aMenupopup, gDialog.suggestionsSpellCheckSeparator, suggestions);
}

function CleanSpellCheckMenu()
{
  var sc = EditorUtils.getCurrentEditorElement().getUserData("spellchecker");
  sc.clearSuggestionsFromMenu();
}

function AddWordToDictionary()
{
  var sc = EditorUtils.getCurrentEditorElement().getUserData("spellchecker");
  sc.addToDictionary();
}

function UpdateSpellCheckDictionaries(aMenupopup)
{
  var sc = EditorUtils.getCurrentEditorElement().getUserData("spellchecker");
  sc.addDictionaryListToMenu(aMenupopup, null);
}

function CleanSpellCheckDictionaries()
{
  var sc = EditorUtils.getCurrentEditorElement().getUserData("spellchecker");
  sc.clearDictionaryListFromMenu();
}

function IgnoreWord()
{
  var sc = EditorUtils.getCurrentEditorElement().getUserData("spellchecker");
  sc.ignoreWord();
}

#ifndef XP_MACOSX
function OpenCharInsertionDialog()
{
  var w = null;
  try {
    w = Services.wm.getMostRecentWindow("BlueGriffon:insertCharsDlg");
  }
  catch(e){}
  if (w)
    w.focus();
  else
   window.openDialog("chrome://bluegriffon/content/dialogs/insertChars.xul","_blank",
                     "chrome,modal=no,titlebar");
}
#endif


var gDummySelectionStartNode = null;
var gDummySelectionEndNode = null;
var gDummySelectionStartData = "";
var gDummySelectionEndData = "";

function MarkSelection()
{
  gDummySelectionStartNode = null;
  gDummySelectionEndNode = null;
  gDummySelectionStartData = "";
  gDummySelectionEndData = "";
  
  const kBGBGBG = "--BG--";

  var selection = EditorUtils.getCurrentEditor().selection;
  for (var count = 0; count < 1; count++) {
    var range = selection.getRangeAt(count);
    var startContainer = range.startContainer;
    var endContainer   = range.endContainer;
    var startOffset    = range.startOffset;
    var endOffset      = range.endOffset;

    if (startContainer.nodeType == Node.TEXT_NODE) {
      var data = startContainer.data;
      gDummySelectionStartNode = startContainer;
      gDummySelectionStartData = data;
      data = data.substr(0, startOffset) + kBGBGBG + data.substr(startOffset);
      startContainer.data = data;
    }
    else if (startContainer.nodeType == Node.ELEMENT_NODE) {
      if (startOffset < startContainer.childNodes.length) {
        var node = startContainer.childNodes.item(startOffset);
        if (node.nodeType == Node.TEXT_NODE) {
          var data = node.data;
          gDummySelectionStartNode = node;
          gDummySelectionStartData = data;
          data = kBGBGBG + data;
          node.data = data;
        }
        else {
          var t = EditorUtils.getCurrentDocument().createTextNode(kBGBGBG);
          gDummySelectionStartNode = t;
          startContainer.insertBefore(t, node);
        }
      }
      else {
        var t = EditorUtils.getCurrentDocument().createTextNode(kBGBGBG);
        gDummySelectionStartNode = t;
        startContainer.appendChild(t);
      }
    }

    if (endContainer.nodeType == Node.TEXT_NODE) {
      // same node as start node???
      if (endContainer == startContainer) {
        var data = endContainer.data;
        gDummySelectionEndNode = endContainer;
        gDummySelectionEndData = data;
        data = data.substr(0, endOffset + kBGBGBG.length) + kBGBGBG + data.substr(endOffset + kBGBGBG.length);
        endContainer.data = data;
      }
      else {
        var data = endContainer.data;
        gDummySelectionEndNode = endContainer;
        gDummySelectionEndData = data;
        data = data.substr(0, endOffset) + kBGBGBG + data.substr(endOffset);
        endContainer.data = data;
      }
    }
    else if (endContainer.nodeType == Node.ELEMENT_NODE) {
      var node = endContainer.childNodes.item(Math.max(0, endOffset - 1));
      if (node.nodeType == Node.TEXT_NODE) {
        var data = node.data;
        gDummySelectionEndNode = node;
        gDummySelectionEndData = data;
        data += kBGBGBG;
        node.data = data;
      }
      else {
        var t = EditorUtils.getCurrentDocument().createTextNode(kBGBGBG);
        gDummySelectionEndNode = t;
        endContainer.insertBefore(t, node.nextSibling);
      }
    }
  }
}

function UnmarkSelection()
{
  if (gDummySelectionEndNode) {
    if (gDummySelectionEndData)
      gDummySelectionEndNode.data = gDummySelectionEndData;
    else
      gDummySelectionEndNode.parentNode.removeChild(gDummySelectionEndNode);
  }

  if (gDummySelectionStartNode) {
    if (gDummySelectionStartData)
      gDummySelectionStartNode.data = gDummySelectionStartData;
    else if (gDummySelectionStartNode.parentNode) // if not already removed....
      gDummySelectionStartNode.parentNode.removeChild(gDummySelectionStartNode);
  }
}

function MarkSelectionInAce(aAceEditor)
{
  const kBGBGBG = "--BG--";

  var selection = aAceEditor.getSession().getSelection();
  selection.setSelectionRange({ start: { row: 0, column: 0 },
                                end:   { row: 0, column: 0 } });

  var range = aAceEditor.find(kBGBGBG, { backwards: false,
                                         wrap: true,
                                         caseSensitive: true,
                                         wholeWord: false,
                                         regExp: false
                              });
  var startRow    = range.start.row;
  var startColumn = range.start.column;
  selection.setSelectionRange({ start: { row: 0, column: 0 },
                                end:   { row: 0, column: 0 } });
  aAceEditor.replace("");

  var range = aAceEditor.find(kBGBGBG, { backwards: false,
                                         wrap: true,
                                         caseSensitive: true,
                                         wholeWord: false,
                                         regExp: false
                              });
  var endRow      = range.start.row;
  var endColumn   = range.start.column;
  aAceEditor.replace("");

  aAceEditor.gotoLine(startRow);
  //bespinEditor.getSession().setValue(source.replace(/\-\-BG\-\-/g, ""));
  selection.setSelectionRange({ start: { row: startRow, column: startColumn },
                                end:   { row: endRow,   column: endColumn } });
  aAceEditor.reset();
}

function FillAceThemesMenupopup()
{
  deleteAllChildren(gDialog.themesMenupopup);
  var aceIframe = EditorUtils.getCurrentSourceEditorElement();
  var currentTheme = aceIframe.contentWindow.getCurrentTheme();
  for (var i = 0; i < kTHEMES.length; i++) {
    var s = document.createElement("menuitem");
    s.setAttribute("label", kTHEMES[i]);
    s.setAttribute("value", kTHEMES[i]);
    s.setAttribute("type", "checkbox");
    if (kTHEMES[i] == currentTheme)
      s.setAttribute("checked", "true");
    gDialog.themesMenupopup.appendChild(s);
  }
}

function UseAceTheme(aEvent)
{
  var theme = aEvent.originalTarget.getAttribute("value");
  var aceIframe = EditorUtils.getCurrentSourceEditorElement();
  aceIframe.contentWindow.useTheme(theme);
}

#ifdef XP_MACOSX
function UpdateBadge()
{
  var windowEnumerator = Services.wm.getEnumerator("bluegriffon");
  var n = 0;
  while (windowEnumerator.hasMoreElements()) {
    var w = windowEnumerator.getNext();
    n += w.gDialog.tabeditor.getNumberOfModifiedDocuments();
  }
  var baseWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                         .getInterface(Components.interfaces.nsIWebNavigation)
                         .QueryInterface(Components.interfaces.nsIBaseWindow);
  var badger = Components.classes["@disruptive-innovations.com/macintegration/osxdockbadger;1"]
                         .createInstance(Components.interfaces.diIOSXDockIconBadger);
  if (n)
    badger.setIconValue(n);
  else
    badger.restoreIcon();
}

function ResetBadge()
{
  var baseWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                         .getInterface(Components.interfaces.nsIWebNavigation)
                         .QueryInterface(Components.interfaces.nsIBaseWindow);
  var badger = Components.classes["@disruptive-innovations.com/macintegration/osxdockbadger;1"]
                         .createInstance(Components.interfaces.diIOSXDockIconBadger);
  badger.restoreIcon();
}
#endif

function SaveCurrentTabLocation()
{
  try {
    if (!GetPrefs().getBoolPref("bluegriffon.defaults.restorePreviousSession"))
      return;
  }
  catch(e) {}

  var URL = EditorUtils.getDocumentUrl();
  var lastTabs = "";
  try {
    lastTabs = GetPrefs().getCharPref("bluegriffon.defaults.lastTabs");
  }
  catch(e) {}
  lastTabs += (lastTabs ? "|" : "") + URL;
  try {
    GetPrefs().setCharPref("bluegriffon.defaults.lastTabs", lastTabs);
  }
  catch(e) {}
}

function SaveTabs()
{
  try {
    GetPrefs().setCharPref("bluegriffon.defaults.lastTabs", "");
  }
  catch(e) {}
}

function CreateOrUpdateTableOfContents()
{
  window.openDialog("chrome://bluegriffon/content/dialogs/insertTOC.xul","_blank",
                    "chrome,modal,titlebar");
}
