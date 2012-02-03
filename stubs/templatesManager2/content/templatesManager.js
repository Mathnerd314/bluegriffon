Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://app/modules/editorHelper.jsm");
Components.utils.import("resource://app/modules/prompterHelper.jsm");

const kMANIFEST_URL = "http://bluegriffon.org/pings/templates.xml"

var gTemplates = null;
var gFamilies = {};
var gSearchStylesheet = null;

function Startup()
{
  GetUIElements();

    var sheets = document.styleSheets;
    for (var i = 0; i < sheets.length; i++)
    {
      var sheet = sheets.item(i);
      if ("chrome://templatesmanager/skin/search.css" == sheet.href)
      {
        gSearchStylesheet = sheet;
        break;
      }
    }

  var req = new XMLHttpRequest();
  req.open('GET', kMANIFEST_URL + "?time=" + Date.parse(new Date()), true);
  req.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;  
  req.onload = function() {
    gDialog.throbber.setAttribute("hidden", "true");
    gTemplates = req.responseXML;
    ShowFamilies();
  }
  req.onerror = function() {
    gDialog.throbber.setAttribute("hidden", "true");
    PromptUtils.alertWithTitle(
           gDialog.templatesManagerBundle.getString("loadManifest"),
           gDialog.templatesManagerBundle.getString("errorLoadingManifest"),
           window);
  }
  gDialog.throbber.removeAttribute("hidden");
  req.send(null);
}

function ShowFamilies()
{
  var families = gTemplates.querySelectorAll("family");
  for (var i = 0; i < families.length; i++) {
    var family = families[i].getAttribute("name");
    gFamilies[family] = families[i];
  }

  for (var i in gFamilies) {
    var item = document.createElement("listitem");
    item.setAttribute("family", i);
    var cell1 = document.createElement("listcell");
    cell1.setAttribute("label", i);
    var cell2 = document.createElement("listcell");
    cell2.setAttribute("label", gFamilies[i].childElementCount);
    item.appendChild(cell1);
    item.appendChild(cell2);
    gDialog.templateFamiliesListbox.appendChild(item);
  }
}

function ShowTemplatesForFamily(aListbox)
{
  HidePreview();
  ClearSearchBox();
  if (aListbox.selectedCount && aListbox.selectedItem) {

    gDialog.visitWebsiteButton.removeAttribute("disabled");

    var child = gDialog.templatesDescription.firstChild;
    while (child) {
      var tmp = child.nextSibling;
      gDialog.templatesDescription.removeChild(child);
      child = tmp;
    }

    var family = aListbox.selectedItem.getAttribute("family");

    gDialog.visitWebsiteButton.setAttribute("url",
      gFamilies[family].getAttribute("info"));

    var author = gFamilies[family].getAttribute("name");

    var template = gFamilies[family].firstElementChild;
    while(template) {
      var name = template.getAttribute("shortName");
      var license = GetTemplateInfo(template, "license");
      var download = GetTemplateInfo(template, "package");
      var thumbnail = GetTemplateInfo(template, "thumbnail");
      var description = GetTemplateInfo(template, "description");
      var preview = GetTemplateInfo(template, "preview");
      var demo = GetTemplateInfo(template, "demo");

      var docTemplate = document.createElement("docTemplate");
      docTemplate.setAttribute("name", name);
      docTemplate.setAttribute("author", author);
      docTemplate.setAttribute("license", license);
      docTemplate.setAttribute("download", download);
      docTemplate.setAttribute("thumbnail", thumbnail);
      docTemplate.setAttribute("description", description);
      docTemplate.setAttribute("demo", demo);
      docTemplate.setAttribute("preview", preview);

      docTemplate.setAttribute("LCname", name.toLowerCase());
      docTemplate.setAttribute("LCauthor", author.toLowerCase());
      docTemplate.setAttribute("LClicense", license.toLowerCase());
      docTemplate.setAttribute("LCdescription", description.toLowerCase());

      gDialog.templatesDescription.appendChild(docTemplate);

      template = template.nextElementSibling;
    }
  }
}

function GetTemplateInfo(aTemplate, aTag)
{
  var node = aTemplate.querySelector(aTag);
  return (node ? node.textContent : "");
}

function ShowPreview(aTemplate)
{
  if (aTemplate.getAttribute("preview")) {
    gDialog.infoBox.className = "previewMode";
    gDialog.previewBox.setAttribute("src", aTemplate.getAttribute("preview"));
    gDialog.backButton.removeAttribute("disabled");
  }
}

function HidePreview()
{
  gDialog.infoBox.className = "";
  gDialog.backButton.setAttribute("disabled", "true");
  gDialog.previewBox.setAttribute("src", "about:blank");
}

function ShowDemo(aTemplate)
{
  if (aTemplate.getAttribute("demo")) {
    loadExternalURL(aTemplate.getAttribute("demo"));
  }
}

function SelectTemplate(aTemplate)
{
	var bundle = document.getElementById("addonRequiredBundle");
	Services.prompt.alert(window,
	                      bundle.getString("FeatureRequiresAnAddOn"),
	                      bundle.getString("VisitBlueGriffonCom"));
	loadExternalURL("http://www.bluegriffon.com/index.php?pages/One-click-Templates");
}

// If you read this, it's probably because you're trying to enable the missing
// features of this add-on... Don't waste your time, the code is was removed, eh.

function CheckEmptyness(aElt)
{
  if (aElt.value)
  {
    aElt.setAttribute("searching", "true");
    ClobberStylesheet(gSearchStylesheet);
    AddSearchRules(aElt.value.toLowerCase(), gSearchStylesheet);

    gSearchStylesheet.disabled = false;
  }
  else if (aElt.hasAttribute("searching"))
  {
    aElt.removeAttribute("searching");
    gSearchStylesheet.disabled = true;
  }
}

function ClearSearchBox()
{
  if (!gDialog.searchBox.value)
    return;
  gDialog.searchBox.value = "";
  CheckEmptyness(gDialog.searchBox);
}

function ClobberStylesheet(aSheet)
{
  var rules = aSheet.cssRules;
  for (var i = rules.length -1 ; i >= 0; i--)
    aSheet.deleteRule(i);
}

function AddSearchRules(aStr, aSheet)
{
  var attrs = [ "LCname",
                "LCauthor",
                "LClicense",
                "LCdescription"
              ];
  aSheet.insertRule("docTemplate { display: none; }", 0);
  for (var i = 0; i < attrs.length; i++)
  {
    aSheet.insertRule(
                       "docTemplate[" + attrs[i] + "*='" + aStr + "'] { display: -moz-box; }",
                       i + 1
                     );
  }
}

function VisitWebsite()
{
  loadExternalURL(gDialog.visitWebsiteButton.getAttribute("url"));
}
