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

function DiavoloEditor(aSourceString, aGrammarURL, aXULElement)
{
  this.init(aSourceString, aGrammarURL, aXULElement);
}

DiavoloEditor.prototype = {
  
  mHighlighter: null,
  mEditor: null,
  mEditorCore: null,
  mEditActionListener: null,

  mCodeCompletionEngine: null,

  init: function(aSourceString, aGrammarURL, aXULElement)
  {
    if (aXULElement.localName != "editor") return;
    this.mHighlighter = new DiavoloHighlighter(aSourceString,
                                               aGrammarURL,
                                               aXULElement);
    if (!this.mHighlighter)
      return;
    this.mEditor = aXULElement;

    this.startup();
  },

  startup: function()
  {
    this.mEditorCore = this.mEditor.getEditor(this.mEditor.contentWindow);

    this.mEditorCore instanceof Components.interfaces.nsIHTMLEditor;

    this.mEditorCore instanceof Components.interfaces.nsIHTMLAbsPosEditor;
    this.mEditorCore.absolutePositioningEnabled = false;

    this.mEditorCore instanceof Components.interfaces.nsIHTMLInlineTableEditor;
    this.mEditorCore.inlineTableEditingEnabled = false;

    this.mEditorCore instanceof Components.interfaces.nsIHTMLObjectResizer;
    this.mEditorCore.objectResizingEnabled = false;

    this.mEditActionListener = new DiavoloEditActionListener(this.mEditorCore, this.mHighlighter);
    this.mEditorCore.addEditActionListener(this.mEditActionListener);
    this.mEditorCore.addEditorObserver(this.mEditActionListener);
    this.mEditorCore.addInsertionListener(this.mEditActionListener);

    this.mCodeCompletionEngine = new DiavoloCodeCompletionEngine(this.mEditorCore);

    this.mEditorCore.transactionManager.AddListener(this.mEditActionListener);

  },

  shutdown: function shutdown()
  {
    this.mEditorCore.removeEditActionListener(this.mEditActionListener);
    this.mEditorCore.removeEditorObserver(this.mEditActionListener);
    this.mEditorCore.removeInsertionListener(this.mEditActionListener);

    this.mCodeCompletionEngine.shutdown();

    this.mEditorCore.transactionManager.RemoveListener(this.mEditActionListener); 
  },

/********************* PUBLIC **************************/

  textContent: function textContent()
  {
    return this.mHighlighter._textContent(this.mHighlighter.mElement.firstChild);
  },

  clear: function clear()
  {
    this.mEditorCore.selectAll();
    this.mEditorCore.deleteSelection(0);
  }
};




function DiavoloEditActionListener(aDiavoloEditorCore, aHighlighter)
{
  this.mDiavoloEditorCore = aDiavoloEditorCore;
  this.mHighlighter = aHighlighter;
}

DiavoloEditActionListener.prototype = {

  mDiavoloEditorCore: null,
  mHighlighter: null,
  mRefreshNode: null,
  mRefreshAllDoc: false,

  mBatch: false,
  mRefreshing: false,

  mUndoing: false,
  mRedoing: false,
  mSecondUndoing: false,
  mSecondRedoing: false,

  mTextNodesToDelete: [],

  mSecondaryRefresh: false,
  mSecondaryRefreshNode: null,

  /*
   * BEGIN nsITransactionListener
   */
  willUndo: function(aManager, aTransaction)
  {
    // we want to keep track of the fact we started undoing something...
    this.mUndoing = true;
    return false;
  },

  willRedo: function(aManager, aTransaction)
  {
    // and of course, same thing when we redo something...
    this.mRedoing = true;
    return false;
  },

  // we don't care about the rest
  willDo: function(aManager, aTransaction) { return false; },
  didDo: function(aManager, aTransaction, aDoResult) { },
  didUndo: function(aManager, aTransaction, aUndoResult) { },
  didRedo: function(aManager, aTransaction, aRedoResult) { },
  willBeginBatch: function(aManager) { return false; },
  didBeginBatch: function(aManager, aResult) { },
  willEndBatch: function(aManager) { return false; },
  didEndBatch: function(aManager, aResult) { },
  willMerge: function(aManager, aTopTransaction, aTransactionToMerge) { return false; },
  didMerge: function(aManager, aTopTransaction, aTransactionToMerge, aDidMerge, aMergeResult) { },
  /*
   * END nsITransactionListener
   */


  startBatch: function()
  {
    // we want to know if the editor started doing transactions 
    this.mBatch = true;
  },
  
  /*
   * BEGIN nsIEditActionListener 
   */
  WillCreateNode: function WillCreateNode(aTag, aParent, aPosition)
  {
    if (this.mRefreshing) return;
    this.startBatch();
  },

  DidCreateNode: function DidCreateNode(aTag, aNode, aParent, 
  aPosition, aResult)
  {
    if (this.mRefreshing) return;
    // we created a new node, let's refresh from the previous sibling
    this.refreshFrom(aNode.previousSibling);
  },

  WillInsertNode: function WillInsertNode(aNode, aParent, aPosition)
  {
    if (this.mRefreshing) return;
    this.startBatch();
  },

  DidInsertNode: function DidInsertNode(aNode, aParent, aPosition, aResult)
  {
    if (this.mRefreshing) return;
    // we inserted a node, let's refresh from the previous sibling
    this.refreshFrom(aNode.previousSibling);
  },

  WillDeleteNode: function WillDeleteNode(aChild)
  {
    if (this.mRefreshing) return;
    // if the node we deleted is a text node, let's refresh from the node
    // preceding its parent element ; from the previous sibling otherwise

    if (aChild.nodeType == Node.TEXT_NODE)
      this.refreshFrom(aChild.parentNode.previousSibling);
    else
      this.refreshFrom(aChild.previousSibling);

    
    this.startBatch();
  },

  DidDeleteNode: function DidDeleteNode(aChild, aResult)
  {
  },

  WillSplitNode: function WillSplitNode(aExistingRightNode, aOffset)
  {
    if (this.mRefreshing) return;
    this.startBatch();
  },

  DidSplitNode: function DidSplitNode(aExistingRightNode, aOffset, aNewLeftNode, aResult)
  {
    if (this.mRefreshing) return;
    // we have split a node in two, let's refresh from the left hand side result node
    this.refreshFrom(aNewLeftNode);
    
  },

  WillJoinNodes: function WillJoinNodes(aLeftNode, aRightNode, aParent)
  {
    if (this.mRefreshing) return;
    this.startBatch();
  },

  DidJoinNodes: function DidJoinNodes(aLeftNode, aRightNode, aParent, aResult)
  {
  },

  WillInsertText: function WillInsertText(aTextNode, aOffset, aString)
  {
    if (this.mRefreshing) return;
    this.startBatch();
  },

  DidInsertText: function DidInsertText(aTextNode, aOffset, aString, aResult)
  {
    if (this.mRefreshing) return;
    // we inserted text into an existing text node, let's refresh from
    // the parent element
    this.refreshFrom(aTextNode.parentNode);
  },

  WillDeleteText: function WillDeleteText(aTextNode, aOffset, aLength)
  {
    if (this.mRefreshing) return;
    this.startBatch();
  },

  DidDeleteText: function DidDeleteText(aTextNode, aOffset, aLength, aResult)
  {
    if (this.mRefreshing) return;
    // we deleted text, let's refresh from the node preceding the text's
    // parent element
    this.refreshFrom(aTextNode.parentNode.previousSibling);
    // if the resulting text is empty, we must remove the parent element
    if (!aTextNode.data)
    {
      this.mRefreshing = true;
      this.mHighlighter.preserveSelection();
      this.mHighlighter.mIHTMLEditor.deleteNode(aTextNode.parentNode);
      this.mHighlighter.restoreSelection();
      this.mRefreshing = false;
    }
  },

  WillDeleteSelection: function WillDeleteSelection(aSelection)
  {
    if (this.mRefreshing) return;
    this.startBatch();
  },

  DidDeleteSelection: function DidDeleteSelection(aSelection)
  {
    if (this.mRefreshing) return;
    // we deleted a selection, let's refresh from the start node
    var n = aSelection.anchorNode;
    var p = n.parentNode;
    if (n.nodeType == Node.TEXT_NODE &&
        p.nodeName.toLowerCase() == "span")
      n = p;
    this.refreshFrom(n);
  },

  /*
   * END nsIEditActionListener 
   */

  /*
   * BEGIN nsIEditorObserver
   */
  EditAction: function EditAction()
  {
    // this method is called *AFTER* all user actions in the editor
    // so that's where we refresh the source view based on the data
    // stored by the EditorObserver

    if (this.mRefreshing) return;
    var refreshLines = false;
    if (this.mRedoing)
    {
      // we just called Redo
      if (!this.mSecondRedoing)
      {
        // and it was really a user action, not our own call below
        this.mSecondRedoing = true;
        this.mDiavoloEditorCore.redo(1);
        this.mSecondRedoing = false;
      }
      this.mBatch = false;
      this.mRedoing = false;
      this.mUndoing = false;
      this.mRefreshNode = null;
      refreshLines = true;
    }
    else if (this.mUndoing) 
    {
      // we just called Undo
      if (!this.mSecondUndoing)
      {
        // and it was really a user action, not our own call below
        this.mSecondUndoing = true;
        this.mDiavoloEditorCore.undo(1);
        this.mSecondUndoing = false;
      }
      this.mBatch = false;
      this.mRedoing = false;
      this.mUndoing = false;
      this.mRefreshNode = null;
      refreshLines = true;
    }

    if (refreshLines)
    {
      var brs = this.mHighlighter.mElement.getElementsByTagName("br");
      var lines = brs.length;
      if (brs && brs.length && brs[brs.length - 1].nextSibling)
        lines++;

      this.mHighlighter.mElement.wrappedJSObject.update(lines);
      return;
    }

    if (!this.mRefreshNode || this.mRefreshAllDoc)
    {
      this.mRefreshAllDoc = false;
      // we have to refresh node at all... So if the user did something
      // let's refresh the whole document
      if (this.mBatch)
      {
        this.preRefresh();
        if (this.mSecondaryRefresh)
        {
          this.refresh(this.mSecondaryRefreshNode);
          this.mSecondaryRefresh = false;
        }
        this.refresh(this.mHighlighter.mElement.firstChild);
        this.postRefresh();
      }
        
    }
    else
    {
      if (this.mRefreshNode.nodeType == Node.ELEMENT_NODE)
      {
        this.preRefresh();
        if (this.mSecondaryRefresh)
        {
          this.refresh(this.mSecondaryRefreshNode);
          this.mSecondaryRefresh = false;
        }
        this.refresh(this.mRefreshNode);
        this.postRefresh();
      }
        
      else if (this.mRefreshNode.nodeType == Node.TEXT_NODE)
      {
        this.preRefresh();
        if (this.mSecondaryRefresh)
        {
          this.refresh(this.mSecondaryRefreshNode);
          this.mSecondaryRefresh = false;
        }
        this.refresh(this.mRefreshNode.parentNode);
        this.postRefresh();
      }
    }

    // clear the refresh node
    this.mRefreshNode = null;
  },

  /*
   * END nsIEditorObserver
   */

  notifyOfInsertion: function notifyOfInsertion(mimeType,
                         contentSourceURL,
                         sourceDocument,
                         willDeleteSelection,
                         docFragment,
                         contentStartNode,
                         contentStartOffset,
                         contentEndNode,
                         contentEndOffset,
                         insertionPointNode,
                         insertionPointOffset,
                         continueWithInsertion)
  {
    

    var node = insertionPointNode.value;
    if (node.nodeType == Node.TEXT_NODE)
    {
      if (node.parentNode != this.mHighlighter.mElement)
        this.mSecondaryRefreshNode = node.parentNode;
      else if (node.previousSibling)
        this.mSecondaryRefreshNode = node.previousSibling;
      else
        this.mSecondaryRefreshNode = this.mHighlighter.mElement.firstChild;
    }
    else
    {
      var offset = insertionPointOffset.value;
      if (offset)
      {
        this.mSecondaryRefreshNode = node.childNodes.item(offset - 1);
      }
      else
        this.mSecondaryRefreshNode = null;
    }
    this.mSecondaryRefresh = true;
    continueWithInsertion.value = true;
  },


  QueryInterface : function(aIID)
  {
    if (aIID.equals(Components.interfaces.nsIEditActionListener)
     || aIID.equals(Components.interfaces.nsIContentFilter)
     || aIID.equals(Components.interfaces.nsIEditorObserver)
     || aIID.equals(Components.interfaces.nsISupports)
     || aIID.equals(Components.interfaces.nsITransactionListener)
     || aIID.equals(Components.interfaces.nsISupportsWeakReference))
      return this;
    throw Components.results.NS_NOINTERFACE;
  },

  /*********************************************/
  /*********************************************/
  /*********************************************/

  refreshFrom: function refreshFrom(aNode)
  {
    if (this.mRefreshAllDoc)
      return;
    if (aNode && aNode.nodeName.toLowerCase() == "body" &&
        !aNode.firstChild)
    {
      // seems we have nothing at all in the body, we need to insert a br
      this.mDiavoloEditorCore.insertHTML("<br>");
      this.mRefreshNode = aNode.firstChild;
      this.mRefreshAllDoc = true;
      return;
    }

    while (aNode &&
           aNode.nodeName.toLowerCase() != "span")
      aNode = aNode.previousSibling;
    // if user actions cause multiple refresh nodes, keep only the first
    // one in document traversal order
    if (aNode) 
    {
      if (!this.mRefreshNode ||
          this.mRefreshNode.compareDocumentPosition(aNode) == Node.DOCUMENT_POSITION_PRECEDING) 
        this.mRefreshNode = aNode;
    }
    else 
    {
      this.mRefreshAllDoc = true;
    }
      
  },

  isBR: function isBR(aNode)
  {
    return (aNode.nodeType == Node.ELEMENT_NODE &&
            aNode.nodeName.toLowerCase() == "br");
  },

  preRefresh: function preRefresh()
  {
    // first let's preserve the selection
    this.mHighlighter.preserveSelection();

    // we want to aggregate all the changes we're going to make to the
    // document into one single transaction
    this.mDiavoloEditorCore.setShouldTxnSetSelection(false);
    this.mDiavoloEditorCore.beginTransaction();

    // find all BR elements standing inside a SPAN ; split those
    // spans in two and make the BR a child of the BODY
    var badBrs = this.mHighlighter.mElement.getElementsByTagName("br");

    var lines = badBrs.length;
    if (badBrs && badBrs.length && badBrs[badBrs.length - 1].nextSibling)
      lines++;
    this.mHighlighter.mElement.wrappedJSObject.update(lines);

    for (var i = 0; i < badBrs.length; i++)
    {
      var br = badBrs[i];
      var parent = br.parentNode;
      if (parent.nodeName.toLowerCase() != "span")
        continue;

      this.mRefreshing = true;

      // we need to split the span in two and move the
      // br one level up in the tree
      var res = {value: null };
      var offset = this.mHighlighter.getIndexOfNode(parent, br); 
      this.mDiavoloEditorCore.splitNode(parent, offset, res);
      // delete the lhs spam if it's now empty
      if (!res.value.firstChild)
        this.mDiavoloEditorCore.deleteNode(res.value);
      // at this point we have one span with what was before the BR
      // and a second one with the BR and what followed it
      var p = br.parentNode.parentNode;
      offset = this.mHighlighter.getIndexOfNode(p, br.parentNode);
      // now we move the spam
      this.mDiavoloEditorCore.deleteNode(br);
      this.mDiavoloEditorCore.insertNode(br, p, offset);
      // delete the rhs span if it's now empty
      if (!parent.firstChild)
       this.mDiavoloEditorCore.deleteNode(parent);
      
      this.mRefreshing = false;
    }

    // sanity check, do we still have empty spans in the document ?
    var badSpans = this.mHighlighter.mDoc.evaluate("//span[not(node())]",
                               this.mHighlighter.mDoc.documentElement,
                               null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
    for (var i = 0; i < badSpans.snapshotLength; i++) 
    {
      // yep so remove them !
      var span = badSpans.snapshotItem(i);
      this.mDiavoloEditorCore.deleteNode(span);
    }
  },

  refresh: function refresh(aNode)
  {
    // sanity check
    if (!aNode || !aNode.parentNode)
      return;
    // where do we _really_ refresh from ?
    // we need to skip error and partial tokens. CRs too...
    var currentNode = aNode.previousSibling;
    while (currentNode && currentNode.previousSibling &&
           (currentNode.nodeType != Node.ELEMENT_NODE
            || currentNode.getAttribute("error")
            || currentNode.getAttribute("partial")
            || this.isBR(currentNode)))
      currentNode = currentNode.previousSibling;
    // if the result is null, well, uh let's go back to the only node
    // we have here
    if (!currentNode)
      currentNode = aNode;

    // get source string starting at aNode
    // we can't use |body.textContent| because it does not give us
    // a \n for BR elements... Unfortunately...
    var sourceString = this.mHighlighter._textContent(currentNode);

    // ok now we have the node from where we want to refresh and
    // the corresponding portion of the source code. We need a
    // context expectation...
    aNode = currentNode.previousSibling;
    // let's skip ignored nodes
    while (aNode && aNode.getAttribute("ignored"))
      aNode = aNode.previousSibling;
    var expecting = "";
    if (aNode)
      expecting = aNode.getAttribute("expecting");
    // if we have no context expectation, let's assume we're at the
    // beginning of the document 
    if (!expecting)
      expecting = this.mHighlighter.getTokenizer().getGrammar().mFirstContextId;

    // we want kNODES_TO_GO clean tokens before we say the document
    // is refreshed
    this.mHighlighter.mNodesToGo = this.mHighlighter.kNODES_TO_GO;

    var tokenizer = this.mHighlighter.mTokenizer;
    //var context = tokenizer.mGrammar.getElementById(expecting);
    this.mHighlighter.mLastIndex = 0;
    this.mHighlighter.mCharsToConsume = 0;
    this.mHighlighter.mInsertBeforeNode = currentNode;

    // we have a callback for each token or error reported
    this.mHighlighter.mInsertionCallback = this.tokenizerInsertionCallback;

    // we don't want our changes to the document to trigger again
    // a refresh
    this.mRefreshing = true;

    // let's dance baby !

    this.mHighlighter.checkContext(this.mHighlighter, sourceString, expecting);
  },
  
  postRefresh: function postRefresh()
  {
    // finalize the aggregation of all transactions
    this.mDiavoloEditorCore.setShouldTxnSetSelection(true);
    this.mDiavoloEditorCore.endTransaction();
    // go back to the normal state of the editor
    this.mRefreshing = false;
    this.mBatch = false;
    // and restore the caret's poisition
    this.mHighlighter.restoreSelection();
  },

  tokenizerInsertionCallback: function tokenizerInsertionCallback(aHighlighter,
                                                                  aTokenizer)
  {
    var node = aHighlighter.mInsertBeforeNode;
    if (!node)
      return false;
    if (aHighlighter.mCharsToConsume <= 0)
      aHighlighter.mCharsToConsume += node.textContent.length;
    var oldNode = node.previousSibling; // always exists
    if (!oldNode)
      return false;
    aHighlighter.mCharsToConsume -= oldNode.textContent.length;
    //dump(aHighlighter.mCharsToConsume + ": " + oldNode.textContent + " | " + node.textContent + "\n");
    if (oldNode.nodeName.toLowerCase() != node.nodeName.toLowerCase())
    {
      aHighlighter.mNodesToGo = aHighlighter.kNODES_TO_GO;
    }
    else if (oldNode.nodeName.toLowerCase() == "br")
    {}
    else if (oldNode.getAttribute("token") != node.getAttribute("token") ||
             oldNode.getAttribute("context") != node.getAttribute("context") ||
             oldNode.getAttribute("expecting") != node.getAttribute("expecting") ||
             oldNode.getAttribute("partial") != node.getAttribute("partial") ||
             oldNode.getAttribute("ignored") != node.getAttribute("ignored") ||
             oldNode.getAttribute("error") != node.getAttribute("error") ||
             oldNode.textContent.length != node.textContent.length)
    {
      aHighlighter.mNodesToGo = aHighlighter.kNODES_TO_GO;
    }
    else
    {
      if (node.getAttribute("error"))
      {
        // let's check if we're back on same error...
        if (node.getAttribute("skipuntil") == oldNode.getAttribute("skipuntil"))
          aHighlighter.mNodesToGo = 0;
        else
          aHighlighter.mNodesToGo = aHighlighter.kNODES_TO_GO;
      }
      else if (!oldNode.getAttribute("partial"))
        aHighlighter.mNodesToGo--;
    }
  
    
    if (aHighlighter.mCharsToConsume <= 0)
    {
      aHighlighter.mInsertBeforeNode = node.nextSibling;
      if (node.nodeName.toLowerCase() == "br" &&
          node.previousSibling.nodeName.toLowerCase() == "br")
      {
        var attributes = node.attributes;
        for (var i = 0; i < attributes.length; i++)
        {
          var attr = attributes.item(i);
          node.previousSibling.setAttribute(attr.nodeName, attr.nodeValue);
        }
      }
      aHighlighter.mIHTMLEditor.deleteNode(node);
      if (aHighlighter.mCharsToConsume < 0)
      {
        var charsToConsume = aHighlighter.mCharsToConsume;
        do {
          charsToConsume += aHighlighter.mInsertBeforeNode.textContent.length;
          if (charsToConsume <= 0)
          {
            var node = aHighlighter.mInsertBeforeNode.nextSibling;
            aHighlighter.mCharsToConsume = charsToConsume;
            aHighlighter.mIHTMLEditor.deleteNode(aHighlighter.mInsertBeforeNode);
            aHighlighter.mInsertBeforeNode = node;
          }
        }
        while (charsToConsume < 0 && aHighlighter.mInsertBeforeNode);

      }
    }

    return (aHighlighter.mNodesToGo <= 0 &&
            aHighlighter.mCharsToConsume == 0);
  }
  
  

};

