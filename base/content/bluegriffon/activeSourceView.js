function ActiveSourceTree(aEditor)
{
  this.mOldSourceElt = null;
  this.mOneEltSelected = false;
  this.mOldSelectedLi = null;

  this.mEditing = false;
  this.mEditedNode = null;

  this.mMutationsEnabled = true;

  this.mSourceTreeXULElement = null;
  this.mEditor = null;

  this.mRefuseNextMergeTransaction = false;

  this.startup(aEditor);
}

ActiveSourceTree.prototype.startup =
function(aEditor)
{
    function ActiveSourceTreeContentListener(aActiveSourceTree)
    {
      this.init(aActiveSourceTree);
    }
    
    ActiveSourceTreeContentListener.prototype = {
    
      init : function(aActiveSourceTree)
        {
          this.mActiveSourceTree = aActiveSourceTree;
        },
    
      QueryInterface : function(aIID)
        {
          if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
              aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
              aIID.equals(Components.interfaces.nsISupports))
            return this;
          throw Components.results.NS_NOINTERFACE;
        },
    
      onStateChange : function(aWebProgress, aRequest, aStateFlags, aStatus)
      {
        const nsIWebProgressListener = Components.interfaces.nsIWebProgressListener;
    
        if (aStateFlags & nsIWebProgressListener.STATE_IS_DOCUMENT)
        {
          if (aStateFlags & nsIWebProgressListener.STATE_STOP)
          {
            this.mActiveSourceTree.postStartup();
          }
        }
      },
    
      onProgressChange : function(aWebProgress, aRequest,
                                  aCurSelfProgress, aMaxSelfProgress,
                                  aCurTotalProgress, aMaxTotalProgress)
      {},
    
      onLocationChange : function(aWebProgress, aRequest, aLocation)
      {},
    
      onStatusChange : function(aWebProgress, aRequest, aStatus, aMessage)
      {},
    
      onSecurityChange : function(aWebProgress, aRequest, aState)
      {},
    };

  var sourceTreeDeck = gDialog.sourceTreeDeck;

  var browser = document.createElement("browser");
  browser.setAttribute("flex", "1");

  sourceTreeDeck.appendChild(browser);
  sourceTreeDeck.selectedPanel = browser;

  this.mSourceTreeXULElement = browser;
  this.mEditor = aEditor;
  browser.setAttribute("src", "chrome://bluegriffon/content/sourceViewTemplate.html");
  var docShell = browser.docShell;
  var progress = docShell.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIWebProgress);
  var progressListener = new ActiveSourceTreeContentListener(this);
  progress.addProgressListener(progressListener, Components.interfaces.nsIWebProgress.NOTIFY_ALL);


};

ActiveSourceTree.prototype.postStartup =
function()
{
  this.mSourceTreeXULElement.contentWindow.startup();
  this.addEditorListeners();
  this.addSourceTreeListeners();

  this.serializeInSourceTree();
};

ActiveSourceTree.prototype.shutdown =
function()
{
  this.removeEditorListeners();
  this.removeSourceTreeListeners()

};

ActiveSourceTree.prototype.addEditorListeners =
function()
{
  var doc = this.mEditor.contentDocument;
  var _self = this;

  doc.addEventListener("DOMAttrModified",          function(aEvent){_self.onBrowserMutateAttribute(aEvent)}, false);
  doc.addEventListener("DOMNodeInserted",          function(aEvent){_self.onBrowserMutateNode(aEvent)}, false);
  doc.addEventListener("DOMNodeRemoved",           function(aEvent){_self.onBrowserMutateNode(aEvent)}, false);
  doc.addEventListener("DOMCharacterDataModified", function(aEvent){_self.onBrowserMutateText(aEvent)}, false);

  NotifierUtils.addNotifierCallback("selection",   function(a,b,c){_self.onBrowserSelectionChanged(a,b,c)}, this);
};

ActiveSourceTree.prototype.removeEditorListeners =
function()
{
  var doc = this.mEditor.contentDocument;
  var _self = this;  

  doc.removeEventListener("DOMAttrModified",          function(aEvent){_self.onBrowserMutateAttribute(aEvent)}, false);
  doc.removeEventListener("DOMNodeInserted",          function(aEvent){_self.onBrowserMutateNode(aEvent)}, false);
  doc.removeEventListener("DOMNodeRemoved",           function(aEvent){_self.onBrowserMutateNode(aEvent)}, false);
  doc.removeEventListener("DOMCharacterDataModified", function(aEvent){_self.onBrowserMutateText(aEvent)}, false);

  NotifierUtils.removeNotifierCallback("selection",   function(a,b,c){_self.onBrowserSelectionChanged(a,b,c)});
};

ActiveSourceTree.prototype.addSourceTreeListeners =
function()
{
  var sourceDoc = this.mSourceTreeXULElement.contentDocument;
  var _self = this;

  sourceDoc.addEventListener("mousemove",                function(aEvent){_self.onSourceViewMouseMove(aEvent)}, true);
  sourceDoc.addEventListener("click",                    function(aEvent){_self.onSourceViewClick(aEvent)}, true);
  sourceDoc.addEventListener("keypress",                 function(aEvent){_self.onSourceViewKeyPress(aEvent)}, true);
  sourceDoc.addEventListener("blur",                     function(aEvent){_self.onSourceViewBlur(aEvent)}, true);
  sourceDoc.addEventListener("DOMCharacterDataModified", function(aEvent){_self.onSourceViewMutateText(aEvent)}, false);
};

ActiveSourceTree.prototype.removeSourceTreeListeners =
function()
{
  var sourceDoc = this.mSourceTreeXULElement.contentDocument;
  var _self = this;

  sourceDoc.removeEventListener("mousemove",                function(aEvent){_self.onSourceViewMouseMove(aEvent)}, true);
  sourceDoc.removeEventListener("click",                    function(aEvent){_self.onSourceViewClick(aEvent)}, true);
  sourceDoc.removeEventListener("keypress",                 function(aEvent){_self.onSourceViewKeyPress(aEvent)}, true);
  sourceDoc.removeEventListener("blur",                     function(aEvent){_self.onSourceViewBlur(aEvent)}, true);
  sourceDoc.removeEventListener("DOMCharacterDataModified", function(aEvent){_self.onSourceViewMutateText(aEvent)}, false);
};

ActiveSourceTree.prototype.onSourceViewBlur =
function(aEvent)
{
  var target = aEvent.target;
  if (target &&
      target.nodeType == Node.ELEMENT_NODE &&
      target.getAttribute("contenteditable") == "true")
    this.mRefuseNextMergeTransaction = true;

  this.mOneEltSelected = false;
  if (this.mOldSelectedLi)
    this.mOldSelectedLi.removeAttribute("selected");
  this.mOldSelectedLi = null;};

ActiveSourceTree.prototype.serializeInSourceTree =
function()
{
  this.cleanupSourceTree();

  this.mMutationsEnabled = false;

  var sourceDoc = this.mSourceTreeXULElement.contentDocument;
  var doc = this.mEditor.contentDocument;

  // create the initial UL that will hold the root element
  var currentUL = sourceDoc.createElement("ul");
  sourceDoc.body.appendChild(currentUL);

  this.addEltToSourceView(sourceDoc,
                          doc.documentElement,
                          currentUL);

  this.mMutationsEnabled = true;
};

ActiveSourceTree.prototype.addEltToSourceView =
function(aDoc, aNode, aCurrentUL)
{
    while (aNode)
    {
      var li; 
      switch (aNode.nodeType)
      {
        case Node.TEXT_NODE:
          li = this.createSourceViewForTextNode(aDoc, aNode, aCurrentUL);
          aCurrentUL.appendChild(li);
          if (!aNode.data.match( /\S/g ))
            li.setAttribute("style", "display: none");
          break;
        case Node.ELEMENT_NODE:
          li = this.createSourceViewForElementNode(aDoc, aNode, aCurrentUL, null);
          aCurrentUL.appendChild(li);
          break;
        default:
          break;
      }
      aNode = aNode.nextSibling;
    }
};

ActiveSourceTree.prototype.createSourceViewForTextNode =
function(aDoc, aNode, aCurrentUL)
{
  var span = aDoc.createElement("span");
  span.setAttribute("class", "textNode");
  span.setAttribute("contenteditable", "true");

  var t = aDoc.createTextNode(aNode.data);
  var li = aDoc.createElement("li");
  var id = this.getRandomID();
  li.setAttribute("id", id);
  span.appendChild(t);
  li.appendChild(span);
  li.setUserData("originalNode", aNode, null);
  aNode.setUserData("sourceViewID", id, null);
  li.setAttribute("empty", "true");
  return li
};

ActiveSourceTree.prototype.createSourceViewForElementNode =
function(aDoc, aNode, aCurrentUL, aCurrentLI)
{
  var li;
  if (aCurrentLI)
    li = aCurrentLI;
  else
  {
    var id = this.getRandomID();
    li = aDoc.createElement("li");
    li.setAttribute("id", id);
    aNode.setUserData("sourceViewID", id, null);
  }
                    
  var img = aDoc.createElement("img");
  img.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABGdBTUEAANbY1E9YMgAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAADgSURBVHjalFFLDgFBFKw2RAwJiVjYOIA4gI0zuI6jOAFrC4mt2FhYij0SvxHjMxmjP1r3zCBMCJW87uq86pfqaiKlxK+I66UzGMvhZPZRVC2XUK9VCPTkRrMrvyHsB5M1hOAgJOCGkQDnTDEJRi+vNjQYoyEL3kCViNEznIP9EMfu5HrlSKXSqjL+2TQzyOYK6pIXnSyEwH6/VTtDPl/EZj3H5ezCc09R8dG24KkmD+1sV3OfC9/7m3hnLeAcbXBK0e+1YS2nflKGoSXpp1jn2BrpnJNhRXPWIP/84E2AAQCcuIfwPqAmjQAAAABJRU5ErkJggg==");
  img.setAttribute("class", "minusTwisty");
  li.appendChild(img);
  
  var img = aDoc.createElement("img");
  img.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABGdBTUEAANbY1E9YMgAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAADHSURBVHjalJE9CsJAEIXfEsEihTfwAOIBbDyD1/EonsDewhPYWFiJ2FgIFjYRE2PIz/5k3DExQRZFH+wPzDePt7OCiPCrOrwtVjta708fodGgj8l4KMDO09mSvqmuV84sYzSEaN2qdAQli/cYLKXkC2tgJTMkt9CFy1LD93tO3uNh68LGGETRxZ4KVJJtNiiyFHl6d+E4DJDborZxiMrnw/lutHLha3BGEofQ0sJNboLnMeK3MM9xvuE5d+vlzpkl/vnBhwADALPWiKYmr0SBAAAAAElFTkSuQmCC");
  img.setAttribute("class", "plusTwisty");
  li.appendChild(img);
  
  var lt = aDoc.createTextNode("<");
  li.appendChild(lt);

  var span = aDoc.createElement("span");
  span.setAttribute("class", "tagName");
  var tagName = aNode.nodeName.toLowerCase();
  var t = aDoc.createTextNode(tagName);
  span.appendChild(t);
  li.appendChild(span);

  if (aNode.attributes.length)
  {
    var attributes = aNode.attributes;
    for (var i = 0; i < attributes.length; i++)
    {
      var name = attributes[i].nodeName;
      if (name.substr(0, 4) == "_moz")
        continue;

      // the @ in the line below is here because of bug 455992 
      li.appendChild(aDoc.createTextNode(" @"));

      span = aDoc.createElement("span");
      span.setAttribute("class", "attrName");
      span.setAttribute("originalAttrName", name);
      span.setAttribute("contenteditable", "true");
      span.appendChild(aDoc.createTextNode(name));
      li.appendChild(span);

      li.appendChild(aDoc.createTextNode("=\""));

      span = aDoc.createElement("span");
      span.setAttribute("class", "attrValue");
      span.setAttribute("originalAttrName", name);
      span.setAttribute("contenteditable", "true");
      span.appendChild(aDoc.createTextNode(attributes[i].nodeValue));
      li.appendChild(span);

      li.appendChild(aDoc.createTextNode("\""));
    }
  }

  if (tagName == "style"  ||
      tagName == "script" ||
      tagName == "pre")
    li.setAttribute("class", "pre-content");
  li.appendChild(aDoc.createTextNode(">"));
  li.setUserData("originalNode", aNode, null);

  if (!aCurrentLI)
  {
    if (aNode.firstChild)
    {
      var newUL = aDoc.createElement("ul");
      li.appendChild(newUL);
  
      this.addEltToSourceView(aDoc, aNode.firstChild, newUL);
    }
    else
      li.setAttribute("empty", "true");
  }

  return li;
};

ActiveSourceTree.prototype.getRandomID =
function()
{
  return "moz" + new Date().valueOf() +
         "_" + Math.round(Math.random() * 100000);
};

ActiveSourceTree.prototype.onBrowserMutateNode =
function(aEvent)
{
  if (!this.mMutationsEnabled)
    return;

  this.mMutationsEnabled = false;

  var target = aEvent.target;
  var parent = aEvent.relatedNode;
  var removal = aEvent.type == "DOMNodeRemoved";

  var sourceDoc = this.mSourceTreeXULElement.contentDocument;
  if (removal)
  {
    var sourceViewID = target.getUserData("sourceViewID");
    var sourceTarget = sourceDoc.getElementById(sourceViewID);
    var sourceParent = sourceTarget.parentNode;
    sourceParent.removeChild(sourceTarget);
    if (!sourceParent.childNodes.length)
      sourceParent.parentNode.removeChild(sourceParent);
  }
  else
  {
    var sourceViewID = parent.getUserData("sourceViewID");
    var sourceParent = sourceDoc.getElementById(sourceViewID);
    var currentUL = null;
    if (sourceParent.lastChild.nodeName.toLowerCase() == "ul")
      currentUL = sourceParent.lastChild;
    else
    {
      currentUL = sourceDoc.createElement("ul");
      sourceParent.appendChild(currentUL);
    }

    var nextSibling = target.nextSibling;
    var sourceNextSibling = null;
    if (nextSibling)
    {
      var sourceViewNextSiblingID =  nextSibling.getUserData("sourceViewID");
      sourceNextSibling = sourceDoc.getElementById(sourceViewNextSiblingID);
    }

    var li = null;
    switch (target.nodeType)
    {
      case Node.TEXT_NODE:
        if (target.data.match( /\S/g ))
        {
          li = this.createSourceViewForTextNode(sourceDoc, target, currentUL);
          currentUL.insertBefore(li, sourceNextSibling);
        }
          
        break;
      case Node.ELEMENT_NODE:
        li = this.createSourceViewForElementNode(sourceDoc, target, currentUL, null);
        li.setAttribute("open", "true");
        currentUL.insertBefore(li, sourceNextSibling);

        li.setAttribute("selected", "true");
        if (this.mOldSelectedLi && this.mOneEltSelected)
        {
          this.mOldSelectedLi.removeAttribute("selected");
        }
        this.mOneEltSelected = true;
        this.mOldSelectedLi = li;
        break;
      default:
        break;
    }
    if (li)
      this.ensureElementIsVisible(this.mSourceTreeXULElement, li);
  }

  this.mMutationsEnabled = true;

};

ActiveSourceTree.prototype.cleanupSourceTree =
function()
{
  this.mMutationsEnabled = false;

  var sourceDoc = this.mSourceTreeXULElement.contentDocument;
  sourceDoc.body.innerHTML = "";

  this.mMutationsEnabled = true;
};

ActiveSourceTree.prototype.onBrowserMutateText =
function(aEvent)
{
  if (!this.mMutationsEnabled)
    return;

  this.mMutationsEnabled = false;

  var target = aEvent.target;
  var sourceViewID = target.getUserData("sourceViewID");
  var sourceDoc = this.mSourceTreeXULElement.contentDocument;
  var sourceTarget = sourceDoc.getElementById(sourceViewID);
  sourceTarget.firstChild.firstChild.data = target.data;

  this.mMutationsEnabled = true;
};

ActiveSourceTree.prototype.onBrowserSelectionChanged =
function(aArgs, aElt, aOneElementSelected)
{
  if (!this.mMutationsEnabled)
    return;

  var elt = EditorUtils.getSelectionContainer().node;
  var sourceViewID = elt.getUserData("sourceViewID");
  var sourceDoc = this.mSourceTreeXULElement.contentDocument;
  var sourceElt = sourceDoc.getElementById(sourceViewID);
  var e = sourceElt;
  if (!e)
    return;
  while (e)
  {
    if (e.nodeType == Node.ELEMENT_NODE &&
        e.nodeName.toLowerCase() == "li")
      e.setAttribute("open", "true");
    e = e.parentNode;
  }
  this.ensureElementIsVisible(this.mSourceTreeXULElement, sourceElt);

  sourceElt.setAttribute("selected", "true");
  if (this.mOldSelectedLi && this.mOneEltSelected)
  {
    this.mOldSelectedLi.removeAttribute("selected");
  }
  this.mOneEltSelected = true;
  this.mOldSelectedLi = sourceElt;
};

ActiveSourceTree.prototype.onSourceViewMouseMove =
function(aEvent)
{
  if (!this.mMutationsEnabled)
    return;

  if (this.mOneEltSelected)
    return;
  this._onSourceViewMouseMove(aEvent);
};


ActiveSourceTree.prototype._onSourceViewMouseMove =
function(aEvent)
{
  var e = aEvent.originalTarget;
  if (!e)
    return;
  if (e != this.mOldSourceElt &&
      this.mOldSourceElt &&
      this.mOldSourceElt.style)
  {
    //this.mOldSourceElt.style.outline = "";
    if (this.mOldSelectedLi)
      this.mOldSelectedLi.removeAttribute("selected");
  }
  this.mOldSourceElt = null;

  var tagName = e.nodeName.toLowerCase();
  if (tagName != "li" &&
      tagName != "span" &&
      tagName != "#text")
    return;

  if (tagName != "li")
    e = e.parentNode;
  if (this.mOneEltSelected)
    this.mOldSelectedLi = e;
  e = e.getUserData("originalNode");
  if (e && e.style)
  {
    this.flash(EditorUtils.getCurrentEditorElement(), e);
  }
};

ActiveSourceTree.prototype.ensureElementIsVisible =
function(aXULContainer, aHTMLElement)
{
  var y = 0;
  while (aHTMLElement)
  {
    y += aHTMLElement.offsetTop;
    aHTMLElement = aHTMLElement.offsetParent;
  }
  aXULContainer.contentWindow.scroll(0, Math.max(0, y - 10));
};

ActiveSourceTree.prototype.flash =
function(aXULContainer, aHTMLElement)
{
  this.mOldSourceElt = aHTMLElement;
  //aHTMLElement.style.outline = "blue solid 2px";

  this.ensureElementIsVisible(aXULContainer, aHTMLElement);
};

ActiveSourceTree.prototype.onSourceViewClick =
function(aEvent)
{
  if (!this.mMutationsEnabled)
    return;

  var e = aEvent.explicitOriginalTarget;
  var p = e.parentNode;
  var currentTag = e.nodeName.toLowerCase();
  if (e.nodeType == Node.TEXT_NODE &&
      p.nodeType == Node.ELEMENT_NODE)
  {
    if (p.className == "tagName")
    {
      var li = p.parentNode;
      li.setAttribute("selected", "true");
      this.mOneEltSelected = true;
      this._onSourceViewMouseMove(
          { originalTarget: li }
        );
    }
    else if (p.className == "textNode" ||
             p.className == "attrName" ||
             p.className == "attrValue")
    {
      this.mEditing = true;
      this.mEditedNode = p;
      this.mOneEltSelected = true;
      switch (p.className)
      {
        case "textNode":
          this._onSourceViewMouseMove(
            { originalTarget: p.parentNode.parentNode.firstChild }
          );
          break;
        case "attrName":
        case "attrValue":
          this._onSourceViewMouseMove(
            { originalTarget: p.parentNode }
          );
          break;
        default: break;
      }
    }
  }
  else if (this.mOneEltSelected &&
           (currentTag == "li" ||
            currentTag == "ul" ||
            currentTag == "body"))
  {
    this.mOneEltSelected = false;
    if (this.mOldSelectedLi)
      this.mOldSelectedLi.removeAttribute("selected");
    this.mOldSelectedLi = null;
  }
};

ActiveSourceTree.prototype.getIndexOfNode =
function getIndexOfNode(aNode)
{
  if (aNode)
  {
    // the following 3 lines are an excellent suggestion from Neil Rashbrook
    var range = aNode.ownerDocument.createRange();
    range.selectNode(aNode);
    return range.startOffset;
  }
  return null;
};

ActiveSourceTree.prototype.onSourceViewKeyPress =
function(aEvent)
{
  if (!this.mMutationsEnabled)
    return;

  if (aEvent.keyCode == 27 && // ESCAPE KEY
      this.mEditing &&
      this.mEditedNode)
  {
    this.mEditing = false;
    this.mEditedNode.blur();
    this.mEditedNode = null;
  }
};

ActiveSourceTree.prototype.onSourceViewMutateText = function(aEvent)
{
  if (!this.mMutationsEnabled)
    return;

  this.mMutationsEnabled = false;

  var e = aEvent.originalTarget; 
  if (e.parentNode.nodeName.toLowerCase() == "span")
  {
    
    var type = e.parentNode.className;
    if (type != "textNode" &&
        type != "attrName" &&
        type != "attrValue")
      return;

    
    switch (e.parentNode.className)
    {
      case "textNode":
        {
          var textNode = e.parentNode.parentNode.getUserData("originalNode");
          var txn = new diTextNodeChangedTxn(this, textNode, e.data);
          EditorUtils.getCurrentEditor().transactionManager.doTransaction(txn);          
        }
        break;
      case "attrValue":
        {
          var targetElement = e.parentNode.parentNode.getUserData("originalNode");
          var attrName = e.parentNode.getAttribute("originalattrname");
          var txn = new diAttrChangedTxn(this, targetElement, attrName, e.data);
          EditorUtils.getCurrentEditor().transactionManager.doTransaction(txn);  
        }
        break;
        case "attrName":
        {
          var targetElement = e.parentNode.parentNode.getUserData("originalNode");
          var attrName = e.parentNode.getAttribute("originalattrname");
          var newName = e.data;
          var txn = new diAttrNameChangedTxn(this, targetElement, attrName, newName);
          EditorUtils.getCurrentEditor().transactionManager.doTransaction(txn);
          e.parentNode.setAttribute("originalattrname", newName);
          e.parentNode.nextSibling.nextSibling.setAttribute("originalattrname", newName);
        }
        break;
      default:
        break;
    }
  }

  this.mMutationsEnabled = true;

};

ActiveSourceTree.prototype.onBrowserMutateAttribute =
function(aEvent)
{
  if (!this.mMutationsEnabled)
    return;

  var target = aEvent.target;

  var attrChange = aEvent.attrChange;
  var attrName = aEvent.attrName;
  var newValue = aEvent.newValue;

  // early way out in case of a scrollbar change
  if (attrName == "curpos" ||
      attrName.substr(0, 4) == "_moz")
    return;

  this.mMutationsEnabled = false;

  var sourceViewID = target.getUserData("sourceViewID");
  var sourceDoc = this.mSourceTreeXULElement.contentDocument;
  var sourceElt = sourceDoc.getElementById(sourceViewID);

  switch (attrChange)
  {
    case MutationEvent.ADDITION:
    case MutationEvent.MODIFICATION: break;
    case MutationEvent.REMOVAL: break;
    default: break;
  }

  var child = sourceElt.firstChild;
  while (child && child.nodeName.toLowerCase() != "ul")
  {
    var tmp = child.nextSibling;
    sourceElt.removeChild(child);
    child = tmp;
  }

  this.createSourceViewForElementNode(sourceDoc, target, sourceElt.parentNode, sourceElt);
  if (sourceElt.firstChild.nodeName.toLowerCase() == "ul")
    sourceElt.appendChild(sourceElt.firstChild);

  this.mMutationsEnabled = true;
};


/********************** diTextNodeChangedTxn **********************/

function diTextNodeChangedTxn(aContext, aNode, aData)
{
  this.mContext = aContext;
  this.mNode = aNode;
  this.mOldData = aNode.data;
  this.mNewData = aData;
}

diTextNodeChangedTxn.prototype = {

  getNode:    function() { return this.mNode; },
  getOldData: function() { return this.mOldData; },
  getNewData: function() { return this.mNewData; },

  QueryInterface : function(aIID)
  {
    if (aIID.equals(Components.interfaces.nsITransaction) ||
        aIID.equals(Components.interfaces.diITextNodeChangedTxn) ||
        aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
        aIID.equals(Components.interfaces.nsISupports))
      return this;
    throw Components.results.NS_NOINTERFACE;
  },

  doTransaction: function()
  {
    this.mNode.data = this.mNewData;
  },

  undoTransaction: function()
  {
    this.mNode.data = this.mOldData;
  },

  redoTransaction: function()
  {
    this.doTransaction();
  },

  isTransient: false,

  merge: function(aTransaction)
  {
    var txn = aTransaction.QueryInterface(Components.interfaces.diITextNodeChangedTxn);
    if (txn)
    {
      if (this.getNode() == txn.getNode())
      {
        if (this.mContext.mRefuseNextMergeTransaction)
          this.mContext.mRefuseNextMergeTransaction = false;
        else
        {
          this.mNewData = txn.getNewData();
          return true;
        }
      }
    }
    return false;
  }
};

/********************** diAttrChangedTxn **********************/

function diAttrChangedTxn(aContext, aNode, aAttrName, aData)
{
  this.mContext = aContext;
  this.mNode = aNode;
  this.mAttrName = aAttrName;
  this.mAttrWasSet = this.mNode.hasAttribute(this.mAttrName);
  this.mOldData = this.mNode.getAttribute(this.mAttrName);
  this.mNewData = aData;
}

diAttrChangedTxn.prototype = {

  getNode:          function() { return this.mNode; },
  getOldData:       function() { return this.mOldData; },
  getNewData:       function() { return this.mNewData; },
  getAttributeName: function() { return this.mAttrName; },

  QueryInterface : function(aIID)
  {
    if (aIID.equals(Components.interfaces.nsITransaction) ||
        aIID.equals(Components.interfaces.diIAttrChangedTxn) ||
        aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
        aIID.equals(Components.interfaces.nsISupports))
      return this;
    throw Components.results.NS_NOINTERFACE;
  },

  doTransaction: function()
  {
    this.mNode.setAttribute(this.mAttrName, this.mNewData);
  },

  undoTransaction: function()
  {
    if (this.mAttrWasSet)
      this.mNode.setAttribute(this.mAttrName, this.mOldData);
    else
      this.mNode.removeAttribute(this.mAttrName);
  },

  redoTransaction: function()
  {
    this.doTransaction();
  },

  isTransient: false,

  merge: function(aTransaction)
  {
    var txn = aTransaction.QueryInterface(Components.interfaces.diIAttrChangedTxn);
    if (txn)
    {
      if (this.getNode() == txn.getNode() &&
          this.getAttributeName() == txn.getAttributeName())
      {
        if (this.mContext.mRefuseNextMergeTransaction)
          this.mContext.mRefuseNextMergeTransaction = false;
        else
        {
          this.mNewData = txn.getNewData();
          return true;
        }
      }
    }
    return false;
  }
};

/********************** diAttrNameChangedTxn **********************/

function diAttrNameChangedTxn(aContext, aNode, aOldAttrName, aNewAttrName)
{
  this.mContext = aContext;
  this.mNode = aNode;
  this.mOldAttrName = aOldAttrName;
  this.mNewAttrName = aNewAttrName;

  this.mValue = this.mNode.getAttribute(this.mOldAttrName);
}

diAttrNameChangedTxn.prototype = {

  getNode:             function() { return this.mNode; },
  getNewAttributeName: function() { return this.mNewAttrName; },


  QueryInterface : function(aIID)
  {
    if (aIID.equals(Components.interfaces.nsITransaction) ||
        aIID.equals(Components.interfaces.diIAttrNameChangedTxn) ||
        aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
        aIID.equals(Components.interfaces.nsISupports))
      return this;
    throw Components.results.NS_NOINTERFACE;
  },

  doTransaction: function()
  {
    this.mNode.removeAttribute(this.mOldAttrName);
    this.mNode.setAttribute(this.mNewAttrName, this.mValue);
  },

  undoTransaction: function()
  {
    this.mNode.removeAttribute(this.mNewAttrName);
    this.mNode.setAttribute(this.mOldAttrName, this.mValue);
  },

  redoTransaction: function()
  {
    this.doTransaction();
  },

  isTransient: false,

  merge: function(aTransaction)
  {
    var txn = aTransaction.QueryInterface(Components.interfaces.diIAttrChangedTxn);
    if (txn)
    {
      if (this.getNode() == txn.getNode())
      {
        if (this.mContext.mRefuseNextMergeTransaction)
          this.mContext.mRefuseNextMergeTransaction = false;
        else
        {
          this.mNewAttrName = txn.getNewAttributeName();
          return true;
        }
      }
    }
    return false;
  }
};
