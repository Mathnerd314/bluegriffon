
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
       OpenAppModalWindow(window, "chrome://bluegriffon/content/dialogs/insertTable.xul", "Tables", false, element); 
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
#ifdef XP_UNIX
#ifdef XP_MACOSX
    var panel = gDialog["panel-cssproperties"];
    panel.openPanel(null, false);
    NotifierUtils.notify("redrawPanel", panel.id);
#else
    start_css();
#endif
#else
    var panel = gDialog["panel-cssproperties"];
    panel.openPanel(null, false);
    NotifierUtils.notify("redrawPanel", panel.id);
#endif
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

var cmdInsertAudioCommand =
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
    window.openDialog("chrome://bluegriffon/content/dialogs/insertAudio.xul","_blank",
                      "chrome,modal,titlebar,resizable=yes,dialog=yes", element);
  }
};

var cmdInsertHRCommand = 
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
    window.openDialog("chrome://bluegriffon/content/dialogs/insertHR.xul","_blank",
                      "chrome,modal,titlebar,resizable=yes,dialog=yes", element);
  }
};

var cmdInsertHTMLCommand =
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
    window.openDialog("chrome://bluegriffon/content/dialogs/insertHTML.xul","_blank",
                      "chrome,modal,titlebar,resizable=yes,dialog=yes");
  }
};

var cmdInsertFormCommand =
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
    if (element && element.nodeName.toLowerCase() != "form")
      element = null;
    window.openDialog("chrome://bluegriffon/content/dialogs/insertForm.xul","_blank",
                      "chrome,modal,titlebar,resizable=no,dialog=yes", element);
  }
};

var cmdInsertFormInputCommand =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return (EditorUtils.getCurrentEditorElement() &&
            EditorUtils.isDocumentEditable() &&
            EditorUtils.isEditingRenderedHTML() &&
            GetCurrentViewMode() == "wysiwyg");
  },

  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {
    var type = aParams.getCStringValue("type");
    var element = EditorUtils.getObjectForProperties();
    if (element && element.nodeName.toLowerCase() == "input")
      type = element.getAttribute("type");
    else
      element = null;
    window.openDialog("chrome://bluegriffon/content/dialogs/insertFormInput.xul","_blank",
                      "chrome,modal,titlebar,resizable=no,dialog=yes", element, type);
  },

  doCommand: function(aCommand) {}
};

var cmdInsertFieldsetCommand =
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
    if (element && element.nodeName.toLowerCase() != "fieldset")
      element = null;
    window.openDialog("chrome://bluegriffon/content/dialogs/insertFieldset.xul","_blank",
                      "chrome,modal,titlebar,resizable=no,dialog=yes", element);
  }
};

var cmdInsertLabelCommand =
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
    if (element && element.nodeName.toLowerCase() != "label")
      element = null;
    window.openDialog("chrome://bluegriffon/content/dialogs/insertLabel.xul","_blank",
                      "chrome,modal,titlebar,resizable=no,dialog=yes", element);
  }
};

var cmdInsertButtonCommand =
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
    if (element && element.nodeName.toLowerCase() != "button")
      element = null;
    window.openDialog("chrome://bluegriffon/content/dialogs/insertButton.xul","_blank",
                      "chrome,modal,titlebar,resizable=no,dialog=yes", element);
  }
};

var cmdInsertSelectCommand =
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
    if (element && element.nodeName.toLowerCase() != "select")
      element = null;
    window.openDialog("chrome://bluegriffon/content/dialogs/insertSelect.xul","_blank",
                      "chrome,modal,titlebar,resizable=yes,dialog=yes", element);
  }
};
