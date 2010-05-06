function Shutdown()
{
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
}

function onClose()
{
  if (doSaveTabsBeforeQuit()) {
    Shutdown();
    return true;
  }
  return false;
}