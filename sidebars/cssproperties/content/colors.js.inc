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
  item.applyBackgroundImage(gDialog.imageURLTextbox.value);
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

function RepaintLinearGradient()
{
  var angle = gDialog.linearGradientAngleCheckbox.checked ? gDialog.linearGradientAngleRotator.value + "deg"
                                                          : "";
  var startingPoint = gDialog.linearGradientStartingPointCheckbox.checked ? gDialog.linearGradientStartingPointMenulist.value
                                                          : "";
  var hOffset = gDialog.linearGradientHorizOffsetCheckbox.checked ? gDialog.linearGradientHorizOffset.value
                                                          : "";
  var str = "-moz-linear-gradient(" +
            ((angle || startingPoint) ? angle + " " + startingPoint + "," : "");

  var stops = gDialog.colorStopsRichlistbox.querySelectorAll("richlistitem.colorstopitem");
  for (var i = 0; i < stops.length; i++) {
    if (i)
      str += ", ";
    var s = stops[i];
    str += s.color + (s.offset ? " " + s.offset : "");
  }
  str += ")";
  gDialog.linearGradientPreview.style.backgroundImage = str;
}

function SetLinearGradient()
{
  var gradient = gDialog.linearGradientPreview.style.backgroundImage;
  var item = gDialog.backgroundsRichlistbox.selectedItem;
  item.getChild("backgrounditemButton").style.backgroundImage = gradient;
  item.parsedValue = CssInspector.parseBackgroundImages(gradient)[0].value;
  gDialog.linearGradientPanel.hidePopup();
  ReapplyBackgrounds();
}

function UpdateColorStopsRichlistbox()
{
  var item = gDialog.colorStopsRichlistbox.selectedItem;
  if (gDialog.colorStopsRichlistbox.itemCount && item &&
      item.parentNode) {
    gDialog.removeColorStopButton.disabled = false;
    gDialog.upColorStopButton.disabled = !item.previousElementSibling;
    gDialog.downColorStopButton.disabled = !item.nextElementSibling;
  }
  else {
    gDialog.removeColorStopButton.disabled = true;
    gDialog.upColorStopButton.disabled = true;
    gDialog.downColorStopButton.disabled = true;
  }
  gDialog.linearGradientOkButton.disabled = (gDialog.colorStopsRichlistbox.itemCount < 2);
}

function AddColorStopToLinearGradient()
{
  var e = document.createElement("richlistitem");
  e.className = "colorstopitem";
  gDialog.colorStopsRichlistbox.appendChild(e);
  UpdateColorStopsRichlistbox();
  e.openEditor();
}

function DeleteColorStopFromLinearGradient()
{
  gDialog.colorStopsRichlistbox.removeChild(gDialog.colorStopsRichlistbox.selectedItem);
  UpdateColorStopsRichlistbox();
}
