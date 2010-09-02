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

function UpdateAddBackgroundMenupopup(aPopup)
{
  var count = gDialog.backgroundsRichlistbox.itemCount;
  var disabled = false;
  if (count) {
    var item = gDialog.backgroundsRichlistbox.getItemAtIndex(count - 1);
    if (item.type == "color") {
      disabled = true;
    }
  }
  var items = document.querySelectorAll("#addBackgroundMenupopup menuitem");
  for (var i = 0; i < items.length; i++)
    items[i].disabled = disabled;
}

function OnBackgroundSelect(aElt)
{
  var item = aElt.selectedItem;
  SetEnabledElement(gDialog.removeBackgroundButton, (item != null));    
}

function DeleteBackground()
{
  var item = gDialog.backgroundsRichlistbox.selectedItem;
  if (!item) return; // sanity check
  item.parentNode.removeChild(item);
}

function SetColor(aElt)
{
  var color = aElt.color;
  ApplyStyles([
                {
                  property: "color",
                  value: color
                }
              ]);
}
