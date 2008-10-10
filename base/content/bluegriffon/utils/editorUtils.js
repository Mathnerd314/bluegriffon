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

var EditorUtils = {

  /********** PUBLIC **********/

  getCurrentTabEditor: function getCurrentTabEditor()
  {
    var tmpWindow = window;
    
    do {
      var tabeditor = tmpWindow.document.getElementById("tabeditor");
  
      if (tabeditor)
        return tabeditor ;
  
      tmpWindow = tmpWindow.opener;
    } 
    while (tmpWindow);
  
    return null;
  },
  
  getCurrentEditorElement: function getCurrentEditorElement()
  {
  	var tabeditor = this.getCurrentTabEditor();
    if (tabeditor)
      return tabeditor.getCurrentEditorElement() ;
    return null;
  },
  
  getCurrentEditor: function getCurrentEditor()
  {
    // Get the active editor from the <editor> tag
    var editor = null;
    try {
      var editorElement = this.getCurrentEditorElement();
      if (editorElement)
      {
        editor = editorElement.getEditor(editorElement.contentWindow);
    
        // Do QIs now so editor users won't have to figure out which interface to use
        // Using "instanceof" does the QI for us.
        editor instanceof Components.interfaces.nsIEditor;
        editor instanceof Components.interfaces.nsIPlaintextEditor;
        editor instanceof Components.interfaces.nsIHTMLEditor;
      }
    } catch (e) { dump("Error in GetCurrentEditor: " + e + "\n"); }
  
    return editor;
  },

  getCurrentDocument: function getCurrentDocument()
  {
    // Get the active editor from the <editor> tag
    var editor = this.getCurrentEditor();
    if (editor)
      return editor.document;
    return null;
  },
  
  getCurrentCommandManager: function getCurrentCommandManager()
  {
    try {
      return this.getCurrentEditorElement().commandManager;
    } catch (e) { dump (e)+"\n"; }

    return null;
  },
  
  newCommandParams: function newCommandParams()
  {
    try {
      const contractId = "@mozilla.org/embedcomp/command-params;1";
      const nsICommandParams = Components.interfaces.nsICommandParams;

      return Components.classes[contractId].createInstance(nsICommandParams);
    }
    catch(e) { dump("error thrown in newCommandParams: "+e+"\n"); }
    return null;
  },

  getCurrentEditingSession: function getCurrentEditingSession()
  {
    try {
      return this.getCurrentEditorElement().editingSession;
    } catch (e) { dump (e)+"\n"; }

    return null;
  },

  getCurrentEditorType: function getCurrentEditorType()
  {
    try {
      return this.getCurrentEditorElement().editortype;
    } catch (e) { dump (e)+"\n"; }

    return "";
  },

  isAlreadyEdited: function isAlreadyEdited(aURL)
  {
    // blank documents are never "already edited"...
    if (UrlUtils.isUrlAboutBlank(aURL))
      return null;
  
    var url = UrlUtils.newURI(aURL).spec;
  
    var windowManager = Components.classes[kWINDOWMEDIATOR_CID].getService();
    var windowManagerInterface = windowManager.QueryInterface(nsIWindowMediator);
    var enumerator = windowManagerInterface.getEnumerator( "bluegriffon" );
    while ( enumerator.hasMoreElements() )
    {
      var win = enumerator.getNext().QueryInterface(nsIDOMWindowInternal);
      try {
        var mixed = win.gDialog.tabeditor.isAlreadyEdited(url);
        if (mixed)
          return {window: win, editor: mixed.editor, index: mixed.index};
      }
      catch(e) {}
    }
    return null;
  },

  isDocumentEditable: function isDocumentEditable()
  {
    try {
      return this.getCurrentEditor().isDocumentEditable;
    } catch (e) { dump (e)+"\n"; }
    return false;
  },

  isDocumentModified: function isDocumentModified()
  {
    try {
      return this.getCurrentEditor().documentModified;
    } catch (e) { dump (e)+"\n"; }
    return false;
  },

  isDocumentEmpty: function isDocumentEmpty()
  {
    try {
      return this.getCurrentEditor().documentIsEmpty;
    } catch (e) { dump (e)+"\n"; }
    return false;
  },

  getDocumentTitle: function getDocumentTitle()
  {
    try {
      return this.getCurrentDocument().title;
    } catch (e) { dump (e)+"\n"; }

    return "";
  },

  isHTMLEditor: function isHTMLEditor()
  {
    // We don't have an editorElement, just return false
    if (!this.getCurrentEditorElement())
      return false;

    var editortype = this.getCurrentEditorType();
    switch (editortype)
    {
        case "html":
        case "htmlmail":
          return true;

        case "text":
        case "textmail":
          return false

        default:
          dump("INVALID EDITOR TYPE: " + editortype + "\n");
          break;
    }
    return false;
  },

  isEditingRenderedHTML: function isEditingRenderedHTML()
  {
    return this.isHTMLEditor(); // && !this.isInHTMLSourceMode();
  },

  setDocumentTitle: function setDocumentTitle(title)
  {
    try {
      this.getCurrentEditor().setDocumentTitle(title);

      // Update window title (doesn't work if called from a dialog)
      if ("UpdateWindowTitle" in window)
        window.UpdateWindowTitle();
      else if ("UpdateWindowTitle" in window.opener)
        window.opener.UpdateWindowTitle();
    } catch (e) { dump (e)+"\n"; }
  },

  getSelectionContainer: function getSelectionContainer()
  {
    var editor = this.getCurrentEditor();
    if (!editor) return null;

    try {
      var selection = editor.selection;
      if (!selection) return null;
    }
    catch (e) { return null; }

    var result = { oneElementSelected:false };

    if (selection.isCollapsed) {
      result.node = selection.focusNode;
    }
    else {
      var rangeCount = selection.rangeCount;
      if (rangeCount == 1) {
        result.node = editor.getSelectedElement("");
        var range = selection.getRangeAt(0);

        // check for a weird case : when we select a piece of text inside
        // a text node and apply an inline style to it, the selection starts
        // at the end of the text node preceding the style and ends after the
        // last char of the style. Assume the style element is selected for
        // user's pleasure
        if (!result.node &&
            range.startContainer.nodeType == Node.TEXT_NODE &&
            range.startOffset == range.startContainer.length &&
            range.endContainer.nodeType == Node.TEXT_NODE &&
            range.endOffset == range.endContainer.length &&
            range.endContainer.nextSibling == null &&
            range.startContainer.nextSibling == range.endContainer.parentNode)
          result.node = range.endContainer.parentNode;

        if (!result.node) {
          // let's rely on the common ancestor of the selection
          result.node = range.commonAncestorContainer;
        }
        else {
          result.oneElementSelected = true;
        }
      }
      else {
        // assume table cells !
        var i, container = null;
        for (i = 0; i < rangeCount; i++) {
          range = selection.getRangeAt(i);
          if (!container) {
            container = range.startContainer;
          }
          else if (container != range.startContainer) {
            // all table cells don't belong to same row so let's
            // select the parent of all rows
            result.node = container.parentNode;
            break;
          }
          result.node = container;
        }
      }
    }

    // make sure we have an element here
    while (result.node.nodeType != Node.ELEMENT_NODE)
      result.node = result.node.parentNode;

    // and make sure the element is not a special editor node like
    // the <br> we insert in blank lines
    // and don't select anonymous content !!! (fix for bug 190279)
    editor instanceof Components.interfaces.nsIHTMLEditor;
    while (result.node.hasAttribute("_moz_editor_bogus_node") ||
           editor.isAnonymousElement(result.node))
      result.node = result.node.parentNode;

    return result;
  },

  getMetaElement: function getMetaElement(aName)
  {
    if (aName)
    {
      var name = aName.toLowerCase();
      try {
        var metanodes = this.getCurrentDocument()
                          .getElementsByTagName("meta");
        for (var i = 0; i < metanodes.length; i++)
        {
          var metanode = metanodes.item(i);
          if (metanode && metanode.getAttribute("name") == name)
            return metanode;
        }
      }
      catch(e) {}
    }
    return null;
  },

  createMetaElement: function createMetaElement(aName)
  {
    var editor = this.getCurrentEditor();
    try {
      var metanode = editor.createElementWithDefaults("meta");
      metanode.setAttribute("name", aName);
      return metanode;
    }
    catch(e) {}
    return null;
  },

  insertMetaElement: function insertMetaElement(aElt, aContent, aInsertNew, aPrepend)
  {
   if (aElt)
   {
     var editor = this.getCurrentEditor();
     try {
       if (!aContent)
       {
         if (!insertNew)
           editor.deleteNode(aElt);
       }
       else
       {
         if (aInsertNew)
         {
           aElt.setAttribute("content", aContent);
           if (aPrepend)
             this.prependHeadElement(aElt);
           else
             this.appendHeadElement(aElt);
         }
         else
         {
           editor.setAttribute(aElt, "content", aContent);
         }
       }
     }
     catch(e) {}
   } 
  },

  getHeadElement: function getHeadElement()
  {
    try {
      var doc = EditorUtils.getCurrentDocument();
      var heads = doc.getElementsByTagName("head");
      return heads.item(0);
    }
    catch(e) {}

    return null;
  },

  prependHeadElement: function prependHeadElement(aElt)
  {
    var head = this.getHeadElement();
    if (head)
      try {
        var editor = EditorUtils.getCurrentEditor();
        editor.insertNode(aElt, head, 0, true);
      }
      catch(e) {}
  },

  appendHeadElement: function appendHeadElement(aElt)
  {
    var head = this.getHeadElement();
    if (head)
    {
      var pos = 0;
      if (head.hasChildNodes())
        pos = head.childNodes.length;
      try {
        var editor = EditorUtils.getCurrentEditor();
        editor.insertNode(aElt, head, pos, true);
      }
      catch(e) {}
    }
  },

  getTextProperty: function(property, attribute, value, firstHas, anyHas, allHas)
  {
    try {
      if (!gAtomService) GetAtomService();
      var propAtom = gAtomService.getAtom(property);
  
      this.getCurrentEditor().getInlineProperty(propAtom, attribute, value,
                                                firstHas, anyHas, allHas);
    }
    catch(e) {}
  },

  getClasses: function(aElt)
  {
    var e = aElt;
    var display = CssUtils.getComputedStyle(e).getPropertyValue("display");
    while (e && display == "inline" && e.className == "")
    {
      e = e.parentNode;
      display = CssUtils.getComputedStyle(e).getPropertyValue("display");
    }
    return {classes: e.className, node: e};
  },

  getCurrentTableEditor: function()
  {
    var editor = this.getCurrentEditor();
    return (editor &&
            (editor instanceof Components.interfaces.nsITableEditor)) ? editor : null;
  },

  isStrictDTD: function()
  {
    var doctype = this.getCurrentEditor().document.doctype;
    return (doctype.publicId.lastIndexOf("Strict") != -1);
  },
  
  isCSSDisabledAndStrictDTD: function()
  {
    var prefs = GetPrefs();
    var IsCSSPrefChecked = prefs.getBoolPref("editor.use_css");
    return !IsCSSPrefChecked && this.isStrictDTD();
  },

  getDocumentUrl: function()
  {
    try {
      var aDOMHTMLDoc = this.getCurrentEditor().document.QueryInterface(Components.interfaces.nsIDOMHTMLDocument);
      return aDOMHTMLDoc.URL;
    }
    catch (e) {}
    return "";
  },

  isXHTMLDocument: function()
  {
    var doctype = this.getCurrentEditor().document.doctype;
    return (doctype.publicId == "-//W3C//DTD XHTML 1.0 Transitional//EN" ||
            doctype.publicId == "-//W3C//DTD XHTML 1.0 Strict//EN");
  },

  getWrapColumn: function()
  {
    try {
      return this.getCurrentEditor().wrapWidth;
    } catch (e) {}
    return 0;
  },

  setDocumentURI: function(uri)
  {
    try {
      // XXX WE'LL NEED TO GET "CURRENT" CONTENT FRAME ONCE MULTIPLE EDITORS ARE ALLOWED
      this.getCurrentEditorElement().docShell.setCurrentURI(uri);
    } catch (e) { dump("SetDocumentURI:\n"+e +"\n"); }
  }
};
