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

  var tlCorner = CssInspector.getCascadedValue(aRuleset, "border-top-left-radius");
  var trCorner = CssInspector.getCascadedValue(aRuleset, "border-top-right-radius");
  var blCorner = CssInspector.getCascadedValue(aRuleset, "border-bottom-left-radius");
  var brCorner = CssInspector.getCascadedValue(aRuleset, "border-bottom-right-radius");
  var sameFourCorners = (tlCorner == trCorner && tlCorner == blCorner && tlCorner == brCorner);
  var r = new RegExp( "([+-]?[0-9]*\\.[0-9]+|[+-]?[0-9]+)(%|px|pt|cm|in|mm|pc|em|ex)*", "g");
  tlCorner = tlCorner.match(r);
  trCorner = trCorner.match(r);
  blCorner = blCorner.match(r);
  brCorner = brCorner.match(r);
  gDialog.topLeftBorderRadiusXMenulist.value = (tlCorner && tlCorner.length) ? tlCorner[0] : "";
  gDialog.topLeftBorderRadiusYMenulist.value = (tlCorner && tlCorner.length == 2) ? tlCorner[1] : "";
  gDialog.topRightBorderRadiusXMenulist.value = (trCorner && trCorner.length) ? trCorner[0] : "";
  gDialog.topRightBorderRadiusYMenulist.value = (trCorner && trCorner.length == 2) ? trCorner[1] : "";
  gDialog.bottomLeftBorderRadiusXMenulist.value = (blCorner && blCorner.length) ? blCorner[0] : "";
  gDialog.bottomLeftBorderRadiusYMenulist.value = (blCorner && blCorner.length == 2) ? blCorner[1] : "";
  gDialog.bottomRightBorderRadiusXMenulist.value = (brCorner && brCorner.length) ? brCorner[0] : "";
  gDialog.bottomRightBorderRadiusYMenulist.value = (brCorner && brCorner.length == 2) ? brCorner[1] : "";

  gDialog.topLeftBorderRadiusXMenulist.parentNode.parentNode.hidden = sameFourCorners;
  gDialog.topRightBorderRadiusXMenulist.parentNode.parentNode.hidden = sameFourCorners;
  gDialog.bottomLeftBorderRadiusXMenulist.parentNode.parentNode.hidden = sameFourCorners;
  gDialog.bottomRightCornerLabel.style.visibility = sameFourCorners ? "hidden" : "visible";
  gDialog.sameFourCornersCheckbox.checked = sameFourCorners;
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

function ApplyBorderRadius(aElt)
{
  var id = aElt.id;
  var elts = [];
  var property = "";
  switch (id) {
    case "topLeftBorderRadiusXMenulist":
    case "topLeftBorderRadiusYMenulist":
      elts.push("topLeftBorderRadiusXMenulist");
      elts.push("topLeftBorderRadiusYMenulist");
      property = "border-top-left-radius";
      break;
    case "topRightBorderRadiusXMenulist":
    case "topRightBorderRadiusYMenulist":
      elts.push("topRightBorderRadiusXMenulist");
      elts.push("topRightBorderRadiusYMenulist");
      property = "border-top-right-radius";
      break;
    case "bottomLeftBorderRadiusXMenulist":
    case "bottomLeftBorderRadiusYMenulist":
      elts.push("bottomLeftBorderRadiusXMenulist");
      elts.push("bottomLeftBorderRadiusYMenulist");
      property = "border-bottom-left-radius";
      break;
    case "bottomRightBorderRadiusXMenulist":
    case "bottomRightBorderRadiusYMenulist":
      elts.push("bottomRightBorderRadiusXMenulist");
      elts.push("bottomRightBorderRadiusYMenulist");
      property = "border-bottom-right-radius";
      break;
  }
  var str = gDialog[elts[0]].value;
  str += ((str || gDialog[elts[1]].value) ? " " + gDialog[elts[1]].value : "");
  str = str.trim();
  if (gDialog.sameFourCornersCheckbox.checked)
    ApplyStyles([
                  {
                    property: "border-radius",
                    value: str
                  }
                ]);
  else
	  ApplyStyles([
	                {
	                  property: property,
	                  value: str
	                }
	              ]);
}

function ToggleSameFourCorners(aElt)
{
  var sameFourCorners = aElt.checked;
  if (sameFourCorners) {
    var brCX = gDialog.bottomRightBorderRadiusXMenulist.value;
    var brCY = gDialog.bottomRightBorderRadiusYMenulist.value;
    gDialog.topLeftBorderRadiusXMenulist.value = brCX;
    gDialog.topRightBorderRadiusXMenulist.value = brCX;
    gDialog.bottomLeftBorderRadiusXMenulist.value = brCX;
    gDialog.topLeftBorderRadiusYMenulist.value = brCY;
    gDialog.topRightBorderRadiusYMenulist.value = brCY;
    gDialog.bottomLeftBorderRadiusYMenulist.value = brCY;
	  var str = brCX;
	  str += ((str || brCY) ? " " + brCY : "");
    ApplyStyles([
                  {
                    property: "border-radius",
                    value: str.trim()
                  }
                ]);
  }
  gDialog.topLeftBorderRadiusXMenulist.parentNode.parentNode.hidden = sameFourCorners;
  gDialog.topRightBorderRadiusXMenulist.parentNode.parentNode.hidden = sameFourCorners;
  gDialog.bottomLeftBorderRadiusXMenulist.parentNode.parentNode.hidden = sameFourCorners;
  gDialog.bottomRightCornerLabel.style.visibility = sameFourCorners ? "hidden" : "visible";
}

