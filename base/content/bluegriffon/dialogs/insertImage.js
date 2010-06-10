Components.utils.import("resource://gre/modules/cssHelper.jsm");
Components.utils.import("resource://gre/modules/editorHelper.jsm");
Components.utils.import("resource://gre/modules/urlHelper.jsm");

function Startup()
{
  GetUIElements();
  gDialog.previewImage.addEventListener("load", PreviewImageLoaded, true);

  var docUrl = EditorUtils.getDocumentUrl();
  var docUrlScheme = UrlUtils.getScheme(docUrl);
  if (docUrlScheme && docUrlScheme != "resource") {
    gDialog.relativeURLCheckbox.disabled = false;
    gDialog.relativeURLCheckboxWarning.hidden = true;
  }

  gDialog.enableRotationCheckbox.checked = false;
  ToggleRotation();
  ResetRotation();

  gDialog.cssToggler.init();
  document.documentElement.getButton("accept").setAttribute("disabled", "true");
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
  var useCSS = CssUtils.getUseCSSPref();
  var angle = parseInt(gDialog.rotator.value);
  var hCenter = gDialog.horizPosition.value + (gDialog.horizPositionUnit.value == "px") ? "px" : "%";
  var vCenter = gDialog.vertPosition.value + (gDialog.vertPositionUnit.value == "px") ? "px" : "%";

  var imgElement = EditorUtils.getCurrentDocument().createElement("img");
  imgElement.setAttribute("src", url);
  imgElement.setAttribute("alt", altText);
  if (title)
    imgElement.setAttribute("title", title);

  switch (useCSS)
  {
    case 0: // HTML attributes only
      if (w != gNaturalWidth)
        imgElement.setAttribute("width", w);
      if (w != gNaturalHeight)
        imgElement.setAttribute("height", h);
      break;

    case 1: // use style attribute
      {
        var styleAttr = "";
        if (angle)
          styleAttr += "-moz-transform: rotate(" + angle + "deg);";
        if (hCenter != "50%" || vCenter != "50%")
          styleAttr += "-moz-transform-origin: " + hCenter + " " + vCenter + ";";
        if (w != gNaturalWidth)
          styleAttr += "width: " + w + "px;" ;
        if (h != gNaturalHeight)
          styleAttr += "height: " + h + "px;" ;

        imgElement.setAttribute("style", styleAttr)
      }
      break;

    case 2: // use embedded stylesheets
      {
        var cssToggler = gDialog.cssToggler;
        var selectorText = (cssToggler.newID ?   '#' + cssToggler.newID : "") +
                           (cssToggler.newClass? '.' + cssToggler.newClass : "");
        var properties = [];
        if (angle)
          properties.push({ priority: false,
                            property: "-moz-transform",
                            value: "rotate(" + angle + "deg)"
                          });
        if (hCenter != "50%" || vCenter != "50%")
          properties.push({ priority: false,
                            property: "-moz-transform-origin",
                            value: hCenter + " " + vCenter
                          });
        if (w != gNaturalWidth)
          properties.push({ priority: false,
                            property: "width",
                            value: w + "px"
                          });
        if (w != gNaturalHeight)
          properties.push({ priority: false,
                            property: "height",
                            value: h + "px"
                          });
        CssUtils.addRuleForSelector(EditorUtils.getCurrentDocument(),
                                    selectorText,
                                    properties);
        if (cssToggler.newID)
          imgElement.setAttribute("id", cssToggler.newID);
        if (cssToggler.newClass)
          imgElement.setAttribute("class", cssToggler.newClass);

      }
      break;

    case 3: // reuse ID or class
      {
        var styleAttr = "";
        if (w != gNaturalWidth)
          styleAttr += "width: " + w + "px;" ;
        if (h != gNaturalHeight)
          styleAttr += "height: " + h + "px;" ;

        imgElement.setAttribute("style", styleAttr)

	      if (gDialog.cssToggler.reusedID)
	        imgElement.setAttribute("id", gDialog.cssToggler.reusedID);
	      if (gDialog.cssToggler.reusedClass)
	        imgElement.setAttribute("class", gDialog.cssToggler.reusedClass);
      }
      break;

    default: break;
  }

  EditorUtils.getCurrentEditor().insertElementAtSelection(imgElement, true);
}


function LoadImage()
{
  var img = document.createElementNS("http://www.w3.org/1999/xhtml", "img");
  gDialog.previewImage.parentNode.appendChild(img);
  gDialog.previewImage.removeEventListener("load", PreviewImageLoaded, true);
  gDialog.previewImage.parentNode.removeChild(gDialog.previewImage);
  img.setAttribute("id", "previewImage");
  gDialog.previewImage = img;
  img.addEventListener("load", PreviewImageLoaded, true);
  img.setAttribute("src", UrlUtils.makeAbsoluteUrl(gDialog.imageURLTextbox.value.trim()));
  UpdateButtons();
}

function UpdateButtons()
{
  gDialog.cssToggler.updateButtons();
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

  gDialog.preserveRatioButton.setAttribute("preserveRatio", "true");
  gDialog.widthTextbox.value = gNaturalWidth;
  gDialog.heightTextbox.value = gNaturalHeight;
  gDialog.unitTypeMenulist.value = "px";

  gDialog.enableRotationCheckbox.checked = false;
  ToggleRotation();
  ResetRotation();
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
  gDialog.previewImage.style.MozTransform = "rotate(" + angle + "deg)";
}

function ResetRotation()
{
  gDialog.rotator.value = 0;
  gDialog.horizPosition.value = "50";
  gDialog.vertPosition.value = "50";
  gDialog.horizPositionUnit.value = "percent";
  gDialog.vertPositionUnit.value = "percent";
}

