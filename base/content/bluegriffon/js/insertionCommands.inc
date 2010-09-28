
var cmdInsertOrEditTableCommand =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return (EditorUtils.getCurrentEditorElement() &&
            EditorUtils.isDocumentEditable() &&
            EditorUtils.isEditingRenderedHTML() &&
            GetCurrentViewMode() == "wysiwyg");
  },

  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {},

  doCommand: function(aCommand)
  {
    var element = EditorUtils.getObjectForProperties();
    if (element) {
      var name = element.nodeName.toLowerCase();
      if (name == "table" ||
          name == "thead" ||
          name == "tfoot" ||
          name == "tbody" ||
          name == "tr" ||
          name == "th" ||
          name == "td" ||
          name == "caption") {
		    window.openDialog("chrome://bluegriffon/content/dialogs/insertTable.xul","_blank",
		                      "chrome,modal,titlebar,dialog=yes", element);
        return;
      }
    }

    // reset the table insertion panel
    AutoInsertTable.reset();
    gDialog.AutoInsertTableSheetPopup.openPopup(gDialog["tableButton"], "after_start", 0, 0, false);
  }
};


var cmdInsertImageCommand =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return (EditorUtils.getCurrentEditorElement() &&
            EditorUtils.isDocumentEditable() &&
            EditorUtils.isEditingRenderedHTML() &&
            GetCurrentViewMode() == "wysiwyg");
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

var cmdInsertAnchorCommand =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return (EditorUtils.getCurrentEditorElement() &&
            EditorUtils.isDocumentEditable() &&
            EditorUtils.isEditingRenderedHTML() &&
            GetCurrentViewMode() == "wysiwyg");
  },

  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {},

  doCommand: function(aCommand)
  {
    var element = EditorUtils.getObjectForProperties();
    window.openDialog("chrome://bluegriffon/content/dialogs/insertAnchor.xul","_blank",
                      "chrome,modal,titlebar,resizable=yes,dialog=yes", element);
  }
};

var cmdInsertLinkCommand =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return (EditorUtils.getCurrentEditorElement() &&
            EditorUtils.isDocumentEditable() &&
            EditorUtils.isEditingRenderedHTML() &&
            GetCurrentViewMode() == "wysiwyg");
  },

  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {},

  doCommand: function(aCommand)
  {
    var element = EditorUtils.getObjectForProperties();
    window.openDialog("chrome://bluegriffon/content/dialogs/insertLink.xul","_blank",
                      "chrome,modal,titlebar,resizable=yes,dialog=yes", element);
  }
};

var cmdCssPanelCommand =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return (EditorUtils.getCurrentEditorElement() &&
            EditorUtils.isDocumentEditable() &&
            EditorUtils.isEditingRenderedHTML() &&
            GetCurrentViewMode() == "wysiwyg");
  },

  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {},

  doCommand: function(aCommand)
  {
    var panel = gDialog["panel-cssproperties"];
    panel.openPanel(null, false);
  }
};

var cmdInsertVideoCommand =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return (EditorUtils.getCurrentEditorElement() &&
            EditorUtils.isDocumentEditable() &&
            EditorUtils.isEditingRenderedHTML() &&
            GetCurrentViewMode() == "wysiwyg");
  },

  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {},

  doCommand: function(aCommand)
  {
    var element = EditorUtils.getObjectForProperties();
    window.openDialog("chrome://bluegriffon/content/dialogs/insertVideo.xul","_blank",
                      "chrome,modal,titlebar,resizable=yes,dialog=yes", element);
  }
};
