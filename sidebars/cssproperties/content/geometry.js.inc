RegisterIniter(GeometrySectionIniter);

function GeometrySectionIniter(aElt, aRuleset)
{
  var mt = CssInspector.getCascadedValue(aRuleset, "margin-top");
  var mb = CssInspector.getCascadedValue(aRuleset, "margin-bottom");
  var ml = CssInspector.getCascadedValue(aRuleset, "margin-left");
  var mr = CssInspector.getCascadedValue(aRuleset, "margin-right");
  var afm = (mt == mb && mt == ml && mt == mr);
  gDialog.useSameFourMarginsCheckbox.checked = afm;
  gDialog.marginRightMenulist.disabled = afm;
  gDialog.marginLeftMenulist.disabled = afm;
  gDialog.marginTopMenulist.disabled = afm;
  gDialog.marginTopMenulist.value = mt;
  gDialog.marginBottomMenulist.value = mb;
  gDialog.marginLeftMenulist.value = ml;
  gDialog.marginRightMenulist.value = mr;

  var pt = CssInspector.getCascadedValue(aRuleset, "padding-top");
  var pb = CssInspector.getCascadedValue(aRuleset, "padding-bottom");
  var pl = CssInspector.getCascadedValue(aRuleset, "padding-left");
  var pr = CssInspector.getCascadedValue(aRuleset, "padding-right");
  var afp = (pt == pb && pt == pl && pt == pr);
  gDialog.useSameFourPaddingsCheckbox.checked = afp;
  gDialog.paddingRightMenulist.disabled = afp;
  gDialog.paddingLeftMenulist.disabled = afp;
  gDialog.paddingTopMenulist.disabled = afp;
  gDialog.paddingTopMenulist.value = pt;
  gDialog.paddingBottomMenulist.value = pb;
  gDialog.paddingLeftMenulist.value = pl;
  gDialog.paddingRightMenulist.value = pr;
}

function ToggleFourEdges(aCheckbox, aPrefix)
{
  var checked = aCheckbox.checked;
  gDialog[aPrefix + "RightMenulist"].disabled = checked;
  gDialog[aPrefix + "LeftMenulist"].disabled = checked;
  gDialog[aPrefix + "TopMenulist"].disabled = checked;
  if (checked) {
    var value = gDialog[aPrefix + "BottomMenulist"].value;
	  gDialog[aPrefix + "RightMenulist"].value= value;
	  gDialog[aPrefix + "LeftMenulist"].value= value;
	  gDialog[aPrefix + "TopMenulist"].value= value;
    onLengthMenulistCommand(gDialog[aPrefix + "BottomMenulist"], '% px pt cm in mm pc em ex', '', false);
  }
}

