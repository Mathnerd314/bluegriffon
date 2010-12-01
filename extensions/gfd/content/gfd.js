Components.utils.import("resource://app/modules/editorHelper.jsm");

function Startup()
{
  GetUIElements();

  var doc = EditorUtils.getCurrentDocument();
  var query = "head > link[href^='" + kLOADER_URL + "'][rel='stylesheet'], " +
              "head > link[href^='" + kLOADER_URL.replace( /\&/g, "&amp;") + "'][rel='stylesheet'] ";
  var links = doc.querySelectorAll(query);
  for (var i = 0; i < links.length; i++) {
    var l = links[i];
    var url = l.getAttribute("href");
    var params = url.substr(kLOADER_URL.length);

    var families = params.split("|");
    for (var j = 0; j < families.length; j++) {
      var f = families[j];
      var m = f.match( /([^\:|\&]*)(:([^|&]*))?((&|&amp;)subset=(.*))?/ );
      var family = m[1].replace(/\+/g, " ");
      var variants = m[3];
      var subsets = m[6];

      var treeitem  = document.createElement("treeitem");
      var treerow   = document.createElement("treerow");
      var treecell1 = document.createElement("treecell");
      var treecell2 = document.createElement("treecell");
      var treecell3 = document.createElement("treecell");
      treecell1.setAttribute("label", family);
      treecell2.setAttribute("label", variants ? variants : "");
      treecell3.setAttribute("label", subsets ? subsets : "");
      treerow.appendChild(treecell1);
      treerow.appendChild(treecell2);
      treerow.appendChild(treecell3);
      treeitem.appendChild(treerow)
      gDialog.installedFontsTreechildren.appendChild(treeitem);
    }
  }
}