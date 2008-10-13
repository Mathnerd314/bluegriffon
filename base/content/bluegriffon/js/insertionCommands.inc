var cmdInsertOrEditTableCommand =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    //return (EditorUtils.isDocumentEditable() && this.isEditingRenderedHTML());
    return true;
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
                      "chrome,modal,titlebar, resizable=yes");
  }
};