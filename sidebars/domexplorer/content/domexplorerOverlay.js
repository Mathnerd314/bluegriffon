// LINUX ONLY :-(
function start_domexplorer()
{
  var w = null;
  try {
    var windowManager = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService();
    w = windowManager.QueryInterface(Components.interfaces.nsIWindowMediator).getMostRecentWindow("BlueGriffon:DOMExplorer");
  }
  catch(e){}
  if (w)
    w.focus();
  else
    window.open('chrome://domexplorer/content/domexplorer.xul',"_blank",
               "chrome,resizable,scrollbars=yes");
}

