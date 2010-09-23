RegisterIniter(ShadowsSectionIniter);

function ShadowsSectionIniter(aElt, aRuleset)
{
  deleteAllChildren(gDialog.textShadowRichlistbox);
  var ts = CssInspector.getCascadedValue(aRuleset, "text-shadow");
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
