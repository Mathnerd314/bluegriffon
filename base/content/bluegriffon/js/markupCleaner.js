Components.utils.import("resource://app/modules/editorHelper.jsm");

var MarkupCleaner = {
  onlyWhiteTextNodesStartingAtNode: function(node, acceptOneBR)
  {
    var result = true;
    var brOccurences = 0;
    while (node && result)
    {
      if (node.nodeType != Node.TEXT_NODE)
      {
        if (acceptOneBR &&
            node.nodeType == Node.ELEMENT_NODE &&
            node.nodeName.toLowerCase() == "br")
        {
          brOccurences++;
           if (brOccurences > 1)
             result = false;
        }
        else
          result = false;
      }
      else
        result = RegExp( /^\s*$/ ).test(node.data);
      node = node.nextSibling;
    }
    return result;
  },

  runCleanup: function(aClearReport, aIncreaseReport)
  {
    if (aClearReport)
    {
      aClearReport(gDialog.nestedListsReport, gDialog.nestedListsCheckbox);
      aClearReport(gDialog.trailinBRReport,   gDialog.trailinBRCheckbox);
      aClearReport(gDialog.emptyBlocksReport, gDialog.emptyBlocksCheckbox);
      aClearReport(gDialog.emptyCellsReport,  gDialog.emptyCellsCheckbox);
    }

    function acceptNode(node, nestedLists, trailingBR, emptyBLocks, emptyCells)
    {
      // TBD : useless test below
      if (node.nodeType == Node.ELEMENT_NODE)
      {
        var tagName = node.nodeName.toLowerCase();
        switch (tagName)
        {
          case "br":
            if ((!gDialog.trailinBRCheckbox || gDialog.trailinBRCheckbox.checked) &&
                 MarkupCleaner.onlyWhiteTextNodesStartingAtNode(node.nextSibling, false))
              return NodeFilter.FILTER_ACCEPT;
            break;
  
          case "ul":
          case "ol":
            if (!gDialog.nestedListsCheckbox || gDialog.nestedListsCheckbox.checked)
            {
              var parentTagName = node.parentNode.nodeName.toLowerCase();
              if (parentTagName == "ul" || parentTagName == "ol")
                return NodeFilter.FILTER_ACCEPT;
            }
            break;
  
          case "p":
          case "div":
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            if ((!gDialog.emptyBlocksCheckbox || gDialog.emptyBlocksCheckbox.checked) &&
                 MarkupCleaner.onlyWhiteTextNodesStartingAtNode(node.firstChild, true))
              return NodeFilter.FILTER_ACCEPT;
            break;
  
          case "td":
          case "th":
            if ((!gDialog.emptyCellsCheckbox || gDialog.emptyCellsCheckbox.checked) &&
                MarkupCleaner.onlyWhiteTextNodesStartingAtNode(node.firstChild, true))
              return NodeFilter.FILTER_ACCEPT;
            break;
            
        }
      }
      return NodeFilter.FILTER_SKIP;
    }
  
    var editor = EditorUtils.getCurrentEditor();
    var theDocument = editor.document;
    var treeWalker = theDocument.createTreeWalker(theDocument.documentElement,
                                                  NodeFilter.SHOW_ELEMENT,
                                                  acceptNode,
                                                  true);
    if (treeWalker) {
      var theNode = treeWalker.nextNode(), tmpNode;
      editor.beginTransaction();
  
      while (theNode) {
        var tagName = theNode.nodeName.toLowerCase();
        if (tagName == "ul" || tagName == "ol")
        {
          var liNode = theNode.previousSibling;
          while (liNode && liNode.nodeName.toLowerCase() != "li")
            liNode = liNode.previousSibling;
  
          tmpNode = treeWalker.nextNode();
          if (liNode)
          {
            editor.deleteNode(theNode);
            // editor.insertNodeAfter(theNode, liNode, null);
            editor.insertNode(theNode, liNode, liNode.childNodes.length);
            if (aIncreaseReport)
              aIncreaseReport(gDialog.nestedListsReport);
          }
          theNode = tmpNode;
        }
  
        else if (tagName == "br")
        {
          tmpNode = treeWalker.nextNode();
          var parentTagName = theNode.parentNode.nodeName.toLowerCase();
          if (parentTagName != "td" && parentTagName != "th")
          {
            editor.deleteNode(theNode)
            if (aIncreaseReport)
              aIncreaseReport(gDialog.trailinBRReport);
          }
  
          theNode = tmpNode;
        }
        
        else if (tagName == "td" || tagName == "th")
        {
          if (theNode.hasAttribute("align") ||
              theNode.hasAttribute("valign"))
          {
            editor.removeAttribute(theNode, "align");
            editor.removeAttribute(theNode, "valign");
            if (aIncreaseReport)
              aIncreaseReport(gDialog.emptyCellsReport);
  
          }
          theNode = treeWalker.nextNode();
        }
  
        else
        {
          tmpNode = treeWalker.nextNode();
          editor.deleteNode(theNode)
          if (aIncreaseReport)
            aIncreaseReport(gDialog.emptyBlocksReport);
  
          theNode = tmpNode;
        }
      }
  
      editor.endTransaction();
    
    }
    return false;
  }

};

