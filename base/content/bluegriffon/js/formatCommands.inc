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
    if (selContainer)
    {
      var classes = EditorUtils.getBlockContainer(selContainer.node).className;
      if (classes)
      {
        aParams.setCStringValue("state_attribute", classes);
        return;
      }
    }

    aParams.setCStringValue("state_attribute", L10NUtils.getString("NoClassAvailable"));
  },

  doCommandParams: function(aCommandName, aParams, aRefCon)
  {
    var className = aParams.getCStringValue("state_attribute");
    var node = EditorUtils.getSelectionContainer().node;

    var node = EditorUtils.getBlockContainer(node);
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
        newList.push(className);;
    }

    EditorUtils.getCurrentEditor().setAttribute(node, "class", newList.join(" "));
    // be kind with the rest of the world
    NotifierUtils.notify("selection", node, false);
  }
};

