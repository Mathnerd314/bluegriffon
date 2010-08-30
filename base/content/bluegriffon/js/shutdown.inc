function Shutdown()
{
  window.removeEventListener("deactivate", DeactivateMainWindow, true);

  try {
    var pbi = GetPrefs().QueryInterface(Components.interfaces.nsIPrefBranchInternal);
    pbi.removeObserver("bluegriffon.", BlueGriffonPrefsObserver, false);
  } catch(ex) {
    dump("Failed to stop observing prefs: " + ex + "\n");
  }

  gDialog.structurebar.shutdown();
  ResizeEventNotifier.shutdown();
  EditorScrolledNotifier.shutdown();
  BGZoomManager.shutdown();

  // persist floating panels' position
  var panels = document.querySelectorAll('panel[floating="true"]');
  for (var i = 0; i < panels.length; i++) {
    if (panels[i].popupBoxObject.popupState == "open") {
      panels[i].persistPosition();
    }
  }
}

function onClose()
{
  if (doSaveTabsBeforeQuit()) {
    Shutdown();
    return true;
  }
  return false;
}