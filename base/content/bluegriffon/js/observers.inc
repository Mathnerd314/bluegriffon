// implements nsIObserver
var gEditorDocumentObserver =
{ 
  observe: function(aSubject, aTopic, aData)
  {
    // Should we allow this even if NOT the focused editor?
    var commandManager = EditorUtils.getCurrentCommandManager();
    if (commandManager != aSubject)
      return;

    var editor = EditorUtils.getCurrentEditor();
    gContentWindow = window.content;
    switch(aTopic)
    {
      case "obs_documentCreated":
        // placeholder; TBD
        dump("obs_documentCreated\n");

        // TBD : 1. DONE
        //       2. add override stylesheets if needed
        //       3. call "load" notifier callbacks
        //       4. update window title
        //       5. place initial selection
        //       6. check DTD strictness

        // Get state to see if document creation succeeded
        var params = EditorUtils.newCommandParams();
        if (!params)
          return;

        // TBD : RealTimeSpell.Init(editor, true);

        try {
          commandManager.getCommandState(aTopic, gContentWindow, params);
          var errorStringId = 0;
          var editorStatus = params.getLongValue("state_data");
          if (!editor && editorStatus == nsIEditingSession.eEditorOK)
          {
            dump("\n ****** NO EDITOR BUT NO EDITOR ERROR REPORTED ******* \n\n");
            editorStatus = nsIEditingSession.eEditorErrorUnknown;
          }

          switch (editorStatus)
          {
            case nsIEditingSession.eEditorErrorCantEditFramesets:
              errorStringId = "CantEditFramesetMsg";
              break;
            case nsIEditingSession.eEditorErrorCantEditMimeType:
              errorStringId = "CantEditMimeTypeMsg";
              break;
            case nsIEditingSession.eEditorErrorUnknown:
              errorStringId = "CantEditDocumentMsg";
              break;
            // Note that for "eEditorErrorFileNotFound, 
            // network code popped up an alert dialog, so we don't need to
          }
          if (errorStringId)
            PromptUtils.alertWithTitle("", L10NUtils.getString(errorStringId));
        } catch(e) { dump("EXCEPTION GETTING obs_documentCreated state "+e+"\n"); }

        // We have a bad editor -- nsIEditingSession will rebuild an editor
        //   with a blank page, so simply abort here
        if (editorStatus)
          return; 

        // Set window title
        UpdateWindowTitle();
        UpdateTabHTMLDialect(editor)

        window.content.focus();
        
        NotifierUtils.notify("documentCreated");
        break;

      case "cmd_setDocumentModified":
        dump("cmd_setDocumentModified " + EditorUtils.isDocumentModified() + "\n");
        gDialog.tabeditor.showCurrentTabAsModified(EditorUtils.isDocumentModified());    // || IsHTMLSourceChanged());

        // TBD : 1. update web navigation commands
        //       2. DONE

        break;

      case "obs_documentWillBeDestroyed":
        dump("obs_documentWillBeDestroyed\n");
        // placeholder; TBD
        break;

      case "obs_documentLocationChanged":
        dump("obs_documentLocationChanged\n");
        // TBD : 1. update base URL
        break;

      case "cmd_bold":
        // Update all style items
        // cmd_bold is a proxy; see EditorSharedStartup (above) for details
        window.updateCommands("style");
        // update the undo/redo items too
        window.updateCommands("undo");
        // and finally the main toolbar
        window.updateCommands("navigation");
        break;
    }
  }
}

var ResizeEventNotifier = {
  startup: function ResizeEventNotifier_startup()
  {
    window.addEventListener("resize", this.onResizeEvent, false);
  },

  shutdown: function ResizeEventNotifier_shutdown()
  {
    window.removeEventListener("resize", this.onResizeEvent, false);
  },

  onResizeEvent: function ResizeEventNotifier_onResizeEvent(aEvent)
  {
    NotifierUtils.notify("resizeEvent");
  }
};

var EditorScrolledNotifier =  {
  startup: function EditorScrolledNotifier_startup()
  {
    var tabeditor = document.getElementById("tabeditor");
    tabeditor.addEventListener("scroll", this.onEditorScrolled, false);
  },

  shutdown: function EditorScrolledNotifier_shutdown()
  {
    var tabeditor = document.getElementById("tabeditor");
    tabeditor.removeEventListener("scroll", this.onEditorScrolled, false);
  },

  onEditorScrolled: function EditorScrolledNotifier_onEditorScrolled(aEvent)
  {
    NotifierUtils.notify("editorScrolled");
  }
};

var BlueGriffonPrefsObserver = {
  observe: function(subject, topic, prefName)
  {
    // verify that we're changing a button pref
    if (topic != "nsPref:changed")
      return;

    if (prefName == "bluegriffon.returnKey.createsParagraph") {
      var value = GetPrefs().getBoolPref("bluegriffon.returnKey.createsParagraph");
      var windowManager = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                            .getService();
      var windowEnumerator = windowManager.QueryInterface(Components.interfaces.nsIWindowMediator)
                                          .getEnumerator("bluegriffon");
      while (windowEnumerator.hasMoreElements()) {
        var w = windowEnumerator.getNext();
        var editors = w.gDialog.tabeditor.mTabpanels.childNodes;
        for (var i = 0; i < editors.length; i++) {
          try {
            var e = editors[i];
            var innerEditor = e.getEditor(e.contentWindow);
            innerEditor.returnInParagraphCreatesNewParagraph = value;
          }
          catch(e) {}
        }
      }
    }
  }
};

function DeactivateMainWindow()
{
  setTimeout(_DeactivateMainWindow, 500);
}

function _DeactivateMainWindow()
{
}

