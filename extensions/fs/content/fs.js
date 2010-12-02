var gFonts = {};
var gCounts = {};

function GetFontFamiliesList()
{
	var req = new XMLHttpRequest();
	req.open('GET', KFONT_FACE_URL, true);
	req.onreadystatechange = function (aEvt) {
	  if (req.readyState == 4) {
      gDialog.ThrobberButton.hidden = true;
	     if(req.status == 200) {
        var hp = new htmlParser(gDialog.parserIframe);
        hp.parseHTML(req.responseText,
                     KFONT_FACE_URL,
                     function(aDoc, ctx) { ParseFontFamiliesList(aDoc); },
                     hp);
       }
	     else
	      alert(req.status);
	  }
	};
  gDialog.ThrobberButton.hidden = false;
	req.send(null);
}

function ParseFontFamiliesList(aDoc)
{
  var fontInfoTable = aDoc.querySelector("." + KFONTLIST_TABLE_CLASSNAME);
  var rows = fontInfoTable.querySelectorAll("tr");
  var superFamily = "";
  for (var i = 0; i < rows.length ; i ++) {
    var row = rows[i];
    if (row.firstElementChild.nodeName.toLowerCase() == "th") {
      superFamily = row.textContent;
      gFonts[superFamily] = {};
      gCounts[superFamily] = 0;
    }
    else {
      var fontInfos = row.querySelectorAll("." + FONT_CLASSNAME);
      for (var j = 0; j < fontInfos.length; j++) {
        var f = fontInfos[j];
        var name = f.querySelector(KFONT_NAME_QUERY).textContent;
        var previewURL = f.nextElementSibling.querySelector(kFONT_PREVIEW_IMAGE_QUERY).src;
        gFonts[superFamily][name] = previewURL;
        gCounts[superFamily]++;
      }
    }
  }

  for (var i in gFonts) {
    var item = document.createElement("listitem");
    item.setAttribute("label", i + " (" + gCounts[i] + ")");
    item.setAttribute("value", i);
    gDialog.superFamiliesBox.appendChild(item);
  }
}

function Startup()
{
  GetUIElements();

  GetFontFamiliesList();
}

function onSuperFamilySelected(aElt)
{
  if (!aElt.selectedItem)
    return;

  gDialog.preview.setAttribute("src", "");
  var child = gDialog.familiesBox.lastElementChild;
  while (child && child.nodeName.toLowerCase() != "listcols") {
    var tmp = child.previousElementSibling;
    gDialog.familiesBox.removeChild(child);
    child = tmp;
  }

  var superFamily = aElt.selectedItem.getAttribute("value");
  for (var i in gFonts[superFamily]) {
    var item = document.createElement("listitem");
    item.setAttribute("label", i);
    item.setAttribute("value", i);
    gDialog.familiesBox.appendChild(item);
  }
}

function onFontSelected(aElt)
{
  if (!aElt.selectedItem)
    return;

  gDialog.ThrobberButton.hidden = false;
  var url = gFonts[gDialog.superFamiliesBox.selectedItem.getAttribute("value")][aElt.selectedItem.getAttribute("value")];
  gDialog.preview.setAttribute("src", url.replace( /size=18/g, "size=26"));
  gDialog.preview.style.height = "";
}
