//-----------------------------------------------------------------------------------
var cmdDummyHTML =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return (EditorUtils.getCurrentEditorElement() &&
            EditorUtils.isDocumentEditable() &&
            EditorUtils.isEditingRenderedHTML() &&
            !EditorUtils.activeViewActive  &&
            GetCurrentViewMode() == "wysiwyg");
  },

  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {},

  doCommand: function(aCommand)
  {
    // do nothing
  }

};

var cmdViewModeEnabler =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return (EditorUtils.getCurrentEditorElement() &&
            EditorUtils.isDocumentEditable() &&
            EditorUtils.isEditingRenderedHTML() &&
            !EditorUtils.activeViewActive &&
            gDialog.sourceModeButton.getAttribute("busy") != "true");
  },

  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {},

  doCommand: function(aCommand)
  {
    // do nothing
  }
};

var cmdMarkupCleaner =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return (EditorUtils.isDocumentEditable()  &&
            GetCurrentViewMode() == "wysiwyg");
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
