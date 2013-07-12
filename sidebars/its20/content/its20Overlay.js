Components.utils.import("resource://app/modules/editorHelper.jsm");

var cmdITS20Command =
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
    start_panel(gDialog["panel-its20-menuitem"]);
  }
};

function  ITS20_setupComposerCommands()
{
  window.removeEventListener("load", ITS20_setupComposerCommands, false);

  var commandTable = ComposerCommands.getComposerCommandTable();
  if (!commandTable)
    return;
  commandTable.registerCommand("cmd_its20", cmdITS20Command);
}

window.addEventListener("load", ITS20_setupComposerCommands, false);
