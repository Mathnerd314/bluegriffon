RegisterIniter(PositionSectionIniter);

function PositionSectionIniter(aElt, aRuleset)
{
  var f = CssInspector.getCascadedValue(aRuleset, "float");
  CheckToggle(gDialog.floatLeftButton,   f == "left");
  CheckToggle(gDialog.floatNoneButton,   f == "none");
  CheckToggle(gDialog.floatRightButton,  f == "right");
}
