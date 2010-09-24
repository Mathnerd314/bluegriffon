RegisterIniter(PositionSectionIniter);

function PositionSectionIniter(aElt, aRuleset)
{
  var f = CssInspector.getCascadedValue(aRuleset, "float");
  CheckToggle(gDialog.floatLeftButton,   f == "left");
  CheckToggle(gDialog.floatNoneButton,   f == "none");
  CheckToggle(gDialog.floatRightButton,  f == "right");

  var p = CssInspector.getCascadedValue(aRuleset, "position");
  CheckToggle(gDialog.positionStaticButton,   p == "static");
  CheckToggle(gDialog.positionRelativeButton, p == "relative");
  CheckToggle(gDialog.positionAbsoluteButton, p == "absolute");
  CheckToggle(gDialog.positionFixedButton,    p == "fixed");

  var zi = CssInspector.getCascadedValue(aRuleset, "z-index");
  gDialog.zIndexMenulist.value = zi;

  var t = CssInspector.getCascadedValue(aRuleset, "top");
  var l = CssInspector.getCascadedValue(aRuleset, "left");
  var r = CssInspector.getCascadedValue(aRuleset, "right");
  var b = CssInspector.getCascadedValue(aRuleset, "bottom");
  gDialog.topMenulist.value = t;
  gDialog.leftMenulist.value = l;
  gDialog.rightMenulist.value = r;
  gDialog.bottomMenulist.value = b;

  var c = CssInspector.getCascadedValue(aRuleset, "clear");
  CheckToggle(gDialog.clearLeftButton,   c == "left");
  CheckToggle(gDialog.clearRightButton,  c == "right");
  CheckToggle(gDialog.clearBothButton,   c == "both");
  CheckToggle(gDialog.clearNoneButton,   c == "none");

  var o = CssInspector.getCascadedValue(aRuleset, "overflow");
  CheckToggle(gDialog.visibleOverflowButton,  o == "visible");
  CheckToggle(gDialog.hiddenOverflowButton,   o == "hidden");
  CheckToggle(gDialog.scrollOverflowButton,   o == "scroll");
  CheckToggle(gDialog.autoOverflowButton,     o == "auto");
}
