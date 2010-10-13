function InitDialog()
{
  if (!gNode)
    return;

  var rows = gDialog.mainGrid.querySelectorAll("row");
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var attr = row.getAttribute("attribute");
    var child = row.firstElementChild.nextElementSibling;
    switch (child.nodeName.toLowerCase()) {
      case "checkbox":
        child.checked = gNode.hasAttribute(attr);
        break;
      case "textbox":
      case "menulist":
        child.value = gNode.hasAttribute(attr) ?
                          gNode.getAttribute(attr) :
                          "";
        break;
      case "hbox":
        {
          var c = child.firstElementChild;
          var value = gNode.hasAttribute(attr) ?
                          gNode.getAttribute(attr) :
                          "";
          while (c) {
            if (c.getAttribute("value") == value)
              c.setAttribute("checked", "true");
            else
              c.removeAttribute("checked");
            c = c.nextElementSibling;
          }
        }
        break;
      default: break; // should never happen
    }
  }
}

function ApplyAttributes()
{
  var rows = gDialog.mainGrid.querySelectorAll("row");
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var attr = row.getAttribute("attribute");
    if (!row.collapsed) {
      var child = row.firstElementChild.nextElementSibling;
      switch (child.nodeName.toLowerCase()) {
        case "checkbox":
          if (child.checked)
            gEditor.setAttribute(gNode, attr, attr);
          else
            gEditor.removeAttribute(gNode, attr);
          break;
        case "textbox":
        case "menulist":
          if (child.value)
            gEditor.setAttribute(gNode, attr, child.value);
          else
            gEditor.removeAttribute(gNode, attr);
          break;
        case "hbox":
          {
            var c = child.firstElementChild;
            while (c) {
              if (c.hasAttribute("checked")) {
                gEditor.setAttribute(gNode, attr, child.getAttribute("value"));
                break;
              }
              c = c.nextElementSibling;
            }
            if (!c)
              gEditor.removeAttribute(gNode, attr);
          }
          break;
        default: break; // should never happen
      }
    }
  }
}
