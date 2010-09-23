RegisterIniter(ShadowsSectionIniter);

function ShadowsSectionIniter(aElt, aRuleset)
{
  deleteAllChildren(gDialog.textShadowRichlistbox);
  var ts = CssInspector.getCascadedValue(aRuleset, "text-shadow");
  var shadows = CssInspector.parseTextShadows(ts);
  for (var i = 0; i < shadows.length; i++) {
    var s = shadows[i];
    var item = document.createElement("richlistitem");
    item.className = s.none ? "noneTextShadow" : "shadowTextShadow";
    gDialog.textShadowRichlistbox.appendChild(item);
    if (!s.none) {
      item.color = s.color;
      item.offsetX = s.offsetX;
      item.offsetY = s.offsetY;
      item.blurRadius = s.blurRadius;
    }
  }
}

function OnTextShadowSelect(aElt)
{
  var item = aElt.selectedItem;
  SetEnabledElement(gDialog.removeTextShadowButton, (item != null));    
}

function AddTextShadow(aEvent)
{
  var type = aEvent.originalTarget.value;
  var item = document.createElement("richlistitem");
  item.className = type + "TextShadow";
  gDialog.textShadowRichlistbox.appendChild(item);
  UpdateTextShadowUI();
  ReapplyTextShadows();
}

function DeleteTextShadow()
{
  var item = gDialog.textShadowRichlistbox.selectedItem;
  if (!item) return; // sanity check
  item.parentNode.removeChild(item);
  UpdateTextShadowUI();
  ReapplyTextShadows();
}

function ReapplyTextShadows()
{
  var items = gDialog.textShadowRichlistbox.querySelectorAll("richlistitem");
  var shadows = [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var s = item.color + " " + item.offsetX + " " + item.offsetY + " " + item.blurRadius;
    shadows.push(s);
  }
  ApplyStyles([{
                 property: "text-shadow",
                 value: shadows.join(",")
               }])
}

function UpdateTextShadowUI()
{
  var isEmpty = (gDialog.textShadowRichlistbox.itemCount == 0);
  var isNone = !isEmpty &&
                    (gDialog.textShadowRichlistbox.getItemAtIndex(0).className == "noneTextShadow");
  SetEnabledElement(gDialog.addTransitionButton, !isNone);
  SetEnabledElement(gDialog.removeTransitionButton, false);
  
  SetEnabledElement(gDialog.shadowTextShadowMenuitem, isEmpty || !isNone);
  SetEnabledElement(gDialog.noneTextShadowMenuitem, isEmpty);
}
