Components.utils.import("resource://app/modules/urlHelper.jsm");
Components.utils.import("resource://app/modules/editorHelper.jsm");
Components.utils.import("resource://app/modules/Services.jsm");

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
    dump("Failed to observe prefs: " + ex + "\n");
  }

  // let's finish with the url
  if (url)
    setTimeout(OpenFile, 100, url, true);

  window.tryToClose = doSaveTabsBeforeQuit;
}

function foodoo()
{
var catMan = Components.classes["@mozilla.org/categorymanager;1"].getService(Components.interfaces.nsICategoryManager);

  var foo = catMan.enumerateCategories();
  var tmp = "";
  while (foo.hasMoreElements()) {
    var bar = foo.getNext();
    tmp += 'Category: ' + bar.QueryInterface(Components.interfaces.nsISupportsCString).data + "\n";
    var item = catMan.enumerateCategory(bar.QueryInterface(Components.interfaces.nsISupportsCString).data);
    while(item.hasMoreElements()) {
      var subitem = item.getNext();
      var tmp2 = subitem.QueryInterface(Components.interfaces.nsISupportsCString).data;
      tmp += "\t" + tmp2 + "\n";
    }
  }
  Services.prompt.alert(null, "foo", tmp)
}
