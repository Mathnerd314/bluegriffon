var gContentWindow = null;

function Startup()
{
  SetLocationDB();
  var url = null;
  // do we have a URL to open ?
  if (window.arguments.length == 2)
    url = window.arguments[1];

  GetUIElements();

  // let's finish with the url
  if (url)
    OpenFile(url, true);

  ComposerCommands.setupMainCommands();
  window.updateCommands("style");

  InstallCustomizationDoneCallbacks();

  gDialog.structurebar.init();

  ResizeEventNotifier.startup();
  EditorScrolledNotifier.startup();
  BGZoomManager.startup();
  BGUpdateManager.check();

  try {
    var pbi = GetPrefs().QueryInterface(Components.interfaces.nsIPrefBranchInternal);
    pbi.addObserver("bluegriffon.", BlueGriffonPrefsObserver, false);
  } catch(ex) {
    dump("Failed to observe prefs: " + ex + "\n");
  }

  if ("ProjectManager" in window)
    ProjectManager.init();

  window.addEventListener("deactivate", DeactivateMainWindow, true);
  BlueGriffonPanels.init();
}

