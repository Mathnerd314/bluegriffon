function onBespinFocus()
{
  gDialog.bespinIframe.focus();
}

function onBespinLineBlur(aElt)
{
  aElt.value = "";
}

function onBespinLineKeypress(aEvent, aElt)
{
  if (aEvent.keyCode == 13) {
    var line = aElt.value;
    BlueGriffonVars.bespinEditor.setLineNumber(parseInt(line));
    onBespinLineBlur(aElt);
    onBespinFocus();
  }
}

function ToggleBespinFindCaseSensitivity()
{
  BlueGriffonVars.bespinEditor.setCursor(BlueGriffonVars.bespinSelPoint);
  BespinFind(BlueGriffonVars.bespinFindLastDirection);
}

function BespinFind(aForward, aInitial)
{
  BlueGriffonVars.bespinFindLastDirection = aForward;
  var query = gDialog.bespinFindTextbox.value;
  var isCaseSensitive = gDialog.bespinFindCaseSensitive.checked;
  var searchController = BlueGriffonVars.bespinEditor.searchController;
  searchController.setSearchText(query, false, isCaseSensitive);
  var range;
  if (aForward) {
    if (aInitial)
      BlueGriffonVars.bespinSelPoint = BlueGriffonVars.bespinEditor.selection.start;
    else
      BlueGriffonVars.bespinSelPoint = BlueGriffonVars.bespinEditor.selection.end;
    range = searchController.findNext(BlueGriffonVars.bespinSelPoint, true);
  }
  else {
    BlueGriffonVars.bespinSelPoint = BlueGriffonVars.bespinEditor.selection.start;
    range = searchController.findPrevious(BlueGriffonVars.bespinSelPoint, true);
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
    BlueGriffonVars.bespinEditor.setLineNumber(range.start.row + 1);
    BlueGriffonVars.bespinEditor.setCursor(range.start);
    BlueGriffonVars.bespinEditor.selection = range;
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
    gDialog.bespinIframe.focus();
  }
}

function BespinKeyPressCallback(aEvent)
{
  if (aEvent.metaKey &&
      !aEvent.ctrlKey &&
      !aEvent.altKey) {
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
	      {
	        aEvent.preventDefault();
          var selection = BlueGriffonVars.bespinEditor.selectedText;
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
        break;
      default:
        break;
    }
  }
}

