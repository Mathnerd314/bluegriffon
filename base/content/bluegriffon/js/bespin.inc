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

