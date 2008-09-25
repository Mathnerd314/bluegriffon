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
 * The Original Code is Diavolo.
 *
 * The Initial Developer of the Original Code is
 * Disruptive Innovations SARL.
 * Portions created by the Initial Developer are Copyright (C) 2006-2008
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

function DiavoloCodeCompletionEngine(aEditorCore)
{
  this.init(aEditorCore);
}

DiavoloCodeCompletionEngine.prototype = {

  kIOServiceCID      : "@mozilla.org/network/io-service;1",
  kFileInputStreamCID: "@mozilla.org/network/file-input-stream;1",
  kScriptableInputCID: "@mozilla.org/scriptableinputstream;1",
  kUnicodeConverterCID: "@mozilla.org/intl/scriptableunicodeconverter",

  nsIIOService            : Components.interfaces.nsIIOService,
  nsIFileInputStream      : Components.interfaces.nsIFileInputStream,
  nsIScriptableInputStream: Components.interfaces.nsIScriptableInputStream,
  nsIScriptableUnicodeConverter: Components.interfaces.nsIScriptableUnicodeConverter,

  mCodeCompletionGrammar: null,

  mEditorCore: null,
  mDocument: null,

  mLastPopupNode: null,

  convertToUnicode: function(aCharset, aSrc )
  {
    // http://lxr.mozilla.org/mozilla/source/intl/uconv/idl/nsIScriptableUConv.idl
    var unicodeConverter = Components.classes[this.kUnicodeConverterCID]
                             .createInstance(this.nsIScriptableUnicodeConverter);
    unicodeConverter.charset = aCharset;
    return unicodeConverter.ConvertToUnicode( aSrc );
  },

  init: function init(aEditorCore)
  {
    this.mEditorCore = aEditorCore;
    this.mDocument = aEditorCore.document;

    // Get the grammar file
    var urlspec="chrome://diavolo/content/cssCompletion.xml";
    var ioService = Components.classes[this.kIOServiceCID]
                      .getService(this.nsIIOService);

    // Get the baseURI
    var url = ioService.newURI(urlspec, null, null);

    var chann = ioService.newChannelFromURI(url);
    var inputStream = Components.classes[this.kFileInputStreamCID]
                        .createInstance(this.nsIFileInputStream);
    var sis = Components.classes[this.kScriptableInputCID]
                .createInstance(this.nsIScriptableInputStream);

    sis.init(chann.open());
    var str = sis.read(sis.available());
    sis.close();
    str = this.convertToUnicode("UTF-8",str);
    var parser = new DOMParser();
    this.mCodeCompletionGrammar = parser.parseFromString(str, "text/xml");
    
    this.mDocument.addEventListener("keyup",
       function(){ var scope = this; return function(event) { scope.interceptKeyUp(event)} }.apply(this),
       true);
    this.mDocument.addEventListener("keypress",
       function(){ var scope = this; return function(event) { scope.interceptKeyPress(event)} }.apply(this),
       true);

    var selection;
    try {
        selection = this.mEditorCore.selection;
        if (!selection) return null;
    }
    catch (e) { return null; }

    selection.QueryInterface(Components.interfaces.nsISelectionPrivate);
    selection.addSelectionListener(this);
  },

  shutdown: function shutdown()
  {
    this.mDocument.removeEventListener("keyup",
       function(){ var scope = this; return function(event) { scope.interceptKeyUp(event)} }.apply(this),
       true);
    this.mDocument.removeEventListener("keypress",
       function(){ var scope = this; return function(event) { scope.interceptKeyPress(event)} }.apply(this),
       true);
    var selection;
    try {
        selection = this.mEditorCore.selection;
        if (!selection) return null;
    }
    catch (e) { return null; }

    selection.QueryInterface(Components.interfaces.nsISelectionPrivate);
    selection.removeSelectionListener(this);  },

  interceptKeyPress: function interceptKeyPress(aEvent)
  {
    var keyCode  = aEvent.keyCode;
    var charCode = aEvent.charCode;
    var altKey   = aEvent.altKey;
    var ctrlKey  = aEvent.ctrlKey;
    var metaKey  = aEvent.metaKey;
    var shiftKey = aEvent.shiftKey;
    var selection = this.mEditorCore.selection;
    
    var node = selection.anchorNode;
    if (node && node.nodeType == Node.TEXT_NODE)
    {
      var value = node.data;

      var p = node.parentNode.wrappedJSObject;
      var type = p.className;
      var completion = this.mCodeCompletionGrammar.getElementById(type);

      if (!completion)
      {
        if (this.mLastPopupNode && this.mLastPopupNode.hidePopup)
          this.mLastPopupNode.hidePopup();
        this.mLastPopupNode = null;
        return;
      }

      var choices = p.mChoices;
      var selectedIndex = choices.selectedIndex;
      var choicesLength = choices.length;
      var preventDefault = false;

      switch (keyCode)
      {
        case KeyEvent.DOM_VK_UP:
          if (!p.isVisible)
            return;
          if (selectedIndex)
            choices.selectedIndex = selectedIndex - 1;
          preventDefault = true;
          break;
        case KeyEvent.DOM_VK_DOWN:
          if (!p.isVisible)
            return;
          if (selectedIndex < choicesLength - 1)
            choices.selectedIndex = selectedIndex + 1;
          preventDefault = true;
          break;
        case KeyEvent.DOM_VK_PAGE_UP:
          if (!p.isVisible)
            return;
          choices.selectedIndex = Math.max(selectedIndex - 4, 0);
          preventDefault = true;
          break;
        case KeyEvent.DOM_VK_PAGE_DOWN:
          if (!p.isVisible)
            return;
          choices.selectedIndex = Math.min(selectedIndex + 4, choicesLength - 1);
          preventDefault = true;
          break;
        case KeyEvent.DOM_VK_ESCAPE:
          if (!p.isVisible)
            return;
          p.hidePopup();
          this.mLastPopupNode = null;
          preventDefault = true;
          break;

        case KeyEvent.DOM_VK_TAB:
          if (!p.isVisible || selectedIndex == -1)
            return;
          this.mEditorCore.beginTransaction();
          this.mEditorCore.deleteNode(node);
          this.mEditorCore instanceof Components.interfaces.nsIPlaintextEditor;
          this.mEditorCore.insertText(choices.value);
          this.mEditorCore.endTransaction();
          p.hidePopup();
          preventDefault = true;
          break;
        default:
          break;
      }
      if (preventDefault)
        aEvent.preventDefault();
    }
  },

  interceptKeyUp: function interceptKeyPress(aEvent)
  {
    var keyCode  = aEvent.keyCode;
    var charCode = aEvent.charCode;
    var altKey   = aEvent.altKey;
    var ctrlKey  = aEvent.ctrlKey;
    var metaKey  = aEvent.metaKey;
    var shiftKey = aEvent.shiftKey;
    var selection = this.mEditorCore.selection;

    switch (keyCode)
    {
      case KeyEvent.DOM_VK_UP:
      case KeyEvent.DOM_VK_DOWN:
      case KeyEvent.DOM_VK_LEFT:
      case KeyEvent.DOM_VK_RIGHT:
      case KeyEvent.DOM_VK_PAGE_UP:
      case KeyEvent.DOM_VK_PAGE_DOWN:
      case KeyEvent.DOM_VK_HOME:
      case KeyEvent.DOM_VK_END:
      case KeyEvent.DOM_VK_ESCAPE:
      case KeyEvent.DOM_VK_TAB:
        break;

      default:
        var node = selection.anchorNode;
        var forcePopup = (keyCode == 32 &&
                          ctrlKey && !shiftKey && !altKey && !metaKey);
        if (node && node.nodeType == Node.TEXT_NODE)
          this.showCompletionPopup(node, selection, forcePopup)
        break;
    }
  },

  showCompletionPopup: function showCompletionPopup(node, selection, forcePopup)
  {
    var p = node.parentNode.wrappedJSObject;
    var choices = p.mChoices;
    var value = node.data;

    if (this.mLastPopupNode == p)
    {
      var options = choices.options;
      var length = value.length;
      var foundMatch = -1;
      for (var i = 0 ; i < options.length; i++)
      {
        var text = options.item(i).text;
        if (text == value) 
        {
          p.hidePopup();
          this.mLastPopupNode = null;
          return;
        }
        else if (value < text && foundMatch == -1) 
        {
          // select the closest suggestion
          foundMatch = i;
        }
      }
      if (foundMatch != -1)
        choices.selectedIndex = foundMatch;

      return;
    }

    var selectedIndex = choices.selectedIndex;
    var choicesLength = choices.length;

    var type = p.className;
    var completion = this.mCodeCompletionGrammar.getElementById(type);

    if (!completion)
    {
      if (this.mLastPopupNode && this.mLastPopupNode.hidePopup)
        this.mLastPopupNode.hidePopup();
      this.mLastPopupNode = null;
      return;
    }

    var suggestionsArray = [];

    var contexts = completion.getElementsByTagName("context");
    if (contexts && contexts.length) 
    {
      var c = contexts.item(0);

      var always = completion.getElementsByTagName("always");
      if (always && always.length)
      {
        if (this.pushSuggestions(always[0], suggestionsArray, value) && !forcePopup)
          return;
      }

      var name = c.getAttribute("name");
      var n = p.previousSibling;
      while (n && n.getAttribute("class") != name) 
        n = n.previousSibling;
      if (n) 
      {
        var origin = n.textContent;
        var groups = completion.getElementsByTagName("suggestiongroup");
        var suggestionGroupFound = false;
        for (var i = 0; i < groups.length; i++)
        {
          var g = groups[i];
          if (g.getAttribute("forcontext") == origin)
          {
            // match !!!
            completion = g;
            suggestionGroupFound = true;
            break;
          }
        }
        if (!suggestionGroupFound)
          completion = null;
      }
    }

    if (completion)
    {
      var suggestions = completion.getElementsByTagName("suggestion");
      if (this.pushSuggestions(completion, suggestionsArray, value) && !forcePopup)
        return;
    }
    else if (!suggestionsArray.length)
      return;

    suggestionsArray.sort();
    var suggestionFound = false;
    for (var i = 0; i < suggestionsArray.length; i++)
    {
      p.addChoice(suggestionsArray[i], p.mChoices);
    	if (!suggestionFound && value < suggestionsArray[i])
    	{
    		choices.selectedIndex = i;
    		suggestionFound = true;
    	}
    }

    p.showPopup(this.completeToken, this);

    this.mLastPopupNode = p;
  },


  completeToken: function completeToken(aElt, aValue, aScope)
  {
    aScope.mEditorCore.beginTransaction();
    aScope.mEditorCore.deleteNode(aElt);
    aScope.mEditorCore instanceof Components.interfaces.nsIPlaintextEditor;
    aScope.mEditorCore.insertText(aValue);
    aScope.mEditorCore.endTransaction();
  },

  notifySelectionChanged: function notifySelectionChanged(aDocument, aSelection, aReason)
  {
    if (aSelection.isCollapsed) 
    {
      var node = aSelection.anchorNode;
      if (node.nodeType == Node.TEXT_NODE &&
          node.parentNode.nodeName.toLowerCase() == "span")
      {
        var p = node.parentNode;
        if (this.mLastPopupNode && this.mLastPopupNode != p)
        {
          if (this.mLastPopupNode.hidePopup)
            this.mLastPopupNode.hidePopup();
          this.mLastPopupNode = null;
        }
        //this.showCompletionPopup(node, aSelection);
      }

    }
  },

  pushSuggestions: function pushSuggestions(aElt, aSuggestionsArray, aValue)
  {
    var suggestions = aElt.getElementsByTagName("suggestion");
    for (var i = 0; i < suggestions.length; i++)
    {
      var item = suggestions.item(i).getAttribute("value");
      if (item == aValue)
        return true;
      aSuggestionsArray.push(item);
    }
    return false;
  }
};
