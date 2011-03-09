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

var cmdDummySource =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return (EditorUtils.getCurrentEditorElement() &&
            EditorUtils.isDocumentEditable() &&
            EditorUtils.isEditingRenderedHTML() &&
            !EditorUtils.activeViewActive  &&
            GetCurrentViewMode() == "source");
  },

  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {},

  doCommand: function(aCommand)
  {
    // do nothing
  }

};

var cmdDummyAll =
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

var cmdGotoLinkCommand =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    if (EditorUtils.getCurrentEditorElement() &&
        EditorUtils.isDocumentEditable() &&
        EditorUtils.isEditingRenderedHTML() &&
        GetCurrentViewMode() == "wysiwyg") {
      var element = EditorUtils.getObjectForProperties(["a"], "href");
      if (element) {
        var url = UrlUtils.makeRelativeUrl(element.getAttribute("href"));
        if (url.length && url[0] == "#")
          return true;
      }
    }
    return false;
  },

  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {},

  doCommand: function(aCommand)
  {
    var element = EditorUtils.getObjectForProperties(["a"], "href");
    var target = UrlUtils.makeRelativeUrl(element.getAttribute("href"));
    if (target)
      target = target.substr(1);
    else
      return; // sanity check
    // first check ID...
    var doc = EditorUtils.getCurrentDocument();
    var targetElement = doc.getElementById(target) || doc.querySelector("a[name='" + target + "']");
    if (targetElement) {
      ScrollToElement(targetElement);
      EditorUtils.getCurrentEditor().selectElement(targetElement);
    }
  }
};
