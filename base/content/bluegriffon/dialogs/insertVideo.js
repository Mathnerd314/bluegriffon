Components.utils.import("resource://gre/modules/editorHelper.jsm");
Components.utils.import("resource://gre/modules/urlHelper.jsm");
Components.utils.import("resource://gre/modules/prompterHelper.jsm");

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
  CheckURL('urlPosterTextbox', 'relativeURLPosterCheckbox');
}

function InitDialog()
{
  if (!gNode || gNode.nodeName.toLowerCase() != "video") {
    gNode = null;
    return;
  }
  
  gDialog.widthTextbox.value = gNode.hasAttribute("width") ? gNode.getAttribute("width") : "";
  gDialog.heightTextbox.value = gNode.hasAttribute("height") ? gNode.getAttribute("height") : "";
  gDialog.preloadMenulist.value = gNode.hasAttribute("preload") ? gNode.getAttribute("preload") : "";
  gDialog.videoControlsCheckbox.checked = gNode.hasAttribute("controls");
  gDialog.autoplayCheckbox.checked = gNode.hasAttribute("autoplay");
  gDialog.loopCheckbox.checked = gNode.hasAttribute("loop");

  gDialog.urlTextbox.value = gNode.getAttribute("src");
  gDialog.urlPosterTextbox.value = gNode.hasAttribute("poster") ? gNode.getAttribute("poster") : "";
  if (gDialog.urlTextbox.value) {
    LoadVideoFile();
    CheckURL('urlTextbox', 'relativeURLCheckbox')
  }

  if (gDialog.urlPosterTextbox.value) {
    LoadPosterFile();
    CheckURL('urlPosterTextbox', 'relativeURLPosterCheckbox');
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

function LoadVideoFile()
{
  gDialog.preview.setAttribute("src", UrlUtils.makeAbsoluteUrl(gDialog.urlTextbox.value));
}

function LoadPosterFile()
{
  gDialog.previewPoster.setAttribute("src", UrlUtils.makeAbsoluteUrl(gDialog.urlPosterTextbox.value));
}

function VideoLoaded()
{
  gDialog.videoPreviewBox.hidden = false;
  document.documentElement.getButton("accept").disabled = false;
  if (gDialog.widthTextbox)
    gDialog.preview.setAttribute("width", gDialog.widthTextbox);
  if (gDialog.heightTextbox)
    gDialog.preview.setAttribute("height", gDialog.heightTextbox);
  window.sizeToContent();
}


function CantLoadVideo()
{
  gDialog.videoPreviewBox.hidden = true;
  document.documentElement.getButton("accept").disabled = gDialog.urlTextbox.value || !gNode;
  window.sizeToContent();
}

function PosterLoaded()
{
  gDialog.posterPreviewBox.hidden = false;
  gDialog.savePosterAsFileButton.hidden =
    (gDialog.urlPosterTextbox.value.trim().substr(0, 5) != "data:");
  window.sizeToContent();
}

function CantLoadPoster()
{
  gDialog.posterPreviewBox.hidden = true;
  window.sizeToContent();
}

function UseCurrentFrameAsPoster()
{
  try {
    var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
    canvas.style.width = gDialog.preview.videoWidth + "px";
    canvas.setAttribute("width", gDialog.preview.videoWidth);
    canvas.style.height = gDialog.preview.videoHeight + "px";
    canvas.setAttribute("height", gDialog.preview.videoHeight);
    canvas.style.display = "none";
    var ctx = canvas.getContext("2d");
	  ctx.drawImage(gDialog.preview, 0, 0);
	  gDialog.urlPosterTextbox.value = canvas.toDataURL();
	  gDialog.tabbox.selectedTab = gDialog.posterTab;
    LoadPosterFile();
  }
  catch(e) {alert(e)}
}

function CheckPixels(aElt)
{
  aElt.value = aElt.value.replace( /[^0-9]/g , "");
}

function onAccept()
{
  gEditor.beginTransaction();


  var nodeCreated = false;
  if (!gNode) {
    gNode = EditorUtils.getCurrentDocument().createElement("video");
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

    setAttribute("poster",   gDialog.urlPosterTextbox.value);
    setAttribute("preload",  gDialog.preloadMenulist.value);
    setAttribute("width",    gDialog.widthTextbox.value);
    setAttribute("height",   gDialog.heightTextbox.value);
    setAttribute("controls", gDialog.videoControlsCheckbox.checked ? "controls" : "");
    setAttribute("autoplay", gDialog.autoplayCheckbox.checked ? "autoplay" : "");
    setAttribute("loop",     gDialog.loopCheckbox.checked ? "loop" : "");

    if (nodeCreated) {
	      try {
          // monster hack because insertElementAtSelection() fails on <video>
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

function SavePosterAsFile()
{
  try {
    var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
    canvas.style.width = gDialog.previewPoster.naturalWidth + "px";
    canvas.setAttribute("width", gDialog.previewPoster.naturalWidth);
    canvas.style.height = gDialog.previewPoster.naturalHeight + "px";
    canvas.setAttribute("height", gDialog.previewPoster.naturalHeight);
    canvas.style.display = "none";
    var ctx = canvas.getContext("2d");
    ctx.drawImage(gDialog.previewPoster, 0, 0);

    fp = Components.classes["@mozilla.org/filepicker;1"]
           .createInstance(Components.interfaces.nsIFilePicker);
    fp.init(window, gDialog.bundleString.getString("SavePosterAsPng"), 1);
    fp.appendFilter(gDialog.bundleString.getString("PNGFiles"), "*.png");

    if (fp.show() == Components.interfaces.nsIFilePicker.returnCancel)
      return;

    var file = fp.file;
	
	  // create a data url from the canvas and then create URIs of the source and targets  
	  var io = Components.classes["@mozilla.org/network/io-service;1"]
	                     .getService(Components.interfaces.nsIIOService);
	  var source = io.newURI(canvas.toDataURL("image/png", ""), "UTF8", null);
	  var target = io.newFileURI(file)
	    
	  // prepare to save the canvas data
	  var persist = Components.classes["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"]
	                          .createInstance(Components.interfaces.nsIWebBrowserPersist);
	  
	  persist.persistFlags = Components.interfaces.nsIWebBrowserPersist.PERSIST_FLAGS_REPLACE_EXISTING_FILES;
	  persist.persistFlags |= Components.interfaces.nsIWebBrowserPersist.PERSIST_FLAGS_AUTODETECT_APPLY_CONVERSION;
	  
	  // save the canvas data to the file
	  persist.saveURI(source, null, null, null, null, file);
    gDialog.urlPosterTextbox.value = fp.fileURL.spec;
    LoadPosterFile();
    CheckURL('urlPosterTextbox', 'relativeURLPosterCheckbox');
  }
  catch(e) {alert(e)}
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