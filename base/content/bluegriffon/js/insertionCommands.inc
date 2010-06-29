
var cmdInsertOrEditTableCommand =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return (EditorUtils.getCurrentEditorElement() &&
            EditorUtils.isDocumentEditable() &&
            EditorUtils.isEditingRenderedHTML());
  },

  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {},

  doCommand: function(aCommand)
  {
    /*if (IsInTableCell())
      EditorTableCellProperties();
    else
      EditorInsertOrEditTable(true);*/

    window.openDialog("chrome://bluegriffon/content/dialogs/insertTable.xul","_blank",
                      "chrome,modal,titlebar,resizable=yes,dialog=yes");
  }
};


var cmdInsertImageCommand =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return (EditorUtils.getCurrentEditorElement() &&
            EditorUtils.isDocumentEditable() &&
            EditorUtils.isEditingRenderedHTML());
  },

  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {},

  doCommand: function(aCommand)
  {
    var element = EditorUtils.getObjectForProperties();
    if (element && element.nodeName.toLowerCase() != "img")
      element = null;
    window.openDialog("chrome://bluegriffon/content/dialogs/insertImage.xul","_blank",
                      "chrome,modal,titlebar,resizable=yes,dialog=yes", element);
  }
};