Components.utils.import("resource://gre/modules/cssHelper.jsm");
Components.utils.import("resource://gre/modules/editorHelper.jsm");
Components.utils.import("resource://gre/modules/urlHelper.jsm");
Components.utils.import("resource://gre/modules/projectManager.jsm");

var gNode = null;

function Startup()
{
  gNode = window.arguments[0];

  GetUIElements();
  gDialog.previewImage.addEventListener("load", PreviewImageLoaded, true);

  InitDialog();

  var docUrl = EditorUtils.getDocumentUrl();
  var docUrlScheme = UrlUtils.getScheme(docUrl);
  if (docUrlScheme && docUrlScheme != "resource") {
    gDialog.relativeURLCheckbox.disabled = false;
    gDialog.relativeURLCheckboxWarning.hidden = true;
    gDialog.relativeLinkURLCheckbox.disabled = false;
    gDialog.relativeLinkURLCheckboxWarning.hidden = true;
  }

  ToggleRotation();

  document.documentElement.getButton("accept").setAttribute("disabled", "true");
  var nproj = 0;
  if ("ProjectManager" in window)
    for (var i in ProjectManager.projects)
      nproj++
  gDialog.selectfromProjectButton.hidden = (nproj == 0);
  window.sizeToContent();
#ifndef XP_MACOSX
  CenterDialogOnOpener();
#endif
}

function onAccept()
{
  // general
  var url = gDialog.imageURLTextbox.value;
  var title = gDialog.titleTextbox.value;
  var altText = gDialog.alternateTextTextbox.value;
  // dimensions
  var w = gDialog.widthTextbox.value;
  var h = gDialog.heightTextbox.value;
  if (gDialog.unitTypeMenulist.value == "percent") {
    w = w * gNaturalWidth / 100;
    h = h * gNaturalHeight / 100;
  }
  // style

  var imgElement = EditorUtils.getCurrentDocument().createElement("img");
  imgElement.setAttribute("src", url);
  imgElement.setAttribute("alt", altText);
  if (title)
    imgElement.setAttribute("title", title);

  var properties = [];

  if (w != gNaturalWidth)
    properties.push({ priority: false,
                      property: "width",
                      value: w + "px"
                    });
  if (h != gNaturalHeight)
    properties.push({ priority: false,
                      property: "height",
                      value: h + "px"
                    });

  if (!gDialog.cssClassPicker.checked || !gDialog.cssClassPicker.value) {
	  if (gDialog.borderCheckbox.checked) {
	    var borderWidth = gDialog.borderWidthLengthbox.value;
	    var borderColor = gDialog.borderColorpicker.color;
	    var borderStyle = gDialog.borderStyleMenulist.value;
	    properties.push(
	                    { priority: false,
	                      property: "border-width",
	                      value: borderWidth
	                    },
	                    { priority: false,
	                      property: "border-color",
	                      value: borderColor
	                    },
	                    { priority: false,
	                      property: "border-style",
	                      value: borderStyle
	                    }
	                   );
	  }
	  if (gDialog.horizMarginCheckbox.checked) {
	    var horizMargin = gDialog.horizMarginTextbox.value;
	    properties.push(
	                    { priority: false,
	                      property: "margin-left",
	                      value: horizMargin
	                    },
	                    { priority: false,
	                      property: "margin-right",
	                      value: horizMargin
	                    }
	                   );
	  }
	  if (gDialog.vertMarginCheckbox.checked) {
	    var vertMargin = gDialog.vertMarginTextbox.value;
	    properties.push(
	                    { priority: false,
	                      property: "margin-top",
	                      value: vertMargin
	                    },
	                    { priority: false,
	                      property: "margin-bottom",
	                      value: vertMargin
	                    }
	                   );
	  }
	  if (gDialog.floatCheckbox.checked) {
	    var floating = gDialog.floatMenulist.value;
	    properties.push(
	                    { priority: false,
	                      property: "float",
	                      value: floating
	                    }
	                   );
	  }
	  if (gDialog.enableRotationCheckbox.checked) {
	    var angle = parseInt(gDialog.rotator.value);
		  if (angle)
			  var hCenter = gDialog.horizPosition.value + ((gDialog.horizPositionUnit.value == "px") ? "px" : "%");
			  var vCenter = gDialog.vertPosition.value + ((gDialog.vertPositionUnit.value == "px") ? "px" : "%");
		    properties.push({ priority: false,
		                      property: "-moz-transform",
		                      value: "rotate(" + angle + "deg)"
		                    });
		  if (hCenter != "50%" || vCenter != "50%")
		    properties.push({ priority: false,
		                      property: "-moz-transform-origin",
		                      value: hCenter + " " + vCenter
		                    });
	  }
  }

  // finalize
  if (gDialog.cssClassPicker.checked) {
    imgElement.className = gDialog.cssClassPicker.value;
    var styleStr = "";
    for (var i = 0; i < properties.length; i++) {
      var p = properties[i];
      styleStr += p.property + ": " + p.value +
                  (p.priority ? " !important" : "") +
                  ";";
    }
    if (styleStr)
      imgElement.setAttribute("style", styleStr);
    else
      imgElement.removeAttribute("style");
    EditorUtils.getCurrentEditor().insertElementAtSelection(imgElement, true);
  }
  else {
    EditorUtils.getCurrentEditor().insertElementAtSelection(imgElement, true);
    window.openDialog("chrome://bluegriffon/content/dialogs/csspolicy.xul","_blank",
                      "chrome,modal,titlebar", imgElement,
                      { inline: true, embeddedID: true, embeddedClass: true,
                        values: properties
                      });
  }
}


function LoadImage(aResetSizeUI)
{
  var img = document.createElementNS("http://www.w3.org/1999/xhtml", "img");
  gDialog.previewImage.parentNode.appendChild(img);
  gDialog.previewImage.removeEventListener("load", PreviewImageLoaded, true);
  gDialog.previewImage.parentNode.removeChild(gDialog.previewImage);
  img.setAttribute("id", "previewImage");
  gDialog.previewImage = img;
  img.setAttribute("resetSizeUI", aResetSizeUI ? "true" : "false");
  img.addEventListener("load", PreviewImageLoaded, true);
  img.setAttribute("src", UrlUtils.makeAbsoluteUrl(gDialog.imageURLTextbox.value.trim()));
  UpdateButtons();
}

function UpdateButtons()
{
  var ok = (gDialog.imageURLTextbox.value &&
            (gDialog.emptyAltOkCheckbox.checked || gDialog.alternateTextTextbox.value));
  if (ok && gDialog.cssClassPicker.checked && !gDialog.cssClassPicker.value)
      ok = false;
  SetEnabledElement(document.documentElement.getButton("accept"), ok);
}

function MakeRelativeUrl()
{
  var spec = gDialog.imageURLTextbox.value;
  var docUrl = EditorUtils.getDocumentUrl();
  var docUrlScheme = UrlUtils.getScheme(docUrl);
  if (docUrlScheme && docUrlScheme != "resource") {
    spec = UrlUtils.makeRelativeUrl(spec);
    gDialog.imageURLTextbox.value = spec;
    gDialog.relativeURLCheckbox.checked = true;
  }
}

function SetFocusToAlt()
{
  gDialog.alternateTextTextbox.focus();
}

function MakeAbsoluteUrl()
{
  var spec = gDialog.imageURLTextbox.value;
  var docUrl = EditorUtils.getDocumentUrl();
  var docUrlScheme = UrlUtils.getScheme(docUrl);
  if (docUrlScheme && docUrlScheme != "resource") {
    spec = UrlUtils.makeAbsoluteUrl(spec);
    gDialog.imageURLTextbox.value = spec;
    gDialog.relativeURLCheckbox.checked = false;
  }
}

function ToggleRelativeOrAbsolute()
{
  if (gDialog.relativeURLCheckbox.checked) {
    MakeRelativeUrl();
  }
  else {
    MakeAbsoluteUrl();
  }
}

var gNaturalWidth = 0;
var gNaturalHeight = 0;
var gPreserveRatio = true;
var gRatio = 0;

function ResetToNaturalSize()
{
  gDialog.previewImage.setAttribute("resetSizeUI", "true");
  PreviewImageLoaded();
}

function PreviewImageLoaded()
{
  gDialog.widthTextbox.disabled = false;
  gDialog.heightTextbox.disabled = false;
  gDialog.preserveRatioButton.disabled = false;
  gDialog.unitTypeMenulist.disabled = false;
  gDialog.resetSizeButton.disabled = false;

  gNaturalWidth  = gDialog.previewImage.naturalWidth;
  gNaturalHeight = gDialog.previewImage.naturalHeight;
  gPreserveRatio = true;
  gRatio = gNaturalHeight / gNaturalWidth;

  gDialog.naturalWidthLabel.setAttribute("value", gNaturalWidth);
  gDialog.naturalHeightLabel.setAttribute("value", gNaturalHeight);

  if (gDialog.previewImage.getAttribute("resetSizeUI") == "true") {
	  gDialog.preserveRatioButton.setAttribute("preserveRatio", "true");
	  gDialog.widthTextbox.value = gNaturalWidth;
	  gDialog.heightTextbox.value = gNaturalHeight;
	  gDialog.unitTypeMenulist.value = "px";
	
	  gDialog.enableRotationCheckbox.checked = false;
	  ToggleRotation();
	  ResetRotation();
  }
  else
    InitDialog2();
}

function ToggleRotation()
{
  var disabled = !gDialog.enableRotationCheckbox.checked;
  gDialog.rotator.disabled = disabled;
  gDialog.horizPositionLabel.disabled = disabled;
  gDialog.horizPosition.disabled = disabled;
  gDialog.horizPositionUnit.disabled = disabled;
  gDialog.vertPositionLabel.disabled = disabled;
  gDialog.vertPosition.disabled = disabled;
  gDialog.vertPositionUnit.disabled = disabled;
}

function TogglePreserveRatio(aElt)
{
  if (gPreserveRatio) {
    gPreserveRatio = false;
    gDialog.preserveRatioButton.removeAttribute("preserveRatio");
  }
  else {
    gPreserveRatio = true;
    gDialog.preserveRatioButton.setAttribute("preserveRatio", "true");
  }
}

function ToggleUnit()
{
  var unit = gDialog.unitTypeMenulist.value;
  if (unit == "px") {
    gDialog.widthTextbox.value = gNaturalWidth *
                                 parseFloat(gDialog.widthTextbox.value) /
                                 100;
    gDialog.heightTextbox.value = gNaturalHeight *
                                  parseFloat(gDialog.heightTextbox.value) /
                                  100;
  }
  else if (unit == "percent") {
    gDialog.widthTextbox.value = parseFloat(gDialog.widthTextbox.value) *
                                 100 /
                                 gNaturalWidth;
    gDialog.heightTextbox.value = parseFloat(gDialog.heightTextbox.value) *
                                  100 /
                                  gNaturalHeight;
  }
}

function onWidthChanged()
{
  var w = parseFloat(gDialog.widthTextbox.value);
  var h = parseFloat(gDialog.heightTextbox.value);
  if (gPreserveRatio) {
    if (gDialog.unitTypeMenulist.value == "px")
      gDialog.heightTextbox.value = gRatio * w;
    else
      gDialog.heightTextbox.value = gRatio * w * gNaturalWidth / gNaturalHeight;
  }
  else {
    if (gDialog.unitTypeMenulist.value == "px")
      gRatio = h / w;
    else
      gRatio = (h * gNaturalHeight) / (w * gNaturalWidth);
  }
}

function onHeightChanged()
{
  var w = parseFloat(gDialog.widthTextbox.value);
  var h = parseFloat(gDialog.heightTextbox.value);
  if (gPreserveRatio) {
    if (gDialog.unitTypeMenulist.value == "px")
      gDialog.widthTextbox.value = h / gRatio;
    else
      gDialog.widthTextbox.value = h / gRatio / gNaturalWidth * gNaturalHeight;
  }
  else {
    if (gDialog.unitTypeMenulist.value == "px")
      gRatio = h / w;
    else
      gRatio = (h * gNaturalHeight) / (w * gNaturalWidth);
  }
}

var gAngle = 0;
var gRotating = false;
var gX, gY;
function StartRotate(e)
{
  gX = e.screenX;
  gY = e.screenY;
  gRotating = true;
  gDialog.rotateGrippy.setAttribute("rotating", "true");
  gDialog.rotateGrippy.setCapture(true);
}

function Rotate(e)
{
  if (!gRotating)
    return;
  var x = e.screenX;
  var y = e.screenY;
  with (Math) {
    gAngle = atan2(y - gY, x - gX) * 180 / PI;
  }
  gDialog.rotateGrippy.parentNode.style.MozTransform = "rotate(" + gAngle + "deg)";
}

function StopRotate(e)
{
  gDialog.rotateGrippy.releaseCapture();
  gDialog.rotateGrippy.removeAttribute("rotating");
  gRotating = false;
  window.focus();
}

function UpdatePreviewRotation(angle)
{
  if (gDialog.enableRotationCheckbox.checked)
    gDialog.previewImage.style.MozTransform = "rotate(" + angle + "deg)";
  else
    gDialog.previewImage.style.removeProperty("-moz-transform");
}

function ResetRotation()
{
  gDialog.rotator.value = 0;
  gDialog.horizPosition.value = "50";
  gDialog.vertPosition.value = "50";
  gDialog.horizPositionUnit.value = "percent";
  gDialog.vertPositionUnit.value = "percent";
}

function OpenInProjectPicker()
{
  var rv = { value: "" };
  window.openDialog("chrome://projectmanager/content/dialogs/inprojectPicker.xul","_blank",
                    "chrome,modal,titlebar,resizable=yes", rv, "images");  
  gDialog.imageURLTextbox.value = rv.value;
  gDialog.relativeURLCheckbox.checked = false;
  LoadImage(true);
  gDialog.alternateTextTextbox.focus();
}

function ValidateEmail(aElt) 
{ 
 var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/  ;
 if (aElt.value.match(re)) {
   gDialog.emailCheckbox.checked = true;
   gDialog.relativeLinkURLCheckbox.checked = false;
   gDialog.relativeLinkURLCheckbox.disabled = true;
 }
 else {
   gDialog.emailCheckbox.checked = false;
   gDialog.relativeLinkURLCheckbox.disabled = false;
 }
}

function MakeRelativeUrlForLink()
{
  var spec = gDialog.linkTextbox.value;
  var docUrl = EditorUtils.getDocumentUrl();
  var docUrlScheme = UrlUtils.getScheme(docUrl);
  if (docUrlScheme && docUrlScheme != "resource") {
    spec = UrlUtils.makeRelativeUrl(spec);
    gDialog.linkTextbox.value = spec;
    gDialog.relativeLinkURLCheckbox.checked = true;
  }
}

function ToggleRelativeOrAbsoluteLink()
{
  if (gDialog.relativeLinkURLCheckbox.checked) {
    MakeRelativeUrlForLink();
  }
  else {
    MakeAbsoluteUrlForLink();
  }
}

function MakeAbsoluteUrlForLink()
{
  var spec = gDialog.linkTextbox.value;
  var docUrl = EditorUtils.getDocumentUrl();
  var docUrlScheme = UrlUtils.getScheme(docUrl);
  if (docUrlScheme && docUrlScheme != "resource") {
    spec = UrlUtils.makeAbsoluteUrl(spec);
    gDialog.linkTextbox.value = spec;
    gDialog.relativeLinkURLCheckbox.checked = false;
  }
}

function CallBackFromLinkFilePicker()
{
 gDialog.emailCheckbox.checked = false;
 gDialog.relativeLinkURLCheckbox.disabled = false;
 gDialog.relativeLinkURLCheckbox.checked = false;
 MakeRelativeUrlForLink();
}

function InitDialog()
{
  if (!gNode)
    return;

  gDialog.imageURLTextbox.value = gNode.getAttribute("src");
  LoadImage(false);
  gDialog.titleTextbox.value = gNode.getAttribute("title");
  gDialog.alternateTextTextbox.value = gNode.getAttribute("alt");
}

function InitDialog2()
{
  var cs = CssUtils.getComputedStyle(gNode);
  var width  = parseFloat(cs.getPropertyValue("width"));
  var height = parseFloat(cs.getPropertyValue("height"));
  if (isNaN(width)) width = gNaturalWidth;
  if (isNaN(height)) width = gNaturalHeight;
  gDialog.preserveRatioButton.removeAttribute("preserveRatio");
  gDialog.widthTextbox.value = width;
  gDialog.heightTextbox.value = height;
  gDialog.unitTypeMenulist.value = "px";

  var borderWidth = cs.getPropertyValue("border-top-width");
  var borderStyle = cs.getPropertyValue("border-top-style");
  gDialog.borderWidthLengthbox.value = borderWidth;
  gDialog.borderStyleMenulist.value = borderStyle;
  gDialog.borderColorpicker.color = cs.getPropertyValue("border-top-color");
  gDialog.borderCheckbox.checked =  (borderWidth != "0px" || borderStyle != "none");
  gDialog.cssClassPicker.toggleCssProperty(gDialog.borderCheckbox);
  UpdatePreviewBorder();

  var hMargin = cs.getPropertyValue("margin-left");
  gDialog.horizMarginTextbox.value = hMargin;
  gDialog.horizMarginCheckbox.checked = (hMargin != "0px");
  gDialog.cssClassPicker.toggleCssProperty(gDialog.horizMarginCheckbox);

  var vMargin = cs.getPropertyValue("margin-top");
  gDialog.vertMarginTextbox.value = vMargin;
  gDialog.vertMarginCheckbox.checked = (vMargin != "0px");
  gDialog.cssClassPicker.toggleCssProperty(gDialog.vertMarginCheckbox);

  var floating = cs.getPropertyValue("float");
  gDialog.floatMenulist.value = floating;
  gDialog.floatCheckbox.checked = (floating != "none");
  gDialog.cssClassPicker.toggleCssProperty(gDialog.floatCheckbox);

  var transform = cs.getPropertyValue("-moz-transform");
  var r = /matrix\((\-?[0-9]*\.[0-9]+), (\-?[0-9]*\.[0-9]+), (\-?[0-9]*\.[0-9]+), (\-?[0-9]*\.[0-9]+)/ ;
  var m = transform.match(r);
  if (m) {
    var angle = Math.round(Math.asin(m[2]) * 180 / Math.PI);
    if (angle) {
      gDialog.rotator.value = angle;

      var origin = cs.getPropertyValue("-moz-transform-origin");
      m = origin.match( /(\-?[1-9][0-9]*|\-?[0-9]*\.[0-9]*)px (\-?[1-9][0-9]*|\-?[0-9]*\.[0-9]*)px/ );
      var originX = parseFloat(m[1]);
      var originY = parseFloat(m[2]);
      var sizeX = gNaturalWidth +
                  parseFloat(cs.getPropertyValue("border-left-width")) +
                  parseFloat(cs.getPropertyValue("border-right-width")) +
                  parseFloat(cs.getPropertyValue("padding-left")) +
                  parseFloat(cs.getPropertyValue("padding-right"));
      var sizeY = gNaturalHeight +
                  parseFloat(cs.getPropertyValue("border-top-width")) +
                  parseFloat(cs.getPropertyValue("border-bottom-width")) +
                  parseFloat(cs.getPropertyValue("padding-top")) +
                  parseFloat(cs.getPropertyValue("padding-bottom"));

      gDialog.horizPosition.value = Math.round(100 * originX / sizeX);
      gDialog.horizPositionUnit.value = "percent";
      gDialog.vertPosition.value = Math.round(100 * originY / sizeY);
      gDialog.vertPositionUnit.value = "percent";

      gDialog.enableRotationCheckbox.checked = true;
      gDialog.cssClassPicker.toggleCssProperty(gDialog.enableRotationCheckbox);
      UpdatePreviewRotation(gDialog.rotator.value);
    }
  }
  UpdateButtons();
}


function UpdatePreviewBorder()
{
  var s = gDialog.previewImage.style;
  if (gDialog.borderCheckbox.checked) {
	  s.borderColor = gDialog.borderColorpicker.color;
	  s.borderWidth = gDialog.borderWidthLengthbox.value;
	  s.borderStyle = gDialog.borderStyleMenulist.value;
  }
  else {
    s.removeProperty("border-color");
    s.removeProperty("border-style");
    s.removeProperty("border-width");
  }
}
