//-----------------------------------------------------------------------------------

var cmdClass =
{
  isCommandEnabled: function(aCommand, dummy)
  {
  	return (EditorUtils.getCurrentEditorElement() &&
            EditorUtils.isDocumentEditable() &&
            EditorUtils.isEditingRenderedHTML());
  },

  getCommandStateParams: function (aCommandName, aParams, aRefcon)
  {
  	var enabled = this.isCommandEnabled(aCommandName, aRefcon);
    aParams.setBooleanValue("state_enabled", enabled);
    aParams.setBooleanValue("state_mixed", false);
    var selContainer = EditorUtils.getSelectionContainer();
    if (selContainer)
    {
      var classes = EditorUtils.getClasses(selContainer.node).classes;
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

  	var retValue = EditorUtils.getClasses(node);
  	var classes = retValue.classes;
  	node = retValue.node;

  	var newList = className;
  	if (classes)
  	{
  		var list = classes.split(" ");
  		var found = false;
  		newList = "";
  		for (var i = 0; i < list.length; i++)
  		{
        if (list[i] == className)
          found = true;
        else
        newList += list[i] + " ";
  		}
      if (!found)
        newList += className;
  	}

  	EditorUtils.getCurrentEditor().setAttribute(node, "class", newList);
  	// be kind with the rest of the world
  	NotifierUtils.notify("selection", node, false);
  }
};

