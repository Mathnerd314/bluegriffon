function OnAdvancedPaneLoad()
{
  GetUIElements();

	try {
	  // Query available and selected locales
	  
	  var chromeRegService = Components.classes["@mozilla.org/chrome/chrome-registry;1"].getService();
	  var xulChromeReg = chromeRegService.QueryInterface(Components.interfaces.nsIXULChromeRegistry);
	  var toolkitChromeReg = chromeRegService.QueryInterface(Components.interfaces.nsIToolkitChromeRegistry);

	  var selectedLocale = xulChromeReg.getSelectedLocale("bluegriffon");
	  var availableLocales = toolkitChromeReg.getLocalesForPackage("bluegriffon");

	  // Render locale menulist by iterating through the query result from getLocalesForPackage()
	  const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

	  var localeListbox = gDialog["locale-listbox"];

	  var selectedItem = null;
	  
	  while(availableLocales.hasMore()) {
  
	    var locale = availableLocales.getNext();
  
	    var listitem = document.createElementNS(XUL_NS, "listitem");
	    listitem.setAttribute("value", locale);
      var match = locale.match( /^([a-zA-Z]*)(\-([a-zA-Z]*))?$/ );
      if (match) {
        locale += " (" + gDialog.bundleLanguages.getString(match[1].toLowerCase()) + ", " +
                         gDialog.bundleRegions.getString(match[3].toLowerCase()) + ")";
      }
	    listitem.setAttribute("label", locale);
  
	    if (locale == selectedLocale) {
	      // Is this the current locale?
	      selectedItem = listitem;
	    }
  
	    localeListbox.appendChild(listitem);
	  }

	  // Highlight current locale
	  localeListbox.selectedItem = selectedItem;

	} catch (err) {	}
}

function changeLocale() {

  try {
    // Which locale did the user select?
    var localeListbox = gDialog["locale-listbox"];
    var newLocale = localeListbox.selectedItem.value;
    
    // Write preferred locale to local user config
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
                    getService(Components.interfaces.nsIPrefBranch);
    prefs.setCharPref("general.useragent.locale", newLocale);
    
    // Restart application
    var appStartup = Components.classes["@mozilla.org/toolkit/app-startup;1"]
                     .getService(Components.interfaces.nsIAppStartup);

    appStartup.quit(Components.interfaces.nsIAppStartup.eRestart |
                    Components.interfaces.nsIAppStartup.eAttemptQuit);
    
  } catch(err) {
  
    alert("Couldn't change locale: " + err);
  }
}