var gClassifications = null;
var gFontLists = {};

function SendRequest(aURL, aCallback, aContext)
{
  var req = new XMLHttpRequest();
  req.open('GET', aURL, aCallback, true);
  req.onreadystatechange = function (aEvt) {
    if (req.readyState == 4) {
      gDialog.ThrobberButton.hidden = true;
       if(req.status == 200) {
        aCallback(req.responseText, aContext);
       }
       else
        alert(req.status);
    }
  };
  gDialog.ThrobberButton.hidden = false;
  req.send(null);
}

function GetClassifications()
{
  SendRequest(kCLASSIFICATIONS_QUERY_URL, UpdateClassifications);
}


function Startup()
{
  GetUIElements();
  try {
    var prose = GetPrefs().getCharPref("extension.fs.preview.prose");
    gDialog.previewTextbox.value = prose;
  }
  catch(e) {}

  GetClassifications();
}

function UpdateClassifications(aJSON)
{
  gClassifications = JSON.parse(aJSON);
  for (var i = 0; i < gClassifications.length; i++) {
    var c = gClassifications[i];
    var item = document.createElement("listitem");
    item.setAttribute("label", c.name.replace( /%20/g, " ") + " (" + c.count + ")");
    item.setAttribute("value", c.name);
    gDialog.classificationsBox.appendChild(item);
  }
}

function onClassificationSelected(aElt)
{
  if (!aElt.selectedItem)
    return;

  gDialog.preview.setAttribute("src", "");

  var classification = aElt.selectedItem.getAttribute("value");
  if (classification in gFontLists)
    ShowFontList(classification);
  else
    SendRequest(kFONTLIST_QUERY_URL + classification, UpdateFontList, classification);
}

function UpdateFontList(aJSON, aClassification)
{
  gFontLists[aClassification] = JSON.parse(aJSON);
  ShowFontList(aClassification);
}

function ShowFontList(aClassification)
{
  // clean the font list
  var child = gDialog.fontListBox.lastElementChild;
  while (child && child.nodeName.toLowerCase() != "listcols") {
    var tmp = child.previousElementSibling;
    gDialog.fontListBox.removeChild(child);
    child = tmp;
  }
  for (var i = 0; i < gFontLists[aClassification].length; i++) {
    var f = gFontLists[aClassification][i];
    var item = document.createElement("listitem");
    item.setAttribute("label", f.family_name);
    item.setAttribute("value", i);
    item.setAttribute("classification", aClassification);
    gDialog.fontListBox.appendChild(item);
  }
}

function onFontSelected(aElt)
{
  if (!aElt.selectedItem)
    return;

  var fontIndex      = aElt.selectedItem.getAttribute("value");
  var classification = aElt.selectedItem.getAttribute("classification");
  var font = gFontLists[classification][fontIndex];
  var url = kPREVIEW_URL.replace( /%id/g, font.id)
                        .replace( /%ttf/g, font.font_filename)
                        .replace( /%w/g, gDialog.previewBox.boxObject.width)
                        .replace( /%text/g, escape(gDialog.previewTextbox.value));
  gDialog.ThrobberButton.hidden = false;
  gDialog.preview.setAttribute("src", url);
}

function UpdatePreview()
{
  gTimeout = null;
  gDialog.preview.setAttribute("src", "");
  GetPrefs().setCharPref("extension.fs.preview.prose", gDialog.previewTextbox.value);
  onFontSelected(gDialog.fontListBox);
}

var gTimeout = null;

function UpdatePreviewOnResize()
{
  if (gTimeout)
    clearTimeout(gTimeout);

  gTimeout = setTimeout(UpdatePreview, 500);
}
