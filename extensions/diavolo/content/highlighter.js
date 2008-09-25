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

function DiavoloHighlighter(aSourceString, aGrammarURL, aEditor)
{
  this.init(aSourceString, aGrammarURL, aEditor);
}

DiavoloHighlighter.prototype= {

  kHTML_NAMESPACE: "http://www.w3.org/1999/xhtml",

  mTokenizer: null,
  mFirstContext: null,
  mLastIndex: 0,

  mElement: null,
  mEditor: null,
  mDoc: null,
  mIHTMLEditor: null,

  mInsertBeforeNode: null,
  mInsertionCallback: null,

  kNODES_TO_GO: 4,
  mNodesToGo: 0,

  mCharsToConsume: 0,

  mSelEndContainer: null,
  mSelEndOffset: 0,
  mGlobalOffset: 0,

  getIndexOfNode: function getIndexOfNode(aParent, aNode)
  {
    if (aNode)
    {
      // the following 3 lines are an excellent suggestion from Neil Rashbrook
      var range = aNode.ownerDocument.createRange();
      range.selectNode(aNode);
      return range.startOffset;
    }
    return aParent.childNodes.length - 1;
  },

  installStylesheet: function installStylesheet()
  {
    // apply the stylesheet for the document
    var head = this.mDoc.getElementsByTagName("head").item(0);
    var styleElts = head.getElementsByTagName("style");
    for (var i = styleElts.length - 1 ; i >= 0; i--)
    {
      head.removeChild(styleElts[i]);
    }

    var style = this.mDoc.createElementNS(this.kHTML_NAMESPACE, "style");
    style.setAttribute("type", "text/css");
    var styles = this.mTokenizer.mGrammar.buildStylesheet() +
                 "span { -moz-binding: url('chrome://diavolo/content/completionPopup.xml#popup'); }" +
                 "option { -moz-user-select: text !important; -moz-user-input: auto ! important; font-size: smaller; }" +
                 "div[anonid='ChoicePopup'] select { -moz-user-select: none !important; \
                           -moz-user-input: auto !important; \
                           -moz-user-focus: none !important; }";
    var text = this.mDoc.createTextNode(styles);
    style.appendChild(text);
    head.appendChild(style);
  },

  init: function(aSourceString, aGrammarURL, aXULElement)
  {
    if (!aXULElement || aXULElement.localName != "editor")
      return;


    this.mEditor = aXULElement;
    this.mDoc = aXULElement.contentDocument;
    this.mElement = this.mDoc.body;

    // WARNING the following line is workaround for bug 442686
    this.mDoc.body.style.whiteSpace = "pre-wrap";

    this.mDoc.body.style.fontFamily = "-moz-fixed";
    // apply our binding for line numbering
    this.mDoc.body.style.MozBinding = "url('chrome://diavolo/content/linenumbering.xml#linenumbering')";
    
    this.mIHTMLEditor = aXULElement.getHTMLEditor(aXULElement.contentWindow);
    // disable spell checker if any
    try {
      var spc =  this.mIHTMLEditor.getInlineSpellChecker(false);
      if (spc)
        spc.enableRealTimeSpell = false;
    }
    catch(e) {}

    // the following line is absolutely mandatory or the editor will react
    // strangely until it gets the focus... call that a bug in the editor...
    aXULElement.focus();

    // starting from here, we want all changes we make to the edited doc
    // to be merged into one single Undo/Redo transaction
    this.mIHTMLEditor.beginTransaction();

    // create a tokenizer for our grammar
    this.mTokenizer = new DiavoloTokenizer(aGrammarURL);
    if (!this.mTokenizer)
      return null;

    this.installStylesheet();
    
    // we start parsing aSourceString from the first char
    this.mLastIndex = 0;
    this.mInsertBeforeNode = null;
    // and since we're not refreshing, no callback on changes
    this.mInsertionCallback = null;

    // let's dance !
    this.checkContext(this, aSourceString,
                      this.getTokenizer().getGrammar().mFirstContextId);


    // we're done ; let's close the aggregated transaction we started above 
    this.mIHTMLEditor.endTransaction();

    // We have to deal with a weird case here... The selection
    // is originally after the last span of the document and
    // before the trailing special <br> the editor adds...
    // That's bad and we want the caret to be placed at the end
    // of the text node child of the last span if any, and right
    // before the last <br> is there's no span in the document.
    var child = this.mElement.lastChild;
    while (child && child.nodeName.toLowerCase() != "span")
      child = child.previousSibling;
    if (child)
    {
      child = child.lastChild; // this is the last text node in the span
      this.mIHTMLEditor.selection.collapse(child, child.data.length);
    }
    else
    {
      var n = this.mElement.childNodes.length;
      this.mIHTMLEditor.selection.collapse(this.mElement, n -1);
    }

    // how many lines to we have in our source code ?
    var n = 1;
    try {
      n = aSourceString.match( /\n/g ).length + 1;
    }
    catch(e) {}

    // let's update line numbering.
    // we need to let a few cycles pass because of the line numbering XBL
    // otherwise it's not applied yet :-(
    setTimeout(this.postCreate, 100, this.mIHTMLEditor.rootElement, n);
  },

  postCreate: function postCreate(aElt, aLines)
  {
    // update the line numbering
    aElt.wrappedJSObject.update(aLines);
  },

  getTokenizer: function getTokenizer()
  {
    return this.mTokenizer;
  },

  checkContext: function checkContext(aH, aSourceString, contextName)
  {
    // sanity check
    for (var foo = 0; contextName; foo++)
    {
      var aCtx = aH.getTokenizer().getGrammar().mContexts[contextName];

      var ignoreSkipUntil = null;
      var ignoreExpecting = aH.getTokenizer().getGrammar().mFirstContextId;

      var nextToken;

      var ignoredToken = true;
      do {
        // get the next token in |aSourceString| at position
        // |this.mLastIndex|
        nextToken = aH.getTokenizer().getNextToken(aSourceString, aH.mLastIndex);
        // if the result is null, we have hit the boundaries of the string so
        // let's go shopping
        if (!nextToken)
          return;

        // we do not have a real token, the tokenizer only returned the next
        // char on the stack and said it can't understand it ; since an error
        // cannot be an ignored token, we break here
        if (nextToken.error)
          break;

        // is our current token ignored ?
        ignoredToken = (nextToken.name in aCtx.ignores);
        if (ignoredToken)
        {
          // yes, it's ignored ; first let's update the stack
          aH.mLastIndex += nextToken.string.length;
          // and report an ignored token
          if (aH.reportToken(nextToken.name,
                               nextToken.string,
                               null,
                               null,
                               contextName,
                               false, // not partial at this time
                               true)) // token ignored
            return ;

        }
        // of course, we loop until the next token is not ignored...
      }
      while (ignoredToken);

      // at this point, we have either an error or a token
      // let's find all the tokens accepted in the current context

      // clear the next context

      var nextContextID = null;
      if (!nextToken.error)
      {
        for (var i = 0; !nextContextID && i < aCtx.tokens.length; i++)
        {
          var ctxToken = aCtx.tokens[i];
          var nextToken = aH.getTokenizer().getNextTokenAs(aSourceString,
                                                           aH.mLastIndex,
                                                           ctxToken.type);
          if (!nextToken)
            return;
          if (!nextToken.error)
          {
            // we found a possible token for this context
            // let's check if we need to look ahead
            var consume = true;
            if (ctxToken.lookahead)
            {
              // yep, look ahead needed, let's get another token without
              // updating this.mLastIndex
              var lookaheadTokenName = ctxToken.lookahead;
              var lToken = aH.getTokenizer().getNextTokenAs(aSourceString,
                                                            aH.mLastIndex + nextToken.string.length,
                                                            lookaheadTokenName); 
              consume = (lToken && !lToken.error);
              // do we have a match in the current context ?
            }
            if (consume)
            {
              // yes we do, let's report the token
              if (aH.reportToken(nextToken.name,
                                   nextToken.string,
                                   ctxToken.role,
                                   ctxToken.expecting,
                                   contextName,
                                   false,
                                   false))
                return;
              if (ctxToken.expecting)
              {
                nextContextID = ctxToken.expecting;
                aH.mLastIndex += nextToken.string.length;
              }
              else
                return;
            }

          }
        }
      }

      if (!nextContextID) // we did not consume, we're in an error loop
      {
        var skipuntils = " ";
        for (i in aCtx.skipuntils)
          skipuntils += i + " ";
        try {
          nextToken = aH.getTokenizer().getNextToken(aSourceString, aH.mLastIndex);
          var skipuntilTokenFound = false;
          var expecting = contextName;
          do {
            if (!nextToken)
            {
              // we reached the end of source string
              return;
            }

            aH.mLastIndex += nextToken.string.length;
            if (nextToken.name in aCtx.skipuntils)
            {
              skipuntilTokenFound = true;

              expecting = aCtx.skipuntils[nextToken.name];
              nextContextID = expecting;
              if (aH.reportToken(nextToken.name,
                                   nextToken.string,
                                   "SKIPUNTIL",
                                   expecting,
                                   contextName,
                                   false,
                                   false))
                return;
            }
            else
            {
              if (aH.reportError(nextToken.name,
                                   nextToken.string,
                                   null,
                                   expecting,
                                   skipuntils,
                                   false))
                return;
              nextToken = aH.getTokenizer().getNextToken(aSourceString, aH.mLastIndex);
            }
          }
          while (!skipuntilTokenFound);
        }
        catch(e) {}
      }

      contextName = nextContextID;
    }
  },

  reportToken: function reportToken(aName, aString, aRole, aExpecting,
                                    aCtxName, aPartial, aIgnored)
  {
    var stopAfterReport = false;
    
    if (!this.mElement || !aString)
      return stopAfterReport;
    // do we have more than one line in our token ?
    var lines = aString.split( /\r\n|\n/g );
    var doc = this.mElement.ownerDocument;
    if (lines.length == 1)
    {
      // one line only
      if (this.mInsertBeforeNode && this.mInsertBeforeNode.nodeType == Node.ELEMENT_NODE)
      {
        var n = this.mInsertBeforeNode;
        // is our new token exactly the one we originally had after the
        // recent changes?
        if (aString == n.textContent &&
            aName == n.getAttribute("token") &&
            aCtxName == n.getAttribute("context") &&
            aExpecting == n.getAttribute("expecting") &&
            aPartial == n.hasAttribute("partial") &&
            !aIgnored && !n.hasAttribute("ignored") &&
            (aRole ? aRole : aName) == n.getAttribute("class"))
        {
          // yes, and it's not ignored ; do nothing and early way out
          this.mInsertBeforeNode = this.mInsertBeforeNode.nextSibling;
          // one "clean" token less to go
          this.mNodesToGo--;
          return (!this.mNodesToGo);
        }
      }

      // create a new span for our token
      var offset = this.getIndexOfNode(this.mElement, this.mInsertBeforeNode);
      // and insert it before our insertion point
      var span = this.mIHTMLEditor.createNode("span", this.mElement, offset);
      this.mIHTMLEditor.setAttribute(span, "token", aName);
      this.mIHTMLEditor.setAttribute(span, "context", aCtxName);
      if (aExpecting)
        this.mIHTMLEditor.setAttribute(span, "expecting", aExpecting);
      if (aPartial)
        this.mIHTMLEditor.setAttribute(span, "partial", "true");
      if (aIgnored)
        this.mIHTMLEditor.setAttribute(span, "ignored", "true");
      if (aRole)
        this.mIHTMLEditor.setAttribute(span, "class", aRole);
      else
        this.mIHTMLEditor.setAttribute(span, "class", aName);

      var s = doc.createTextNode(aString);
      this.mIHTMLEditor.insertNode(s, span, 0);

      // if we're refreshing, call our callback on token insertion
      if (this.mInsertionCallback)
        stopAfterReport = this.mInsertionCallback(this, this.mTokenizer);
    }
    else
    {
      // it's a multiline token, we're going to split it into multiple
      // spans and BRs carrying partial="true"
      for (var i = 0; i < lines.length; i++)
      {
        var line = lines[i];
        if (line)
        {
          if (this.reportToken(aName, line, aRole, aExpecting, aCtxName,
                               (i != 0), aIgnored))
            return true;
        }
        if (i != lines.length - 1)
        {
          var offset = this.getIndexOfNode(this.mElement, this.mInsertBeforeNode);
          var brNode = doc.createElementNS(this.kHTML_NAMESPACE, "br");
          this.mIHTMLEditor.insertNode(brNode, this.mElement, offset);
          brNode.setAttribute("token", aName);
          brNode.setAttribute("context", aCtxName);
          if (aExpecting)
            brNode.setAttribute("expecting", aExpecting);
          if (aPartial)
            brNode.setAttribute("partial", "true");
          if (aIgnored)
            brNode.setAttribute("ignored", "true");

          if (this.mInsertionCallback)
            stopAfterReport |= this.mInsertionCallback(this, this.mTokenizer);
        }
      }
    }
    return stopAfterReport;
  },

  reportError: function reportError(aName, aString, aRole, aExpecting,
                                    aSkipuntil, aPartial)
  {
    // just like reportToken() but we insert elements with error="true"

    var stopAfterReport = false;
    if (!this.mElement || !aString)
      return stopAfterReport;
    var lines = aString.split( /\r\n|\n/g );
    var doc = this.mElement.ownerDocument;
    if (lines.length == 1)
    {
      var span = doc.createElementNS(this.kHTML_NAMESPACE, "span");
      if (aRole)
        span.className = aRole;
      else
        span.className = aName;
      span.setAttribute("token", aName);
      if (aExpecting)
        span.setAttribute("expecting", aExpecting);
      if (aPartial)
        span.setAttribute("partial", "true");
      if(aSkipuntil)
        span.setAttribute("skipuntil", aSkipuntil)
      span.setAttribute("error", "true");
      
      var s = doc.createTextNode(aString);
      span.appendChild(s);
      var offset = this.getIndexOfNode(this.mElement, this.mInsertBeforeNode);
      this.mIHTMLEditor.insertNode(span, this.mElement, offset);
      if (this.mInsertionCallback)
        stopAfterReport = this.mInsertionCallback(this, this.mTokenizer);
    }
    else
    {
      for (var i = 0; i < lines.length; i++)
      {
        var line = lines[i];
        if (line)
        {
          this.reportError(aName, line, aRole, aExpecting, aSkipuntil, true);
        }
        if (i != lines.length - 1)
        {
          var offset = this.getIndexOfNode(this.mElement, this.mInsertBeforeNode);
          this.mIHTMLEditor.insertNode(doc.createElementNS(this.kHTML_NAMESPACE, "br"), this.mElement, offset);
          if (this.mInsertionCallback)
            stopAfterReport |= this.mInsertionCallback(this, this.mTokenizer);
        }
      }
    }
    return stopAfterReport;
  },

  preserveSelection: function preserveSelection()
  {
    // let's preserve the caret's position ; after edit changes,
    // the selection is always collapsed

    // we're going to preserve it counting the chars from the
    // beginning of the document up to the caret, just like in
    // a plaintext editor ; BRs count for "\n" so 1 char.
    var range = this.mIHTMLEditor.selection.getRangeAt(0);
    this.mSelEndContainer   = range.endContainer;
    this.mSelEndOffset      = range.endOffset;
    this.mGlobalOffset = 0; 

    if (this.mSelEndContainer.nodeType == Node.TEXT_NODE)
    {
      if (this.mSelEndContainer.parentNode.nodeName.toLowerCase() != "body")
        this.mSelEndContainer = this.mSelEndContainer.parentNode;
      this.mGlobalOffset = this.mSelEndOffset;
    }
    else
    {
      var children = this.mSelEndContainer.childNodes;
      var l = children.length;
      for (var i = 0; i < l && i < this.mSelEndOffset; i++)
      {
        var child = children.item(i);
        switch (child.nodeType)
        {
          case Node.TEXT_NODE:
            this.mGlobalOffset += child.data.length;
            break;
          case Node.ELEMENT_NODE:
            if (child.nodeName.toLowerCase() == "br")
              this.mGlobalOffset++;
            else
              this.mGlobalOffset += child.textContent.length;
            break;
          default:
            break;
        }
      }
      if (this.mSelEndContainer.nodeName.toLowerCase() == "body")
        return;
    }

    var node = this.mSelEndContainer.previousSibling;
    while (node)
    {
      if (node.nodeName.toLowerCase() == "br")
        this.mGlobalOffset += 1;
      else
        this.mGlobalOffset += node.textContent.length;
      node = node.previousSibling;
    }
  },

  restoreSelection: function restoreSelection()
  {
    // let's restore the caret at our previous position using the
    // char offset we stored in restoreSelection()
    var node = this.mElement.firstChild;
    var offset = 0;
    while (node &&
           ((node.nodeName.toLowerCase() == "br") ? 1 : node.textContent.length) < this.mGlobalOffset)
    {
      if (node.nodeName.toLowerCase() == "br")
        this.mGlobalOffset--;
      else
        this.mGlobalOffset -= node.textContent.length;
      node = node.nextSibling;
    }
    if (node)
    {
      if (node.nodeName.toLowerCase() == "span") 
        this.mIHTMLEditor.selection.collapse(node.firstChild, this.mGlobalOffset);
      else if (node.nodeType == Node.TEXT_NODE) 
      {
        this.mIHTMLEditor.selection.collapse(node, this.mGlobalOffset);
      }
      else // this is a BR element
        if (this.mGlobalOffset)
          this.mIHTMLEditor.setCaretAfterElement(node);
        else
          this.mIHTMLEditor.beginningOfDocument();
    }
  },


  _textContent: function _textContent(aNode)
  {
    // get source string starting at aNode
    // we can't use |body.textContent| because it does not give us
    // a \n for BR elements... Unfortunately...
    var sourceString = "";
    while (aNode)
    {
      if (aNode.nodeName.toLowerCase() == "br")
      {
        if (aNode.nextSibling)
          sourceString += "\n";
      }
      else
        sourceString += aNode.textContent; 
      aNode = aNode.nextSibling;
    }
    return sourceString;
  }

};
