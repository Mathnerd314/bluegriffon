  <menubar id="composer-main-menubar" class="chromeclass-menubar">

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
        <menuitem id="saveMenuitem" accesskey="&filesave.accesskey;" key="savekb" observes="cmd_save"/>
        <menuitem accesskey="&filesaveas.accesskey;" observes="cmd_saveAs"/>

        <menuseparator/>
        <menuitem label="&quit.label;" accesskey="&quit.accesskey;" oncommand="goQuitApplication()"/>
      </menupopup>
    </menu>

    <menu id="editMenu"   label="&editMenu.label;"   accesskey="&editMenu.accesskey;">
      <menupopup id="editMenuPopup"/>
    </menu>

    <menu id="viewMenu"   label="&viewMenu.label;"   accesskey="&viewMenu.accesskey;">
      <menupopup id="viewMenuPopup">
        <menu label="&viewToolbars.label;">
          <menupopup id="viewToolbarsPopup"
                     onpopupshowing="BGToolbarManager.listToolbars(this)"/>
        </menu>
        <menuseparator/>
        <menuitem label="&fullScreen.label;" accesskey="&fullScreen.accesskey;"
                  key="key_fullScreen" command="cmd_fullScreen"/>
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
        <menuitem id="menu_inspector" label="DOMI" command="Tasks:Inspector"/>
      </menupopup>
    </menu>

    <menu id="helpMenu" label="&helpMenu.label;" accesskey="&helpMenu.accesskey;">
      <menupopup id="helpMenuPopup">
        <menuitem label="&aboutComposer.label;" oncommand="AboutComposer()"/>
      </menupopup>
    </menu>

  </menubar>
