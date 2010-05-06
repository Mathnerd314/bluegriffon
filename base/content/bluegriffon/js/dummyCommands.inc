//-----------------------------------------------------------------------------------
var cmdDummyHTML =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return (EditorUtils.getCurrentEditorElement() &&
            EditorUtils.isDocumentEditable() &&
            EditorUtils.isEditingRenderedHTML() &&
            !EditorUtils.activeViewActive);
  },

  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {},

  doCommand: function(aCommand)
  {
    // do nothing
    dump("Hey, who's calling the dummy command?\n");
  }

};

var cmdMarkupCleaner =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return (EditorUtils.isDocumentEditable() /*&& 
            !IsInHTMLSourceMode()*/);
  },

  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {},

  doCommand: function(aCommand)
  {
    try {
      window.openDialog("chrome://bluegriffon/content/dialogs/markupCleaner.xul", "_blank",
              "chrome,close,titlebar,modal");
    }
    catch(ex) {}
    window.content.focus();
  }
};
