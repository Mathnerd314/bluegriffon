function onBespinFocus(aIframe)
{
  aIframe.focus();
}

function onBespinLineBlur(aElt)
{
  aElt.value = "";
}

function onBespinLineKeypress(aEvent, aElt)
{
  if (aEvent.keyCode == 13) {
    var line = aElt.value;
    EditorUtils.getCurrentSourceEditor().setLineNumber(parseInt(line));
    onBespinLineBlur(aElt);
    onBespinFocus();
  }
}

function ToggleBespinFindCaseSensitivity()
{
  var bespinIframe = EditorUtils.getCurrentSourceEditorElement(); 
  var selPoint = bespinIframe.getUserData("selPoint");
  EditorUtils.getCurrentSourceEditor().setCursor(selPoint);
  BespinFind(bespinIframe.getUserData("findLastDirection"));
}

function BespinFind(aForward, aInitial)
{
  var bespinIframe = EditorUtils.getCurrentSourceEditorElement();
  var bespinEditor = EditorUtils.getCurrentSourceEditor();
  bespinIframe.setUserData("findLastDirection", aForward, null);
  var query = gDialog.bespinFindTextbox.value;
  var isCaseSensitive = gDialog.bespinFindCaseSensitive.checked;
  var searchController = bespinEditor.searchController;
  searchController.setSearchText(query, false, isCaseSensitive);
  var range;
  if (aForward) {
    if (aInitial)
      bespinIframe.setUserData("selPoint", bespinEditor.selection.start, null);
    else
      bespinIframe.setUserData("selPoint", bespinEditor.selection.end, null);
    range = searchController.findNext(bespinIframe.getUserData("selPoint"), true);
  }
  else {
    bespinIframe.setUserData("selPoint", bespinEditor.selection.start, null);
    range = searchController.findPrevious(bespinIframe.getUserData("selPoint"), true);
  }

  if (!range) {
    gDialog.bespinFindCaseSensitive.hidden = true;
    gDialog.bespinFindPrevious.hidden = true;
    gDialog.bespinFindNext.hidden = true;
    gDialog.bespinFindTextbox.className = "notfound";
  } else {
    gDialog.bespinFindCaseSensitive.hidden = false;
    gDialog.bespinFindPrevious.hidden = false;
    gDialog.bespinFindNext.hidden = false;
    gDialog.bespinFindTextbox.className = "";
    bespinEditor.setLineNumber(range.start.row + 1);
    bespinEditor.setCursor(range.start);
    bespinEditor.selection = range;
  }
}

function onBespinFindClear(aEvent, aElt)
{
  if (!aElt.value) {
    aElt.className = "";
    gDialog.bespinFindCaseSensitive.hidden = true;
    gDialog.bespinFindPrevious.hidden = true;
    gDialog.bespinFindNext.hidden = true;
  }
}

function onBespinFindKeypress(aEvent)
{
  if (aEvent.keyCode == 27 && !aEvent.which) { // ESC key
    EditorUtils.getCurrentSourceEditorElement().focus();
  }
}

function BespinKeyPressCallback(aEvent)
{
#ifdef XP_MACOSX
  if (aEvent.metaKey &&
      !aEvent.ctrlKey &&
      !aEvent.altKey) {
#else
  if (!aEvent.metaKey &&
      aEvent.ctrlKey &&
      !aEvent.altKey) {
#endif
    switch (aEvent.which) {
      case 102: // meta-f
        aEvent.preventDefault();
        gDialog.bespinFindTextbox.focus();
        break;
      case 108: // meta-l
        aEvent.preventDefault();
        gDialog.bespinLineTextbox.focus();
        break;
      case 99: // meta-c XXX Workaround for Copy horked in Bespin0.9+Gecko2
      case 120: // meta-x XXX
	      {
	        aEvent.preventDefault();
          var bespinEditor = EditorUtils.getCurrentSourceEditor();
          var selection = bespinEditor.selectedText;
	        var clipboardSvc = Components.classes["@mozilla.org/widget/clipboard;1"].
	                           getService(Components.interfaces.nsIClipboard);
	        var xferable = Components.classes["@mozilla.org/widget/transferable;1"].
	                       createInstance(Components.interfaces.nsITransferable);
          xferable.addDataFlavor("text/unicode");
			    var s = Components.classes["@mozilla.org/supports-string;1"].
			            createInstance(Components.interfaces.nsISupportsString);
			    s.data = selection;
          xferable.setTransferData("text/unicode", s, selection.length * 2);
          clipboardSvc.setData(xferable, null, Components.interfaces.nsIClipboard.kGlobalClipboard);
	      }
        if (aEvent.which == 120)
          bespinEditor.selectedText = "";
        break;
      default:
        break;
    }
  }
}

