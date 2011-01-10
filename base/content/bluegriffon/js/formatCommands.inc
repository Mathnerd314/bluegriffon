//-----------------------------------------------------------------------------------

var cmdClass =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return (EditorUtils.getCurrentEditorElement() &&
            EditorUtils.isDocumentEditable() &&
            EditorUtils.isEditingRenderedHTML() &&
            GetCurrentViewMode() == "wysiwyg");
  },

  getCommandStateParams: function (aCommandName, aParams, aRefcon)
  {
    var enabled = this.isCommandEnabled(aCommandName, aRefcon);
    aParams.setBooleanValue("state_enabled", enabled);
    aParams.setBooleanValue("state_mixed", false);
    var selContainer = EditorUtils.getSelectionContainer();
    if (selContainer && selContainer.node)
    {
      var classes = selContainer.node.className;
      if (classes)
      {
        aParams.setCStringValue("state_attribute", classes);
        return;
      }
    }

    aParams.setCStringValue("state_attribute", "");
  },

  doCommandParams: function(aCommandName, aParams, aRefCon)
  {
    var className = aParams.getCStringValue("state_attribute");
    var node = EditorUtils.getSelectionContainer().node;

    if (className) {
      var classes = node.classList;
  
      var newList = className;
      if (classes)
      {
        var found = false;
        newList = [];
        for (var i = 0; i < classes.length; i++)
        {
          if (classes[i] == className)
            found = true;
          else
          newList.push(classes[i]);;
        }
        if (!found)
          newList.push(className);
      }
  
      EditorUtils.getCurrentEditor().setAttribute(node, "class", newList.join(" "));
    }
    else
      EditorUtils.getCurrentEditor().removeAttribute(node, "class");
    // be kind with the rest of the world
    NotifierUtils.notify("selection", node, false);
  }
};


var cmdId =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return (EditorUtils.getCurrentEditorElement() &&
            EditorUtils.isDocumentEditable() &&
            EditorUtils.isEditingRenderedHTML() &&
            GetCurrentViewMode() == "wysiwyg");
  },

  getCommandStateParams: function (aCommandName, aParams, aRefcon)
  {
    var enabled = this.isCommandEnabled(aCommandName, aRefcon);
    aParams.setBooleanValue("state_enabled", enabled);
    aParams.setBooleanValue("state_mixed", false);
    var selContainer = EditorUtils.getSelectionContainer();
    if (selContainer && selContainer.node)
    {
      var id = selContainer.node.id;
      if (id)
      {
        aParams.setCStringValue("state_attribute", id);
        return;
      }
    }

    aParams.setCStringValue("state_attribute", "");
  },

  doCommandParams: function(aCommandName, aParams, aRefCon)
  {
    var id = aParams.getCStringValue("state_attribute");
    var node = EditorUtils.getSelectionContainer().node;
    var editor = EditorUtils.getCurrentEditor();
    var elt = id ? EditorUtils.getCurrentDocument().getElementById(id) : null;
    var rv = 0;
    if (elt && elt != node)
      rv = PromptUtils.confirmWithTitle(
                             L10NUtils.getString("IdAlreadyTaken"),
                             L10NUtils.getString("RemoveIdFromElement"),
                             L10NUtils.getString("YesRemoveId"),
                             L10NUtils.getString("NoCancel"),
                             null);

    if (id && node.id != id) {
      // first, let's check another element does not already carry that id...
      if (rv == 1)
        return;
      editor.beginTransaction();
      if (elt)
        editor.removeAttribute(elt, "id");
      editor.setAttribute(node, "id", id);
      editor.endTransaction();
    }
    else
      editor.removeAttribute(node, "id");

    // be kind with the rest of the world
    NotifierUtils.notify("selection", node, false);
  }
};

//-----------------------------------------------------------------------------------

var cmdAriaRole =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return (EditorUtils.getCurrentEditorElement() &&
            EditorUtils.isDocumentEditable() &&
            EditorUtils.isEditingRenderedHTML() &&
            GetCurrentViewMode() == "wysiwyg");
  },

  getCommandStateParams: function (aCommandName, aParams, aRefcon)
  {
    var enabled = this.isCommandEnabled(aCommandName, aRefcon);
    aParams.setBooleanValue("state_enabled", enabled);
    aParams.setBooleanValue("state_mixed", false);
    var selContainer = EditorUtils.getSelectionContainer();
    if (selContainer)
    {
      var role = EditorUtils.getBlockContainer(selContainer.node).getAttribute("role");
      if (role)
      {
        aParams.setCStringValue("state_attribute", role);
        return;
      }
    }

    aParams.setCStringValue("state_attribute", "");
  },

  doCommandParams: function(aCommandName, aParams, aRefCon)
  {
    var role = aParams.getCStringValue("state_attribute");
    var node = EditorUtils.getSelectionContainer().node;

    if (role)
      EditorUtils.getCurrentEditor().setAttribute(node, "role", role);
    else
      EditorUtils.getCurrentEditor().removeAttribute(node, "role");
    // be kind with the rest of the world
    NotifierUtils.notify("selection", node, false);
  }
};

var cmdPagePropertiesCommand =
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
    try {
      window.openDialog("chrome://bluegriffon/content/dialogs/pageProperties.xul", "_blank",
              "chrome,close,titlebar,modal");
    }
    catch(ex) {}
    window.content.focus();
  }
};
