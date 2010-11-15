Components.utils.import("resource://app/modules/editorHelper.jsm");
Components.utils.import("resource://app/modules/urlHelper.jsm");
Components.utils.import("resource://app/modules/prompterHelper.jsm");

var gDoc = null;
var gNode = null;
var gDocUrlScheme = null;
var gEditor = null;

function Startup()
{
  gNode = window.arguments[0];
  gEditor = EditorUtils.getCurrentEditor();

  var docUrl = EditorUtils.getDocumentUrl();
  gDocUrlScheme = UrlUtils.getScheme(docUrl);

  GetUIElements();

  if (!gNode)
    document.documentElement.getButton("accept").disabled = true;

  InitDialog();
  CheckURL('urlTextbox', 'relativeURLCheckbox');
}

function InitDialog()
{
  if (!gNode || gNode.nodeName.toLowerCase() != "audio") {
    gNode = null;
    return;
  }
  
  gDialog.preloadMenulist.value = gNode.hasAttribute("preload") ? gNode.getAttribute("preload") : "";
  gDialog.audioControlsCheckbox.checked = gNode.hasAttribute("controls");
  gDialog.autoplayCheckbox.checked = gNode.hasAttribute("autoplay");
  gDialog.loopCheckbox.checked = gNode.hasAttribute("loop");

  gDialog.urlTextbox.value = gNode.getAttribute("src");
  if (gDialog.urlTextbox.value) {
    LoadAudioFile();
    CheckURL('urlTextbox', 'relativeURLCheckbox')
  }
}

function CheckURL(aTextboxId, aCheckboxId)
{
  var url = gDialog[aTextboxId].value;
  if (url) {
    gDialog[aCheckboxId].disabled = !(gDocUrlScheme && gDocUrlScheme != "resource");
    gDialog[aCheckboxId].checked = (url == UrlUtils.makeRelativeUrl(url));
  }
  else {
    gDialog[aCheckboxId].checked = false;
    gDialog[aCheckboxId].disabled = true;
  }
}

function MakeRelativeUrl(aTextboxId, aCheckboxId)
{
  var spec = gDialog[aTextboxId].value;
  if (gDocUrlScheme && gDocUrlScheme != "resource") {
    spec = UrlUtils.makeRelativeUrl(spec);
    gDialog[aTextboxId].value = spec;
    gDialog[aCheckboxId].checked = true;
  }
}

function MakeAbsoluteUrl(aTextboxId, aCheckboxId)
{
  var spec = gDialog[aTextboxId].value;
  if (gDocUrlScheme && gDocUrlScheme != "resource") {
    spec = UrlUtils.makeAbsoluteUrl(spec);
    gDialog[aTextboxId].value = spec;
    gDialog[aCheckboxId].checked = false;
  }
}

function ToggleRelativeOrAbsolute(aTextboxId, aCheckboxId)
{
  if (gDialog[aCheckboxId].checked) {
    MakeRelativeUrl(aTextboxId, aCheckboxId);
  }
  else {
    MakeAbsoluteUrl(aTextboxId, aCheckboxId);
  }
}

function LoadAudioFile()
{
  gDialog.preview.setAttribute("src", UrlUtils.makeAbsoluteUrl(gDialog.urlTextbox.value));
}

function AudioLoaded()
{
  gDialog.audioPreviewBox.hidden = false;
  document.documentElement.getButton("accept").disabled = false;
  window.sizeToContent();
}


function CantLoadAudio()
{
  gDialog.audioPreviewBox.hidden = true;
  document.documentElement.getButton("accept").disabled = gDialog.urlTextbox.value || !gNode;
  window.sizeToContent();
}

function onAccept()
{
  gEditor.beginTransaction();


  var nodeCreated = false;
  if (!gNode) {
    gNode = EditorUtils.getCurrentDocument().createElement("audio");
    nodeCreated = true;
  }

  if (gDialog.urlTextbox.value) {
    function setAttribute(aName, aValue) {
      if (aValue)
        gEditor.setAttribute(gNode, aName, aValue);
      else
        gEditor.removeAttribute(gNode, aName);
    }
    gEditor.setAttribute(gNode, "src", gDialog.urlTextbox.value);

    setAttribute("preload",  gDialog.preloadMenulist.value);
    setAttribute("controls", gDialog.audioControlsCheckbox.checked ? "controls" : "");
    setAttribute("autoplay", gDialog.autoplayCheckbox.checked ? "autoplay" : "");
    setAttribute("loop",     gDialog.loopCheckbox.checked ? "loop" : "");

    if (nodeCreated) {
        try {
          // monster hack because insertElementAtSelection() fails on <audio>
          var p = gEditor.document.createElement("span");
          p.appendChild(gEditor.document.createElement("br"));
          
          p.appendChild(gNode);
          gEditor.insertElementAtSelection(p, true);
          txn = new diNodeInsertionTxn(gNode,
                                       p.parentNode,
                                       p.nextSibling);
          gEditor.transactionManager.doTransaction(txn);
          gEditor.deleteNode(p);
        }
        catch(e) {alert(e)}
    }
  }
  else
    gEditor.deleteNode(gNode);

  gEditor.endTransaction();
  return true;
}

/********************** diNodeInsertionTxn **********************/

function diNodeInsertionTxn(aNode, aParent, aRef)
{
  this.mNode = aNode;
  this.mParent = aParent;
  this.mRef = aRef;
}

diNodeInsertionTxn.prototype = {

  getNode:    function() { return this.mNode; },

  QueryInterface : function(aIID)
  {
    if (aIID.equals(Components.interfaces.nsITransaction) ||
        aIID.equals(Components.interfaces.diINodeInsertionTxn) ||
        aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
        aIID.equals(Components.interfaces.nsISupports))
      return this;
    throw Components.results.NS_NOINTERFACE;
  },

  doTransaction: function()
  {
    this.mParent.insertBefore(this.mNode, this.mRef);
  },

  undoTransaction: function()
  {
    this.mNode.parentNode.removeChild(this.mNode);
  },

  redoTransaction: function()
  {
    this.doTransaction();
  },

  isTransient: false,

  merge: function(aTransaction)
  {
    return false;
  }
};
