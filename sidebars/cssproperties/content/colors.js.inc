RegisterIniter(ColorsSectionIniter);

function ColorsSectionIniter(aElt, aRuleset)
{
  //deleteAllChildren(gDialog.backgroundsRichlistbox);
}

function AddBackground(aEvent)
{
  var type = aEvent.originalTarget.value;
  var item = document.createElement("richlistitem");
  gDialog.backgroundsRichlistbox.appendChild(item);
   switch(type) {
    case "color":
      {
        var cp = document.createElement("ecolorpicker");
        cp.setAttribute("colorObjectId", "BackgroundColor");
        cp.setAttribute("windowTitle", "Background Color");
        cp.setAttribute("showTransparency", "true");
        item.appendChild(cp);
        cp.open();
      }
      break;
  }
}