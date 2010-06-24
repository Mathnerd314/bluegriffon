Components.utils.import("resource://gre/modules/editorHelper.jsm");
Components.utils.import("resource://gre/modules/cssHelper.jsm");

var gNode;
var gStyles;
var gClasses;
var gIDs;
var gDoc;

function Startup()
{
  GetUIElements();
  gNode = window.arguments[0];
  gStyles = window.arguments[1];

  if (gNode.id)
    gDialog.idTextbox.value = gNode.id;
  if (gNode.className)
    gDialog.classTextbox.value = gNode.className;

  gDoc = EditorUtils.getCurrentDocument();
  gClasses = CssUtils.getAllClassesForDocument(gDoc);
  gIDs = CssUtils.getAllIdsForDocument(gDoc); 

  var idUI = ["embeddedIdRadio", "idWarning", "idHbox"];
  var classUI = ["embeddedClassRadio", "classWarning", "classHbox"];
  var inlineUI = ["inlineStylesRadio", "inlineWarning"];

  for (var i = 0; i < classUI.length; i++)
    gDialog[classUI[i]].hidden = !gStyles.embeddedClass;
  if (gStyles.embeddedClass) {
    gDialog.cssPolicyRadiogroup.value = "class";
    gDialog.classTextbox.focus();
  }

  for (var i = 0; i < idUI.length; i++)
    gDialog[idUI[i]].hidden = !gStyles.embeddedID;
  if (gStyles.embeddedID && gNode.id) {
    gDialog.cssPolicyRadiogroup.value = "id";
    gDialog.idTextbox.focus();
  }

  for (var i = 0; i < inlineUI.length; i++)
    gDialog[inlineUI[i]].hidden = !gStyles.inline;
  var inlineMozColumnCount = gNode.style.getPropertyValue("-moz-column-count"); 
  if (gStyles.inline && inlineMozColumnCount && inlineMozColumnCount != "auto") {
    gDialog.cssPolicyRadiogroup.value = "inline";
    gDialog.inlineStylesRadio.focus();
  }
  UpdateDialog();
  window.sizeToContent();
}

function UpdateDialog()
{
  SetEnabledElement(gDialog.embeddedIdRadio, gStyles.embeddedID);
  SetEnabledElement(gDialog.embeddedClassRadio, gStyles.embeddedClass);
  SetEnabledElement(gDialog.inlineStylesRadio, gStyles.inline);
  
  var type = gDialog.cssPolicyRadiogroup.value;
  SetEnabledElementAndControl(gDialog.idTextboxLabel, (type == "id" && gStyles.embeddedID));
  SetEnabledElement(gDialog.idPickButton, (type == "id" && gStyles.embeddedID));
  SetEnabledElementAndControl(gDialog.classTextboxLabel, (type == "class" && gStyles.embeddedClass));
  SetEnabledElement(gDialog.classPickButton, (type == "class" && gStyles.embeddedClass));

  CheckIfDialogOk();
}

function CheckIfDialogOk()
{
  var type = gDialog.cssPolicyRadiogroup.value;
  switch (type) {
    case "inline":
    case "class":
      document.documentElement.getButton("accept").removeAttribute("disabled");
      break;
    case "id":
      {
        var id = gDialog.idTextbox.value;
        if (id &&
            (!gDoc.getElementById(id) || id == gNode.id))
          document.documentElement.getButton("accept").removeAttribute("disabled");
        else
          document.documentElement.getButton("accept").setAttribute("disabled", "true");
      }
      break;
    default: break;
  }
}

function ClearStylesForId(aId)
{
  try {
	  CssUtils.deleteAllLocalRulesForSelector(gDoc,
	                                          "#" + aId,
	                                          [ { property: "-moz-column-count" },
	                                            { property: "-moz-column-gap" },
	                                            { property: "-moz-column-width" },
	                                            { property: "-moz-column-rule-width" },
	                                            { property: "-moz-column-rule-style" },
	                                            { property: "-moz-column-rule-color" } ] );
  }
  catch(e) { alert(e); }
}

function ClearStylesForClass(aClass)
{
  try {
	  CssUtils.deleteAllLocalRulesForSelector(gDoc,
	                                          "." + aClass,
	                                          [ { property: "-moz-column-count" },
	                                            { property: "-moz-column-gap" },
	                                            { property: "-moz-column-width" },
	                                            { property: "-moz-column-rule-width" },
	                                            { property: "-moz-column-rule-style" },
	                                            { property: "-moz-column-rule-color" } ] );
  }
  catch(e) { alert(e); }
}

function ClearInlineStyles()
{
  var s = gNode.style;
  for (var i = 0; i < gStyles.values.length; i++) {
    var property = gStyles.values[i].property;
    s.removeProperty(property);
  }
  if (gNode.getAttribute("style") == "")
    gNode.removeAttribute("style");
}

function onAccept()
{
  var type = gDialog.cssPolicyRadiogroup.value;
  var editor = EditorUtils.getCurrentEditor();
  editor.beginTransaction();
  switch (type) {
    case "inline":
	    {
	      var s = gNode.style;
        for (var i = 0; i < gStyles.values.length; i++) {
          var property = gStyles.values[i].property;
          var value    = gStyles.values[i].value;
          if (value)
            s.setProperty(property, value, "");
          else
            s.removeProperty(property);
        }
			  if (gNode.getAttribute("style"))
			    editor.setAttribute(gNode, "style", gNode.getAttribute("style"));
        else
          editor.removeAttribute(gNode, "style");
	    }
      break;

    case "id":
      ClearInlineStyles();
      CssUtils.addRuleForSelector(gDoc,
                                  "#" + gDialog.idTextbox.value,
                                  gStyles.values);
      gNode.id = gDialog.idTextbox.value;
      break;

    case "class":
      ClearInlineStyles();
      if (gNode.id)
        CssUtils.deleteAllLocalRulesForSelector(gDoc,
                                  "#" + gDialog.idTextbox.value,
                                  gStyles.values)
      CssUtils.addRuleForSelector(gDoc,
                                  "." + gDialog.classTextbox.value,
                                  gStyles.values);
      gNode.className = gDialog.classTextbox.value;
      break;

    default: break;
  }
  editor.endTransaction();
  return true;
}

function PickIdentifierFor(aId)
{
  var prefix;
  try {
    // not sure this is needed, but I wanted to reserve user-defined
    // prefices for future use
    var useCssPref = GetPrefs().getCharPref("bluegriffon.css.id_prefix");
  }
  catch(e) { prefix = "BGelt"; }

  gDialog[aId].value = prefix + new Date().valueOf() +
                         "_" + Math.round(Math.random() * 100000);
  CheckIfDialogOk();
}
