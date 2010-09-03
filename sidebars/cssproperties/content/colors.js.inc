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
  SetEnabledElement(gDialog.removeBackgroundButton, (gDialog.backgroundsRichlistbox.itemCount != 0));
  ReapplyBackgrounds();
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

function LoadImage()
{
  gDialog.previewBackgroundImage.style.backgroundImage =
    'url("' + gDialog.imageURLTextbox.inputField.value + '")';
}

function BackgroundImageSelected()
{
  gDialog.backgroundImagePanel.hidePopup();
  var item = gDialog.backgroundsRichlistbox.selectedItem;
  item.applyBackgroundImage(gDialog.imageURLTextbox.inputField.value);
}

function ReapplyBackgrounds()
{
  var items = gDialog.backgroundsRichlistbox.querySelectorAll("richlistitem");
  var bgColor = "", bgImages = [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    switch (item.type) {
      case "color":
        bgColor = item.getAttribute("color");
        break;
      default:
        bgImages.push('url("' + item.getAttribute("image") + '")');
        break;
    }
  }
  ApplyStyles([
                {
                  property: "background-color",
                  value: bgColor
                },
                {
                  property: "background-image",
                  value: bgImages.join(", ")
                }
              ]);
}


