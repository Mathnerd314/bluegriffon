Components.utils.import("resource://app/modules/urlHelper.jsm");
Components.utils.import("resource://app/modules/editorHelper.jsm");
Components.utils.import("resource://app/modules/bgQuit.jsm");

var gContentWindow = null;

function Startup()
{
  SetLocationDB();
  var url = null;
  // do we have a URL to open ?
  try {
    if (window.arguments && window.arguments[0]) {
      var cl = window.arguments[0];
      if (cl && cl instanceof Components.interfaces.nsISupportsArray) {
        url = cl.GetElementAt(0).QueryInterface(Components.interfaces.nsISupportsString).data;
        var localFile = UrlUtils.newLocalFile(url);
        var ioService =
          Components.classes["@mozilla.org/network/io-service;1"]
                    .getService(Components.interfaces.nsIIOService);
        var fileHandler =
          ioService.getProtocolHandler("file")
                   .QueryInterface(Components.interfaces.nsIFileProtocolHandler);
        url = fileHandler.getURLSpecFromFile(localFile);
      }
    }
    else if (window.arguments.length >= 2 &&
             window.arguments[1])
      url = window.arguments[1];
  }
  catch(e) { url = null; }

  GetUIElements();

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
  }

  // let's finish with the url
  if (url)
    setTimeout(OpenFile, 100, url, true);

  setTimeout(LoadLastTabs, 1000);
  BlueGriffonQuitHelper.init();
}

var gLastTabsArray;
function LoadLastTabs()
{
  var lastTabs = "";
  gLastTabsArray = [];
  try {
    lastTabs = GetPrefs().getCharPref("bluegriffon.defaults.lastTabs");
    GetPrefs().setCharPref("bluegriffon.defaults.lastTabs", "");
  }
  catch(e) {}
  if (lastTabs) {
    gLastTabsArray = lastTabs.split("|");
    //gLastTabsArray.reverse();
    NotifierUtils.addNotifierCallback("tabCreated", OpenTabFromPreviousSession);
    var url = gLastTabsArray.pop();
    OpenFile(url, true);
  }
}

function OpenTabFromPreviousSession(aReason, aContext)
{
  if (gLastTabsArray.length) {
    var url = gLastTabsArray.pop();
    OpenFile(url, true);
  }
  else {
    NotifierUtils.removeNotifierCallback("tabCreated", OpenTabFromPreviousSession);
  }
}

