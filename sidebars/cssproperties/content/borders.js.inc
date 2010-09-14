RegisterIniter(BordersSectionIniter);

function BordersSectionIniter(aElt, aRuleset)
{
  var bbw = CssInspector.getCascadedValue(aRuleset, "border-bottom-width");
  var btw = CssInspector.getCascadedValue(aRuleset, "border-top-width");
  var blw = CssInspector.getCascadedValue(aRuleset, "border-left-width");
  var brw = CssInspector.getCascadedValue(aRuleset, "border-right-width");

  var bbs = CssInspector.getCascadedValue(aRuleset, "border-bottom-style");
  var bts = CssInspector.getCascadedValue(aRuleset, "border-top-style");
  var bls = CssInspector.getCascadedValue(aRuleset, "border-left-style");
  var brs = CssInspector.getCascadedValue(aRuleset, "border-right-style");

  var bbc = CssInspector.getCascadedValue(aRuleset, "border-bottom-color");
  var btc = CssInspector.getCascadedValue(aRuleset, "border-top-color");
  var blc = CssInspector.getCascadedValue(aRuleset, "border-left-color");
  var brc = CssInspector.getCascadedValue(aRuleset, "border-right-color");

  gDialog.borderTopColorpicker.color    = btc;
  gDialog.borderLeftColorpicker.color   = blc;
  gDialog.borderRightColorpicker.color  = brc;
  gDialog.borderBottomColorpicker.color = bbc;

  gDialog.borderTopWidthMenulist.value    = btw;
  gDialog.borderLeftWidthMenulist.value   = blw;
  gDialog.borderRightWidthMenulist.value  = brw;
  gDialog.borderBottomWidthMenulist.value = bbw;

  gDialog.borderTopStyleMenulist.value    = bts;
  gDialog.borderLeftStyleMenulist.value   = bls;
  gDialog.borderRightStyleMenulist.value  = brs;
  gDialog.borderBottomStyleMenulist.value = bbs;

  var sameOnFourEdges =  (bbw == btw && bbw == blw && bbw == brw &&
										      bbs == bts && bbs == bls && bbs == brs &&
										      bbc == btc && bbc == blc && bbc == brc);
  gDialog.sameBorderOnFourEdgesCheckbox.checked = sameOnFourEdges;

  gDialog.borderTopColorpicker.parentNode.hidden = sameOnFourEdges;
  gDialog.borderLeftColorpicker.parentNode.hidden = sameOnFourEdges;
  gDialog.borderRightColorpicker.parentNode.hidden = sameOnFourEdges;
  gDialog.borderBottomLabel.style.visibility = (sameOnFourEdges ? "hidden" : "visible");
}

function ToggleSameBorderOnFourEdges(aElt)
{
  var sameOnFourEdges = aElt.checked;
  if (sameOnFourEdges) {
    var bbc = gDialog.borderBottomColorpicker.color;
    var bbs = gDialog.borderBottomStyleMenulist.value;
    var bbw = gDialog.borderBottomWidthMenulist.value;

    gDialog.borderTopColorpicker.color = bbc;
    gDialog.borderLeftColorpicker.color = bbc;
    gDialog.borderRightColorpicker.color = bbc;

    gDialog.borderTopStyleMenulist.value = bbs;
    gDialog.borderLeftStyleMenulist.value = bbs;
    gDialog.borderRightStyleMenulist.value = bbs;

    gDialog.borderTopWidthMenulist.value = bbw;
    gDialog.borderLeftWidthMenulist.value = bbw;
    gDialog.borderRightWidthMenulist.value = bbw;
    var toApply = [
                    {
                      property: "border-top-color",
                      value: bbc
                    },
                    {
                      property: "border-left-color",
                      value: bbc
                    },
                    {
                      property: "border-right-color",
                      value: bbc
                    },
                    {
                      property: "border-top-style",
                      value: bbs
                    },
                    {
                      property: "border-left-style",
                      value: bbs
                    },
                    {
                      property: "border-right-style",
                      value: bbs
                    },
                    {
                      property: "border-top-width",
                      value: bbw
                    },
                    {
                      property: "border-left-width",
                      value: bbw
                    },
                    {
                      property: "border-right-width",
                      value: bbw
                    }
                  ];
    ApplyStyles(toApply);
  }
  gDialog.borderTopColorpicker.parentNode.hidden = sameOnFourEdges;
  gDialog.borderLeftColorpicker.parentNode.hidden = sameOnFourEdges;
  gDialog.borderRightColorpicker.parentNode.hidden = sameOnFourEdges;
  gDialog.borderBottomLabel.style.visibility = (sameOnFourEdges ? "hidden" : "visible");
}
