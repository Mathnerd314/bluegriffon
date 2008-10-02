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
      return EditorUtils.isDocumentEditable() &&
        (EditorUtils.isDocumentModified() ||
         UrlUtils.isUrlAboutBlank(docUrl) || UrlUtils.getScheme(docUrl) != "file");
    } catch (e) {return false;}
  },
  
  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {},

  doCommand: function(aCommand)
  {
    var result = false;
    var editor = EditorUtils.getCurrentEditor();
    if (editor)
    {
      // FinishHTMLSource();
      // for the time being, we use the HTML serializer
      var editorMimeType = editor.contentsMIMEType;
      if (editorMimeType == "application/xhtml+xml")
        editorMimeType = "text/html";

      result = FileUtils.saveDocument(
                 UrlUtils.isUrlAboutBlank(EditorUtils.getDocumentUrl()),
                 false,
                 editorMimeType);
      window.content.focus();
    }
    return result;
  }
}
