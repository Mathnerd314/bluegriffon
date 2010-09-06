RegisterIniter(ColorsSectionIniter);

function ColorsSectionIniter(aElt, aRuleset)
{
  deleteAllChildren(gDialog.backgroundsRichlistbox);
  var color = CssInspector.getCascadedValue(aRuleset, "color");
  gDialog.colorColorpicker.color = color;

  var bgColor = CssInspector.getCascadedValue(aRuleset, "background-color");
  gDialog.bgColorColorpicker.color = bgColor;

  var bgImages = CssInspector.getCascadedValue(aRuleset, "background-image");
  var parsedImages = CssInspector.parseBackgroundImages(bgImages);
  for (var i = 0; i < parsedImages.length; i++) {
    var item = document.createElement("richlistitem");
    item.className = "backgrounditem";
    var type = parsedImages[i].type;
    item.setAttribute("type", type);
    gDialog.backgroundsRichlistbox.appendChild(item);
    item.reset();
    var button = item.getChild("backgrounditemButton");
    item.parsedValue = parsedImages[i].value;
    switch (type) {
      case "image":
        button.style.backgroundImage = item.parsedValue;
        break;
      default:
        button.style.backgroundImage =
          CssInspector.serializeGradient(item.parsedValue);
        break;
    }
  }
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
                  property: aElt.getAttribute("property"),
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
    bgImages.push(item.serializedValue);
  }
  ApplyStyles([
                {
                  property: "background-image",
                  value: bgImages.join(", ")
                }
              ]);
}


