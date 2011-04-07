
var cmdOpen =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return true;    // we can always do this
  },

  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {},

  doCommand: function(aCommand)
  {
    window.openDialog("chrome://bluegriffon/content/dialogs/openLocation.xul","_blank",
                      "chrome,modal,titlebar", "tab");
  }
};

var cmdSave =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    // Always allow saving when editing a remote document,
    //  otherwise the document modified state would prevent that
    //  when you first open a remote file.
    try {
      var docUrl = EditorUtils.getDocumentUrl();
      return EditorUtils.isDocumentEditable()
        && GetCurrentViewMode() == "wysiwyg"
        && (EditorUtils.isDocumentModified()
            || UrlUtils.isUrlOfBlankDocument(docUrl)
            || UrlUtils.getScheme(docUrl) != "file");
    } catch (e) {return false;}
  },
  
  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {},

  doCommand: function(aCommand)
  {
    var result = false;
    var editor = EditorUtils.getCurrentEditor();
    if (editor)
      try {
        if (gDialog.wysiwygModeButton)
          ToggleViewMode(gDialog.wysiwygModeButton);
        // for the time being, we use the HTML serializer
  
        result = FileUtils.saveDocument(
                   UrlUtils.isUrlOfBlankDocument(EditorUtils.getDocumentUrl()),
                   false,
                   EditorUtils.getCurrentDocumentMimeType());
        window.content.focus();
        if (result)
          StoreUrlInLocationDB(EditorUtils.getDocumentUrl());
      }
      catch (e) {}
    return result;
  }
}

var cmdSaveAs =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return (EditorUtils.isDocumentEditable() && GetCurrentViewMode() == "wysiwyg");
  },

  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {},

  doCommand: function(aCommand)
  {
    var editor = EditorUtils.getCurrentEditor();
    if (editor)
    try {
      if (gDialog.wysiwygModeButton)
        ToggleViewMode(gDialog.wysiwygModeButton);
      var editorMimeType = EditorUtils.getCurrentDocument().contentType;
      var result = FileUtils.saveDocument(true, false, editorMimeType);
      if (result)
        StoreUrlInLocationDB(EditorUtils.getDocumentUrl());
      window.content.focus();
      return result;
    }
    catch (e) {}
    return false;
  }
}

var cmdCloseTab =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    // Always allow saving when editing a remote document,
    //  otherwise the document modified state would prevent that
    //  when you first open a remote file.
    try {
      return EditorUtils.isDocumentEditable();
    } catch (e) {return false;}
  },
  
  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {},

  doCommand: function(aCommand)
  {
	  var editorElement = EditorUtils.getCurrentEditorElement();
    if (!editorElement) // sanity check
      return;
    var mode = editorElement.parentNode.getAttribute("previousMode");
	  if (mode == "source") {
	    ToggleViewMode(gDialog.wysiwygModeButton);
	  }
    if (EditorUtils.isDocumentModified()) {
      var rv = PromptUtils.confirmWithTitle(
                             L10NUtils.getString("FileNotSaved"),
                             L10NUtils.getString("SaveFileBeforeClosing"),
                             L10NUtils.getString("YesSaveFile"),
                             L10NUtils.getString("DontCloseTab"),
                             L10NUtils.getString("NoDiscardChanges"));
       switch(rv) {
         case 1:
           SaveCurrentTabLocation();
           return rv;
         case 0:
           if (!cmdSave.doCommand()) {
             SaveCurrentTabLocation();
             return rv;
           }
         default: break;
       }
    }
    SaveCurrentTabLocation();
    doCloseTab(EditorUtils.getCurrentTabEditor().selectedTab);
    return rv;
  }
}

function StoreUrlInLocationDB(url)
{
  RecentPagesHandler.saveRecentFilesPrefs();
  RecentPagesHandler.buildRecentPagesMenu();
  var file = Components.classes["@mozilla.org/file/directory_service;1"]
                       .getService(Components.interfaces.nsIProperties)
                       .get("ProfD", Components.interfaces.nsIFile);
  file.append("bgLocations.sqlite");
  
  var storageService = Components.classes["@mozilla.org/storage/service;1"]
                          .getService(Components.interfaces.mozIStorageService);
  var dbConn = storageService.openDatabase(file);
  try {
    var statement = dbConn.createStatement(
      "INSERT INTO 'bgLocations' ('query','querydate') VALUES(?1,?2)");
  
    statement.bindUTF8StringParameter(0, url);
    statement.bindInt64Parameter(1, Date.parse(new Date()));
  
    statement.execute();
    statement.finalize();

    dbConn.close();
  }
  catch (e) {} // already exists in table
}
