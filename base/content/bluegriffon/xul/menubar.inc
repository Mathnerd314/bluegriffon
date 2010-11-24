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
        <menuitem id="saveMenuitem"   key="savekb" observes="cmd_save"/>
        <menuitem id="saveAsMenuitem" key="saveaskb" observes="cmd_saveAs"/>

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
        <menuseparator/>
        <menuitem id="menu_selectAll"
                  command="cmd_selectAll"/>
        <menuseparator/>
        <menuitem id="menu_find" command="cmd_bgfind"
                  key="findkb"/>
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
      <menupopup id="insertMenuPopup">
        <menuitem label="&imageToolbarCmd.label;"
                  command="cmd_image"
                  accesskey="&imageToolbarCmd.key;"/>
        <menuitem label="&tableToolbarCmd.label;"
                  command="cmd_table"
                  accesskey="&tableToolbarCmd.key;"/>
        <menuitem label="&linkToolbarCmd.label;"
                  command="cmd_link"
                  accesskey="&linkToolbarCmd.key;"/>
        <menuitem label="&anchorToolbarCmd.label;"
                  command="cmd_anchor"
                  accesskey="&anchorToolbarCmd.key;"/>
        <menuitem label="&hrToolbarCmd.label;"
                  command="cmd_hr"
                  accesskey="&hrToolbarCmd.key;"/>
        <menuseparator/>
        <menuitem label="&htmlToolbarCmd.label;"
                  command="cmd_html"
                  accesskey="&htmlToolbarCmd.key;"/>
        <menu label="&formToolbarCmd.label;">
		        <menupopup>
		          <menuitem label="&formToolbarCmd.label;"
		                    accesskey="&formToolbarCmd.key;"
		                    command="cmd_form"/>
		          <menuseparator/>
		          <menu label="&formInputs.label;">
		            <menupopup>
		                <menuitem label="&hiddenInputForm.label;"
		                          command="cmd_formInputHidden"/>
		                <menuitem label="&textInputForm.label;"
		                          command="cmd_formInputText"/>
		                <menuitem label="&searchInputForm.label;"
		                          command="cmd_formInputSearch"/>
		                <menuitem label="&telInputForm.label;"
		                          command="cmd_formInputTel"/>
		                <menuitem label="&urlInputForm.label;"
		                          command="cmd_formInputUrl"/>
		                <menuitem label="&emailInputForm.label;"
		                          command="cmd_formInputEmail"/>
		                <menuitem label="&passwordInputForm.label;"
		                          command="cmd_formInputPassword"/>
		                <menuitem label="&datetimeInputForm.label;"
		                          command="cmd_formInputDatetime"/>
		                <menuitem label="&dateInputForm.label;"
		                          command="cmd_formInputDate"/>
		                <menuitem label="&monthInputForm.label;"
		                          command="cmd_formInputMonth"/>
		                <menuitem label="&weekInputForm.label;"
		                          command="cmd_formInputWeek"/>
		                <menuitem label="&timeInputForm.label;"
		                          command="cmd_formInputTime"/>
		                <menuitem label="&datetimelocalInputForm.label;"
		                          command="cmd_formInputDatetimelocal"/>
		                <menuitem label="&numberInputForm.label;"
		                          command="cmd_formInputNumber"/>
		                <menuitem label="&rangeInputForm.label;"
		                          command="cmd_formInputRange"/>
		                <menuitem label="&colorInputForm.label;"
		                          command="cmd_formInputColor"/>
		                <menuitem label="&checkboxInputForm.label;"
		                          command="cmd_formInputCheckbox"/>
		                <menuitem label="&radioInputForm.label;"
		                          command="cmd_formInputRadio"/>
		                <menuitem label="&fileInputForm.label;"
		                          command="cmd_formInputFile"/>
		                <menuitem label="&submitInputForm.label;"
		                          command="cmd_formInputSubmit"/>
		                <menuitem label="&imageInputForm.label;"
		                          command="cmd_formInputImage"/>
		                <menuitem label="&resetInputForm.label;"
		                          command="cmd_formInputReset"/>
		                <menuitem label="&buttonInputForm.label;"
		                          command="cmd_formInputButton"/>
		             </menupopup>
		          </menu>
		          <menuitem label="&fieldsetToolbarCmd.label;"
		                    accesskey="&fieldsetToolbarCmd.key;"
		                    command="cmd_fieldset"/>
		          <menuitem label="&labelToolbarCmd.label;"
		                    accesskey="&labelToolbarCmd.key;"
		                    command="cmd_label"/>
		          <menuitem label="&buttonToolbarCmd.label;"
		                    accesskey="&buttonToolbarCmd.key;"
		                    command="cmd_button"/>
		          <menuitem label="&selectToolbarCmd.label;"
		                    accesskey="&selectToolbarCmd.key;"
		                    command="cmd_select"/>
		          <menuitem label="&textareaToolbarCmd.label;"
		                    accesskey="&textareaToolbarCmd.key;"
		                    command="cmd_textarea"/>
		          <menuitem label="&keygenToolbarCmd.label;"
		                    accesskey="&keygenToolbarCmd.key;"
		                    command="cmd_keygen"/>
		          <menuitem label="&outputToolbarCmd.label;"
		                    accesskey="&outputToolbarCmd.key;"
		                    command="cmd_output"/>
		          <menuitem label="&progressToolbarCmd.label;"
		                    accesskey="&progressToolbarCmd.key;"
		                    command="cmd_progress"/>
		          <menuitem label="&meterToolbarCmd.label;"
		                    accesskey="&meterToolbarCmd.key;"
		                    command="cmd_meter"/>
		          <menuitem label="&datalistToolbarCmd.label;"
		                    accesskey="&datalistToolbarCmd.key;"
		                    command="cmd_datalist"/>
		       </menupopup>
        </menu>
        <menuseparator/>
        <menuitem label="&stylesheetsToolbarCmd.label;"
                  accesskey="&stylesheetsToolbarCmd.key;"
                  command="cmd_stylesheets"/>
      </menupopup>
    </menu>

    <menu id="formatMenu" label="&formatMenu.label;" accesskey="&formatMenu.accesskey;">
      <menupopup id="formatMenuPopup" onpopupshowing="initFontStyleMenu(this)">
	      <menuitem label="&spanCmd.label;"
	                command="cmd_span"
                  accesskey="&spanCmd.accesskey;"/>
        <menuseparator/>
	      <menuitem label="&styleBoldCmd.label;"        accesskey="&stylebold.accesskey;"         observes="cmd_bold"          type="checkbox" key="boldkb"/>
	      <menuitem label="&styleItalicCmd.label;"      accesskey="&styleitalic.accesskey;"       observes="cmd_italic"        type="checkbox" key="italickb" />
	      <menuitem label="&styleUnderlineCmd.label;"   accesskey="&styleunderline.accesskey;"    observes="cmd_underline"     type="checkbox" key="underlinekb"/>
	      <menuitem label="&styleStrikeThruCmd.label;"  accesskey="&stylestrikethru.accesskey;"   observes="cmd_strikethrough" type="checkbox"/>
	      <menuitem label="&styleSuperscriptCmd.label;" accesskey="&stylesuperscript.accesskey;"  observes="cmd_superscript"   type="checkbox"/>
	      <menuitem label="&styleSubscriptCmd.label;"   accesskey="&stylesubscript.accesskey;"    observes="cmd_subscript"     type="checkbox"/>
	      <menuitem label="&fontFixedWidth.label;"      accesskey="&fontfixedwidth.accesskey;"    observes="cmd_tt"            type="checkbox"/>
	      <menuitem label="&styleNonbreakingCmd.label;" accesskey="&stylenonbreaking.accesskey;"  observes="cmd_nobreak"       type="checkbox"/>
	      <menuseparator/>
	      <menuitem label="&styleEm.label;"             accesskey="&styleEm.accesskey;"           observes="cmd_em"            type="checkbox"/>
	      <menuitem label="&styleStrong.label;"         accesskey="&styleStrong.accesskey;"       observes="cmd_strong"        type="checkbox"/>
	      <menuitem label="&styleCite.label;"           accesskey="&styleCite.accesskey;"         observes="cmd_cite"          type="checkbox"/>
	      <menuitem label="&styleAbbr.label;"           accesskey="&styleAbbr.accesskey;"         observes="cmd_abbr"          type="checkbox"/>
	      <menuitem label="&styleAcronym.label;"        accesskey="&styleAcronym.accesskey;"      observes="cmd_acronym"       type="checkbox"/>
	      <menuitem label="&styleCode.label;"           accesskey="&styleCode.accesskey;"         observes="cmd_code"          type="checkbox"/>
	      <menuitem label="&styleSamp.label;"           accesskey="&styleSamp.accesskey;"         observes="cmd_samp"          type="checkbox"/>
	      <menuitem label="&styleVar.label;"            accesskey="&styleVar.accesskey;"          observes="cmd_var"           type="checkbox"/>
        <!--menu id="directionMenu" label="&writingDirectionMenu.label;" position="5"
              accesskey="&writingdirectionmenu.accesskey;"
              onpopupshowing="InitWritingDirectionMenu()">
          <menupopup oncommand="ComposerCommands.doStatefulCommand('cmd_direction', event.target.getAttribute('value'))">
            <menuitem id="menu_noDir" label="&defaultDirectionMenu.label;" accesskey="&defaultdirectionmenu.accesskey;"
                      type="radio" name="1" value="none"   observes="cmd_renderedHTMLEnabler" />
            <menuseparator/>
            <menuitem id="menu_ltr" label="&ltrDirectionMenu.label;" accesskey="&ltrdirectionmenu.accesskey;"
                      type="radio" name="1" value="ltr"    observes="cmd_renderedHTMLEnabler" />
            <menuitem id="menu_rtl" label="&rtlDirectionMenu.label;" accesskey="&rtldirectionmenu.accesskey;"
                      type="radio" name="1" value="rtl"    observes="cmd_renderedHTMLEnabler" />
          </menupopup>
        </menu-->
      </menupopup>
    </menu>

    <menu id="tableMenu" label="&tableMenu.label;" accesskey="&tableMenu.accesskey;">
      <menupopup id="tableMenuPopup"/>
    </menu>

    <menu id="panelsMenu" label="&panelsMenu.label;" accesskey="&panelsMenu.accesskey;"
          oncommand="TogglePanel(event)">
      <menupopup id="panelsMenuPopup"
#ifdef XP_UNIX
#ifdef XP_MACOSX
                 onpopupshowing="UpdatePanelsStatusInMenu()"
#endif
#else
                 onpopupshowing="UpdatePanelsStatusInMenu()"
#endif
                 >
#ifdef XP_UNIX
#ifdef XP_MACOSX
        <menuitem label="&alignPanels.label;"
                  oncommand="AlignAllPanels()"/>
        <menuseparator id="beforeAllPanelsMenuseparator"/>
#endif
#else
        <menuitem label="&alignPanels.label;"
                  oncommand="AlignAllPanels()"/>
        <menuseparator id="beforeAllPanelsMenuseparator"/>
#endif
      </menupopup>
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
        <menuitem label="Venkman"
                  oncommand="start_venkman()"/>
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
