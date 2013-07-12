Components.utils.import("resource://app/modules/editorHelper.jsm");

function ToggleProperty(aElt)
{
  var checked   = aElt.hasAttribute("checked");
  var value = (aElt.hasAttribute("value") ? aElt.getAttribute("value") : aElt.value);
  if (!checked &&
      (aElt.nodeName.toLowerCase() == "checkbox" || aElt.getAttribute("type") == "checkbox"))
    value = "";
  var property  = aElt.getAttribute("property");
  var resetter  = aElt.getAttribute("resetter");
  var group     = aElt.getAttribute("group");
  var agregator = aElt.getAttribute("agregator");

  var others = [];
  if (agregator)
    others = document.querySelectorAll("[agregator='" + agregator + "']");
  else if (group)
    others = document.querySelectorAll("[group='" + group + "']");

  for (var i = 0; i < others.length; i++) {
    var e = others[i];
    if (e != aElt) {
      if (resetter == aElt.id
          || resetter == e.id
          || group) {
        e.removeAttribute("checked");
      }
      else {
        if (agregator && e.hasAttribute("checked"))
          value += " " + e.getAttribute("value");
      }
    }
  }
  ApplyLocalITS([ { property: property, value: value} ]);
}

function CheckToggle(aToggle, aChecked)
{
  if (aChecked)
    aToggle.setAttribute("checked", "true");
  else
    aToggle.removeAttribute("checked");
}

function Toggle(aToggle, aChecked)
{
  if (aChecked) {
    aToggle.setAttribute("checked", "true");
    var group  = aToggle.getAttribute("group");
    if (group) {
      var elts = document.querySelectorAll("toolbarbutton[group='" + group + "']");
      for (var elt of elts)
        if (elt != aToggle)
          elt.removeAttribute("checked");
    }
  }
}

function ApplyLocalITS(aValues)
{
  var editor = EditorUtils.getCurrentEditor();
  editor.beginTransaction();

  for (var i = 0; i < aValues.length; i++) {
    var val = aValues[i];
    if (val.value)
      editor.setAttribute(gCurrentElement, val.property, val.value);
    else
      editor.removeAttribute(gCurrentElement, val.property);
  }

  editor.endTransaction();
  ReflowGlobalRulesInUI(gCurrentElement);
}

function ToggleSection(aEvent, header)
{
  if (aEvent && aEvent.button) // only first button...
    return;

  var section = header.nextElementSibling;
  if (header.hasAttribute("open")) {
    section.style.height = "0px";
    header.removeAttribute("open");
  }
  else {
    section.style.height = "";
    header.setAttribute("open", "true");
    section.style.height = document.defaultView.getComputedStyle(section, "").getPropertyValue("height");
  }
  document.persist(header.id, "open");
  document.persist(section.id, "style");
}

function DeleteLocalRule(aEvent, aDeleter)
{
  aEvent.stopPropagation();
  aEvent.preventDefault();
  aDeleter();
}
