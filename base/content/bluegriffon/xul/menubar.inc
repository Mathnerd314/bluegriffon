  <menubar id="composer-main-menubar" class="chromeclass-menubar"
           fullscreentoolbar="true">

    <menu id="fileMenu" label="&fileMenu.label;" accesskey="&fileMenu.accesskey;">
      <menupopup id="fileMenu_popup">
        <menuitem label="&newMenu.label;" accesskey="&newMenu.accesskey;" key="key_newNavigator"
                  command="cmd_new"/>
        <menuitem label="&newWizardMenu.label;"
                  command="cmd_newWizard"/>
        <menu id="menu_RecentFiles" accesskey="&filerecentmenu.accesskey;" label="&fileRecentMenu.label;"
              onpopupshowing="RecentPagesHandler.buildRecentPagesMenu();">
          <menupopup id="menupopup_RecentFiles"
                      oncommand="OpenFile(event.target.getAttribute('value'), true);"/>
            <!-- menuitems appended at runtime -->
        </menu>

        <menuseparator/>
        <menuitem id="openPageMenuitem" accesskey="&openPage.accesskey;" key="openpagekb" observes="cmd_open"/>

        <menuseparator/>
        <menuitem id="saveMenuitem" accesskey="&filesave.accesskey;" key="savekb" observes="cmd_save"/>
        <menuitem accesskey="&filesaveas.accesskey;" observes="cmd_saveAs"/>

        <menuseparator/>
        <menuitem id="closeTabMenuitem" key="closetabkb" observes="cmd_closeTab"/>

        <menuseparator id="menu_FileQuitSeparator"/>
        <menuitem id="menu_FileQuitItem"
                  label="&quit.label;"
                  accesskey="&quit.accesskey;"
                  key="key_quitApplication"
                  oncommand="doQuit()"/>
      </menupopup>
    </menu>

    <menu id="editMenu"   label="&editMenu.label;"   accesskey="&editMenu.accesskey;">
      <menupopup id="editMenuPopup">
        <!-- magic from chrome://global/content/editMenuOverlay.xul -->
        <menuitem id="menu_undo" />
        <menuitem id="menu_redo" />
        <menuseparator/>
        <menuitem id="menu_cut" command="cmd_cut" label="Cut"/>
        <menuitem id="menu_copy" command="cmd_copy" label="Copie"/>
        <menuitem id="menu_paste"/>
        <menuitem id="menu_delete"/>
      </menupopup>
    </menu>

    <menu id="viewMenu"   label="&viewMenu.label;"   accesskey="&viewMenu.accesskey;">
      <menupopup id="viewMenuPopup">
        <menu label="&viewToolbars.label;">
          <menupopup id="viewToolbarsPopup"
                     onpopupshowing="BGToolbarManager.listToolbars(this)"/>
        </menu>
        <menuitem label="&viewStatusbar.label;"
                  oncommand="BGToolbarManager.goToggleToolbar('statusbar')" />
      </menupopup>
    </menu>

    <menu id="insertMenu" label="&insertMenu.label;" accesskey="&insertMenu.accesskey;">
      <menupopup id="insertMenuPopup"/>
    </menu>

    <menu id="formatMenu" label="&formatMenu.label;" accesskey="&formatMenu.accesskey;">
      <menupopup id="formatMenuPopup"/>
    </menu>

    <menu id="tableMenu" label="&tableMenu.label;" accesskey="&tableMenu.accesskey;">
      <menupopup id="tableMenuPopup"/>
    </menu>

    <menu id="toolsMenu" label="&toolsMenu.label;" accesskey="&toolsMenu.accesskey;">
      <menupopup id="toolsPopup">
        <menuitem id="menu_cleanup" observes="cmd_cleanup"/>
        <menuseparator/>
        <menuitem label="Extensions"  oncommand="OpenExtensionsManager()"/>
        <menuseparator/>
        <menuitem label="&consoleMenu.label;"  oncommand="OpenConsole()"/>
        <menuitem id="menu_inspector" label="DOMI" oncommand="inspectDOMDocument();"/>
        <menuseparator id="menu_PrefsSeparator"/>
        <menuitem id="menu_preferences" label="Preferences"
                  oncommand="OpenPreferences()"/>
      </menupopup>
    </menu>

    <menu id="helpMenu" label="&helpMenu.label;" accesskey="&helpMenu.accesskey;">
      <menupopup id="helpMenuPopup">
        <menuitem label="&aboutComposer.label;"
                  id="aboutName"
                  oncommand="AboutComposer()"/>
      </menupopup>
    </menu>

  </menubar>