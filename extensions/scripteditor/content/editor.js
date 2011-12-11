Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://app/modules/editorHelper.jsm");
Components.utils.import("resource://app/modules/l10nHelper.jsm");

var bespinEditor = null;
var gSource = {value: ""};

function _InstallBespin(aValue)
{
  var theme = null;
  try {
    theme = GetPrefs().getCharPref("bluegriffon.source.theme");
  }
  catch(e) {}

  gDialog.bespinIframe.addEventListener("load", function() {InstallBespin(gDialog.bespinIframe, theme, aValue);}, true);
  gDialog.bespinIframe.setAttribute("src", "resource://app/res/scripteditor.html");
  gDialog.bespinIframe.setAttribute("onclick", "OnBespinFocus(this)");
}

function Startup()
{
  if ("arguments" in window)
    gSource = window.arguments[0];

  GetUIElements();

  _InstallBespin(gSource.value);
}

function CommitChanges()
{
  gSource.cancelled = false;
  var bespinEditor = gDialog.bespinIframe.contentWindow.gEditor;
  gSource.value = bespinEditor.getSession().getValue();
  window.close();
}

function OnBespinFocus(aIframe)
{
  aIframe.focus();
}

function InstallBespin(aIframe, aTheme, aValue)
{
  aIframe.contentWindow.installBespin(BespinKeyPressCallback,
                                      aTheme,
                                      [],
                                      EditorUtils,
                                      SetSource, aValue);
}

function SetSource(aValue)
{
  var bespinEditor = gDialog.bespinIframe.contentWindow.gEditor;
  
  bespinEditor.getSession().setValue(aValue);
	bespinEditor.getSession().setUseWrapMode(false);
  gDialog.bespinIframe.focus();
}

function onBespinFocus(aIframe)
{
  aIframe.focus();
}

function onBespinLineBlur(aElt)
{
  aElt.value = "";
}

function onBespinLineKeypress(aEvent, aElt)
{
  var bespinEditor = gDialog.bespinIframe.contentWindow.gEditor;
  if (aEvent.keyCode == 13) {
    var line = aElt.value;
    bespinEditor.gotoLine(parseInt(line));
    onBespinLineBlur(aElt);
    onBespinFocus(gDialog.bespinIframe);
  }
  if (aEvent.keyCode == 13 ||
      (aEvent.keyCode == 27 && !aEvent.which)) { // ESC key
    gDialog.bespinToolbox1.hidden = true;
    gDialog.bespinToolbox2.hidden = true;
    gDialog.bespinIframe.focus();
  }
}

function ToggleBespinFindCaseSensitivity()
{
  var bespinIframe = gDialog.bespinIframe;
  var selPoint = bespinIframe.getUserData("selPoint");
  //bespinEditor = gDialog.bespinIframe.contentWindow.gEditor.setCursor(selPoint);
  BespinFind(bespinIframe.getUserData("findLastDirection"), true);
}

function BespinFind(aForward, aInitial)
{
    var bespinIframe = gDialog.bespinIframe;
    var bespinEditor = bespinIframe.contentWindow.gEditor;
    bespinIframe.setUserData("findLastDirection", aForward, null);
    var query = gDialog.bespinFindTextbox.value;
    var isCaseSensitive = gDialog.bespinFindCaseSensitive.checked;
    var range = null;
    if (aInitial) {
      var selection = bespinEditor.getSession().getSelection();
      if (!selection.isEmpty()) {
        var r = selection.getRange();
        var start = r.start;
        selection.setSelectionRange({ start: { row: start.row, column: start.column },
                                      end:   { row: start.row, column: start.column } });
      }
      range = bespinEditor.find(query, { backwards: false,
                                         wrap: true,
                                         caseSensitive: isCaseSensitive,
                                         wholeWord: false,
                                         regExp: false
                              });
    }
    else {
      if (aForward) {
        range = bespinEditor.findNext();
      }
      else {
        range = bespinEditor.findPrevious();
      }
    }
  
    if (!range) {
      //gDialog.bespinFindCaseSensitive.hidden = true;
      gDialog.bespinFindPrevious.hidden = true;
      gDialog.bespinFindNext.hidden = true;
      gDialog.bespinFindTextbox.className = "notfound";
      gDialog.bespinToolbox2.hidden = true;
      return false;
    }
    bespinEditor.getSession().getSelection().setSelectionRange(range, false);

    gDialog.bespinFindCaseSensitive.hidden = false;
    gDialog.bespinFindPrevious.hidden = false;
    gDialog.bespinFindNext.hidden = false;
    gDialog.bespinFindTextbox.className = "";
    gDialog.bespinToolbox2.hidden = false;
    return true;
}

function onBespinFindClear(aEvent, aElt)
{
  if (!aElt.value) {
    aElt.className = "";
    gDialog.bespinFindCaseSensitive.hidden = true;
    gDialog.bespinFindPrevious.hidden = true;
    gDialog.bespinFindNext.hidden = true;
    gDialog.bespinToolbox2.hidden = true;
  }
}

function onBespinFindKeypress(aEvent)
{
  if (aEvent.keyCode == 27 && !aEvent.which) { // ESC key
    gDialog.bespinToolbox1.hidden = true;
    gDialog.bespinToolbox2.hidden = true;
      gDialog.bespinIframe.focus();
  }
}

function BespinKeyPressCallback(aEvent)
{
#ifdef XP_MACOSX
  if (aEvent.metaKey &&
      !aEvent.ctrlKey &&
      !aEvent.altKey) {
#else
  if (!aEvent.metaKey &&
      aEvent.ctrlKey &&
      !aEvent.altKey) {
#endif
    switch (aEvent.which) {
      case 102: // meta-f
      case 114: // meta-r
        aEvent.preventDefault();
        WysiwygShowFindBar();
        break;
      case 108: // meta-l
        aEvent.preventDefault();
        gDialog.bespinToolbox1.hidden = false;
        gDialog.bespinLineTextbox.focus();
        break;
      /*case 99: // meta-c XXX Workaround for Copy horked in Bespin0.9+Gecko2
      case 120: // meta-x XXX
        {
          aEvent.preventDefault();
          var bespinEditor = EditorUtils.getCurrentSourceEditor();
          var selection = bespinEditor.selectedText;
          var clipboardSvc = Components.classes["@mozilla.org/widget/clipboard;1"].
                             getService(Components.interfaces.nsIClipboard);
          var xferable = Components.classes["@mozilla.org/widget/transferable;1"].
                         createInstance(Components.interfaces.nsITransferable);
          xferable.addDataFlavor("text/unicode");
          var s = Components.classes["@mozilla.org/supports-string;1"].
                  createInstance(Components.interfaces.nsISupportsString);
          s.data = selection;
          xferable.setTransferData("text/unicode", s, selection.length * 2);
          clipboardSvc.setData(xferable, null, Components.interfaces.nsIClipboard.kGlobalClipboard);
        }
        if (aEvent.which == 120)
          bespinEditor.selectedText = "";
        break;*/
      default:
        break;
    }
  }
}

function BespinReplace()
{
    var bespinIframe = gDialog.bespinIframe;
    var bespinEditor = bespinIframe.contentWindow.gEditor;
    var selection = bespinEditor.getSession().getSelection();
    var r = selection.getRange();
    bespinEditor.$tryReplace(r, gDialog.bespinReplaceTextbox.value)
}

function BespinReplaceAndFind()
{
  BespinReplace();
  BespinFind(true, false);
}

function BespinReplaceAll()
{
  var occurences = 0;
  var bespinIframe = gDialog.bespinIframe;;
  var bespinEditor = bespinIframe.contentWindow.gEditor;
  occurences = bespinEditor.replaceAll(gDialog.bespinReplaceTextbox.value);
  var title = L10NUtils.getString("ReplaceAll");
  var msg = L10NUtils.getString("ReplacedPart1") +
            " " +
            occurences +
            " " +
            L10NUtils.getString("ReplacedPart2");
  Services.prompt.alert(null, title, msg);
}

function WysiwygShowFindBar()
{
  gDialog.bespinToolbox1.hidden = false;
  var editor = EditorUtils.getCurrentEditor();
  var bespinIframe = gDialog.bespinIframe;
  var bespinEditor = bespinIframe.contentWindow.gEditor;
  var selectionRange = bespinEditor.getSelectionRange();
  var text = bespinEditor.getSession().getTextRange(selectionRange)
  if (text) {
    gDialog.bespinFindTextbox.value = text;
    BespinFind(true, true);
  }
  gDialog.bespinFindTextbox.focus();
}

function CloseFindBar()
{
  gDialog.bespinToolbox1.hidden = true;
  gDialog.bespinToolbox2.hidden = true;
  gDialog.bespinIframe.contentWindow.focus();
}
