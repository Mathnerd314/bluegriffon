function InitSelectorGroupbox(aQueryLanguage)
{
  switch (aQueryLanguage) {
    case "css":   gDialog.cssSelectorLabel.hidden = false; gDialog.xpathSelectorLabel.hidden = true;  break;
    case "xpath": gDialog.cssSelectorLabel.hidden = true;  gDialog.xpathSelectorLabel.hidden = false; break;
    default: break; // should never happen
  }
}

function MagicButton(node, aQueryLanguage, doc)
{
  var selector = "";

  switch (aQueryLanguage) {
    case "css":
      while (node && node.localName.toLowerCase() != "html") {
        if (node.id) {
          selector = "#" + node.id + selector;
          break;
        }
        else {
          var count = 0;
          var sameNameCount = 0;
          if (node.previousElementSibling) {
            var sibling = node.previousElementSibling;
            while (sibling)
            {
              count++;
              if (sibling.localName == node.localName)
                sameNameCount++;
              sibling = sibling.previousElementSibling;
            }
          }
          selector = node.nodeName + (sameNameCount ? ":nth-child(" + (count+1) + ")" : "") + selector;
        }
  
        node = node.parentNode;
        if (node && node.localName.toLowerCase() != "html")
          selector = " > " + selector;
      }
      break;
    case "xpath":
	    {
        var prefix = GetPrefixForHTMLNamespace(node ? node : doc.documentElement);
        if (!prefix) {
          prefix = "html";
          doc.documentElement.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:html", "http://www.w3.org/1999/xhtml");
        }
	      selector = ComputeXPath(node, prefix).join("/");
	    }
      break;
    default: break;
  }
  gDialog.selectorTextbox.value = selector;
}

function  ComputeXPath(node, prefix, path)
{
  path = path || [];
  if (node.parentNode && !node.id) {
    path = ComputeXPath(node.parentNode, prefix, path);
  }

  if(node.previousSibling) {
    var count = 1;
    var sibling = node.previousSibling
    do {
      if(sibling.nodeType == 1 && sibling.nodeName == node.nodeName) {count++;}
      sibling = sibling.previousSibling;
    } while(sibling);
    if(count == 1) {count = null;}
  } else if(node.nextSibling) {
    var sibling = node.nextSibling;
    do {
      if(sibling.nodeType == 1 && sibling.nodeName == node.nodeName) {
        var count = 1;
        sibling = null;
      } else {
        var count = null;
        sibling = sibling.previousSibling;
      }
    } while(sibling);
  }

  if(node.nodeType == 1) {
    path.push(prefix + ":" + node.nodeName.toLowerCase()
              + (node.id ? "[@id='"+node.id+"']" : count > 0 ? "["+count+"]" : ''));
  }
  return path;
}

function GetPrefixForHTMLNamespace(aElt)
{
  var rv = "";
  for (var i = 0; i < aElt.attributes.length; i++) {
    var a = aElt.attributes[i];
    if (a.namespaceURI == "http://www.w3.org/2000/xmlns/"
        && a.nodeValue == "http://www.w3.org/1999/xhtml")
      return a.localName;
  }
  if (!rv && aElt.parentNode.nodeType == Node.ELEMENT_NODE)
    rv = GetPrefixForHTMLNamespace(aElt.parentNode)
  return rv; 
}
