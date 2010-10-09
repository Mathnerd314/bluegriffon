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

Components.utils.import("resource://gre/modules/urlHelper.jsm");
Components.utils.import("resource://gre/modules/prompterHelper.jsm");
Components.utils.import("resource://gre/modules/editorHelper.jsm");
Components.utils.import("resource://gre/modules/cssHelper.jsm");
Components.utils.import("resource://gre/modules/fileHelper.jsm");
Components.utils.import("resource://gre/modules/l10nHelper.jsm");
Components.utils.import("resource://gre/modules/handlersManager.jsm");
try {
  Components.utils.import("resource://gre/modules/projectManager.jsm");
}
catch(e) {}

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

  if (aInTab)
    document.getElementById("tabeditor").addEditor(
         UrlUtils.stripUsernamePassword(aURL, null, null),
         aURL);
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
  } catch (e) { dump(" EditorLoadUrl failed: "+e+"\n"); }
}

function AboutComposer()
{
  var windowManager = Components.classes[this.kWINDOWMEDIATOR_CID].getService();
  var windowManagerInterface = windowManager.QueryInterface(Components.interfaces.nsIWindowMediator);
  var enumerator = windowManagerInterface.getEnumerator( "BlueGriffon:About" );
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
  } catch (e) { dump(e); }
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
  classMenuList.setAttribute("label", state);
}

function UpdateStructureBarContextMenu()
{
  var popupNode = document.popupNode;
  var target    = null;
  if (popupNode)
    target = popupNode.getUserData("node");

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
      var offset = 0;
      var parent = target.parentNode.wrappedJSObject;
      var childNodes = parent.childNodes;
      editor.beginTransaction();

      while (childNodes[offset] != target)
        ++offset;

      childNodes = target.childNodes;
      var childNodesLength = childNodes.length;
      for (var i = childNodesLength - 1; i >= 0; i--) {
        var clone = childNodes.item(i).cloneNode(true);
        editor.insertNode(clone, parent, offset + 1);
      }

      editor.deleteNode(target);

      editor.endTransaction();
    }
  }
}

function ChangeTag(aEvent)
{
  var popupNode = document.popupNode;
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
  return EditorUtils.getCurrentEditorElement().parentNode.getAttribute("previousMode") ||
         "wysiwyg";
}

function ToggleViewMode(aElement)
{
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
  if (mode == "source")
  {
    HandlersManager.hideAllHandlers();

    flags = 1 << 1; // OutputFormatted
    flags |= 1 << 5; // OutputWrap
    //flags |= 1 << 2; // OutputRaw
    flags |= 1 << 10; // OutputLF

    var mimeType = EditorUtils.getCurrentDocument().contentType;
    var encoder = Components.classes["@mozilla.org/layout/documentEncoder;1?type=" + mimeType]
                   .createInstance(Components.interfaces.nsIDocumentEncoder);
    encoder.setCharset("UTF-8");
    encoder.init(EditorUtils.getCurrentDocument(), mimeType, flags);

    NotifierUtils.notify("beforeEnteringSourceMode");
    var source = encoder.encodeToString();
    var bespinIframe = editorElement.previousSibling;
    var bespinEditor = bespinIframe.getUserData("editor");
    bespinEditor.value = "";
    bespinEditor.value = source;
    bespinIframe.setUserData("oldSource", source, null);
    NotifierUtils.notify("afterEnteringSourceMode");
    gDialog.bespinToolbox.hidden = false;
    editorElement.parentNode.selectedIndex = 0;
    bespinIframe.focus();
    bespinEditor.focus = true;
    bespinIframe.contentWindow.getEditableElement().className = "";
  }
  else if (mode == "wysiwyg")
  {
    gDialog.bespinToolbox.hidden = true;
    // Reduce the undo count so we don't use too much memory
    //   during multiple uses of source window 
    //   (reinserting entire doc caches all nodes)
    var bespinIframe = editorElement.previousSibling;
    var bespinEditor = bespinIframe.getUserData("editor");
    if (bespinEditor)
    {
      NotifierUtils.notify("beforeLeavingSourceMode");
      source = bespinEditor.value;
      var oldSource = bespinIframe.getUserData("oldSource"); 
      if (source != oldSource) {
        var doctype = EditorUtils.getCurrentDocument().doctype.publicId;
        var isXML = false;
        switch (doctype) {
          case "http://www.w3.org/TR/html4/strict.dtd": // HTML 4
          case "http://www.w3.org/TR/html4/loose.dtd":
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
            RebuildFromSource(doc);
          }
          catch(e) {}
        }
        else {
	        var hp = new htmlParser(gDialog.parserIframe);
	        hp.parseHTML(source,
	                     EditorUtils.getDocumentUrl(),
	                     function(aDoc, ctx) { RebuildFromSource(aDoc, ctx); },
	                     hp);
        }
      }
      else {
        NotifierUtils.notify("afterLeavingSourceMode");
        editorElement.parentNode.selectedIndex = 1;
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
  var destChild = destElt.lastChild;
  while (destChild) {
    editor.deleteNode(destChild);
    destChild = destElt.lastChild;
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
    // clone body
    CloneElementContents(editor, aDoc.querySelector("body"), editor.document.body);
    // clone head
    CloneElementContents(editor, aDoc.querySelector("head"), editor.document.querySelector("head"));
    editor.endTransaction();

    // update the window title
    UpdateWindowTitle();
  } catch(ex) {
    dump(ex);
  }
  NotifierUtils.notify("afterLeavingSourceMode");
  window.content.focus();
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
  }
  window.updateCommands("style");
  NotifierUtils.notify("tabClosed");
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
  var tabs      = tabeditor.mTabs.childNodes;
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
  if (EditorUtils.getCurrentEditorElement())
    ToggleViewMode(gDialog.wysiwygModeButton);
  if (doSaveTabsBeforeQuit())
    goQuitApplication();
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
  EditorUtils.getCurrentEditor().selectElement(node);
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
    case "td":
    case "th":
        OpenAppModalWindow(window, "chrome://bluegriffon/content/dialogs/insertTable.xul", "Tables", false, node); 
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

#include bespin.inc

#include autoInsertTable.inc


function AlignAllPanels()
{
  var x = window.screenX;
  var y = window.screenY;
  var w = window.outerWidth;
  var availableWidth = screen.availWidth - x - w;
  var h = window.outerHeight;
  var panelsData = [];
  var panels = document.querySelectorAll('panel[floating="true"]');
  for (var i = 0; i < panels.length; i++) {
    if (panels[i].popupBoxObject.popupState == "open") {
      panelsData.push( {
                         panel: panels[i],
                         x: panels[i].boxObject.screenX,
                         w: panels[i].boxObject.width
                       });
    }
  }

  function comparePanelsData(a, b) {
    if (a.x < b.x)
      return -1;
    if (a.x > b.x)
      return +1;
    return 0;
  }
  panelsData.sort(comparePanelsData);

  for (var i = 0; i < panelsData.length; i++) {
    if (i+1 >= panelsData.length)
      break;
    if (panelsData[i+1].x >= panelsData[i].x &&
        panelsData[i+1].x <= panelsData[i].x + panelsData[i].w)
      panelsData[i+1].x = panelsData[i].x;
  }

  var weightData = {};
  var flex = 0;
  for (var i = 0; i < panelsData.length; i++) {
    if (panelsData[i].x in weightData)
      weightData[panelsData[i].x]++;
    else {
      weightData[panelsData[i].x] = 1;
      flex++;
    }
    panelsData[i].vPos = weightData[panelsData[i].x] - 1;
  }

  var currentX = x + w + 1;
  var lastX = panelsData[0].x;
  for (var i = 0; i < panelsData.length; i++) {
    if (panelsData[i].x != lastX) {
      currentX += availableWidth / flex;
      lastX = panelsData[i].x;
    }
    panelsData[i].panel.moveTo(currentX + 10 , y + (h / weightData[panelsData[i].x]) * panelsData[i].vPos);
    panelsData[i].panel.sizeTo((availableWidth / flex) - 14 , h / weightData[panelsData[i].x] - 4);
  }
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
    var windowManager = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService();
    w = windowManager.QueryInterface(Components.interfaces.nsIWindowMediator).getMostRecentWindow("BlueGriffon:CSSProperties");
  }
  catch(e){}
  if (w)
    w.focus();
  else
    window.open('chrome://cssproperties/content/cssproperties.xul',"_blank",
               "chrome,resizable,scrollbars=yes");
}
