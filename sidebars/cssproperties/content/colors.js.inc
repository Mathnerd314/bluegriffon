RegisterIniter(ColorsSectionIniter);

function ColorsSectionIniter(aElt, aRuleset)
{
  //deleteAllChildren(gDialog.backgroundsRichlistbox);
}

function AddBackground(aEvent)
{
  var type = aEvent.originalTarget.value;
  var item = document.createElement("richlistitem");
  item.className = "backgrounditem";
  item.setAttribute("type", type);
  gDialog.backgroundsRichlistbox.appendChild(item);
  item.reset();
  item.openEditor();
}