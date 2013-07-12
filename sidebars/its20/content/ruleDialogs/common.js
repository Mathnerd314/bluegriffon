function Toggle(aElt)
{
  var group     = aElt.getAttribute("group");

  var others = [];
  if (group)
    others = document.querySelectorAll("[group='" + group + "']");

  for (var i = 0; i < others.length; i++) {
    var e = others[i];
    if (e != aElt) {
        e.removeAttribute("checked");
    }
  }
  aElt.setAttribute("checked", "true");
}
