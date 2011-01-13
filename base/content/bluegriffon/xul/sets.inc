<broadcasterset id="broadcasterset"/>

<keyset id="mainKeySet">
  <key id="savekb"              key="&filesave.key;"         observes="cmd_save"      modifiers="accel"/>
  <key id="saveaskb"            key="&filesaveas.key;"       observes="cmd_saveAs"    modifiers="accel,shift"/>
  <key id="key_quitApplication" key="&quit.key;"                                      modifiers="accel"/>
  <key id="closetabkb"          key="&closeWindow.key;"      observes="cmd_closeTab"  modifiers="accel"/>
  <key id="openpagekb"          key="&openPage.key;"         observes="cmd_open"      modifiers="accel"/>
  <key id="findkb"              key="f"                      observes="cmd_bgfind"    modifiers="accel"/>
  <key id="replacekb"           key="r"                      observes="cmd_replace"   modifiers="accel"/>
</keyset>

<!-- magic from chrome://global/content/editMenuOverlay.xul -->
<keyset id="editMenuKeys"/>

<!-- magic from chrome://global/content/editMenuOverlay.xul -->
<!--commandset id="editMenuCommands"/-->

<commandset id="webNavigationItems"
            commandupdater="true"
            events="navigation"
            oncommandupdate="ComposerCommands.goUpdateComposerMenuItems(this)">
  <command id="cmd_stopLoading" disabled="true" oncommand="goDoCommand('cmd_stopLoading')"/>
  <command id="cmd_new"                         oncommand="goDoCommand('cmd_new')"/>
  <command id="cmd_newWizard"                   oncommand="goDoCommand('cmd_newWizard')"/>

  <command id="Tasks:Inspector"   oncommand="inspectDOMDocument();"/>
  <command id="Tasks:InspectPage" oncommand="inspectDOMDocument(_content.document);"/>
</commandset>

<commandset id="commonEditorMenuItems"
            commandupdater="true"
            events="create"
            oncommandupdate="ComposerCommands.goUpdateComposerMenuItems(this)">
  <command id="cmd_open"         label="&openPage.label;" oncommand="goDoCommand('cmd_open')"/>
</commandset>

<commandset id="composerMenuItems"
            commandupdater="true"
            events="create,style,mode_switch"
            oncommandupdate="ComposerCommands.goUpdateComposerMenuItems(this)">
  <command id="cmd_table"            oncommand="goDoCommand('cmd_table')"/>
  <command id="cmd_image"            oncommand="goDoCommand('cmd_image')"/>
  <command id="cmd_anchor"           oncommand="goDoCommand('cmd_anchor')"/>
  <command id="cmd_link"             oncommand="goDoCommand('cmd_link')"/>
  <command id="cmd_hr"               oncommand="goDoCommand('cmd_hr')"/>
  <command id="cmd_css"              oncommand="goDoCommand('cmd_css')"/>
  <command id="cmd_domexplorer"      oncommand="goDoCommand('cmd_domexplorer')"/>
  <command id="cmd_video"            oncommand="goDoCommand('cmd_video')"/>
  <command id="cmd_audio"            oncommand="goDoCommand('cmd_audio')"/>
  <command id="cmd_html"             oncommand="goDoCommand('cmd_html')"/>
  <command id="cmd_form"             oncommand="goDoCommand('cmd_form')"/>

	<command id="cmd_formInputHidden"   oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'hidden')"/>
	<command id="cmd_formInputText"     oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'text')"/>
	<command id="cmd_formInputSearch"   oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'search')"/>
	<command id="cmd_formInputTel"      oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'tel')"/>
	<command id="cmd_formInputUrl"      oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'url')"/>
	<command id="cmd_formInputEmail"    oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'email')"/>
	<command id="cmd_formInputPassword" oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'password')"/>
	<command id="cmd_formInputDatetime" oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'datetime')"/>
	<command id="cmd_formInputDate"     oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'date')"/>
	<command id="cmd_formInputMonth"    oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'month')"/>
	<command id="cmd_formInputWeek"     oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'week')"/>
	<command id="cmd_formInputTime"     oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'time')"/>
	<command id="cmd_formInputDatetimelocal" oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'datetime-local')"/>
	<command id="cmd_formInputNumber"   oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'number')"/>
	<command id="cmd_formInputRange"    oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'range')"/>
	<command id="cmd_formInputColor"    oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'color')"/>
	<command id="cmd_formInputCheckbox" oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'checkbox')"/>
	<command id="cmd_formInputRadio"    oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'radio')"/>
	<command id="cmd_formInputFile"     oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'file')"/>
	<command id="cmd_formInputSubmit"   oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'submit')"/>
	<command id="cmd_formInputImage"    oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'image')"/>
	<command id="cmd_formInputReset"    oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'reset')"/>
	<command id="cmd_formInputButton"   oncommand="ComposerCommands.doCommandWithValue('cmd_formInput', 'button')"/>

  <command id="cmd_fieldset"          oncommand="goDoCommand('cmd_fieldset')"/>
  <command id="cmd_label"             oncommand="goDoCommand('cmd_label')"/>
  <command id="cmd_button"            oncommand="goDoCommand('cmd_button')"/>
  <command id="cmd_select"            oncommand="goDoCommand('cmd_select')"/>
  <command id="cmd_textarea"          oncommand="goDoCommand('cmd_textarea')"/>
  <command id="cmd_keygen"            oncommand="goDoCommand('cmd_keygen')"/>
  <command id="cmd_output"            oncommand="goDoCommand('cmd_output')"/>
  <command id="cmd_progress"          oncommand="goDoCommand('cmd_progress')"/>
  <command id="cmd_meter"             oncommand="goDoCommand('cmd_meter')"/>
  <command id="cmd_datalist"          oncommand="goDoCommand('cmd_datalist')"/>

  <command id="cmd_stylesheets"       oncommand="goDoCommand('cmd_stylesheets')"/>

  <command id="cmd_pageProperties"    oncommand="goDoCommand('cmd_pageProperties')"/>

  <command id="cmd_spellCheck"        oncommand="goDoCommand('cmd_spellCheck')"/>
</commandset>

<commandset id="composerStyleMenuItems"
            commandupdater="true"
            events="create,style,mode_switch"
            oncommandupdate="ComposerCommands.goUpdateComposerMenuItems(this)">
  <command id="cmd_bold"         state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_bold')"/>
  <command id="cmd_italic"       state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_italic')"/>
  <command id="cmd_underline"    state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_underline')"/>
  <command id="cmd_strong"       state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_strong')"/>
  <command id="cmd_em"           state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_em')"/>
  <command id="cmd_code"         state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_code')"/>
  <command id="cmd_strikethrough" state="false"    oncommand="ComposerCommands.doStyleUICommand('cmd_strikethrough');"/>
  <command id="cmd_superscript"  state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_superscript');"/>
  <command id="cmd_subscript"    state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_subscript');"/>
  <command id="cmd_nobreak"      state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_nobreak');"/>

  <command id="cmd_cite"         state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_cite')"/>
  <command id="cmd_abbr"         state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_abbr')"/>
  <command id="cmd_acronym"      state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_acronym')"/>
  <command id="cmd_code"         state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_code')"/>
  <command id="cmd_samp"         state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_samp')"/>
  <command id="cmd_var"          state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_var')"/>
  <command id="cmd_tt"           state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_tt')"/>

  <command id="cmd_span"                           oncommand="goDoCommand('cmd_span')"/>

  <command id="cmd_paragraphState" state=""        oncommand="ComposerCommands.doStatefulCommand('cmd_paragraphState', event.target.value)"/>
  <command id="cmd_fontFace"     state=""          oncommand="ComposerCommands.doStatefulCommand('cmd_fontFace', event.target.value)"/>
  <command id="cmd_class"        state=""          oncommand="ComposerCommands.doStatefulCommand('cmd_class', event.target.value)"/>
  <command id="cmd_id"           state=""          oncommand="ComposerCommands.doStatefulCommand('cmd_id', event.target.value)"/>
  <command id="cmd_ariaRole"     state=""          oncommand="ComposerCommands.doStatefulCommand('cmd_ariaRole', event.target.value)"/>
  <command id="cmd_renderedHTMLEnabler"/>
  <command id="cmd_viewModeEnabler"/>
  <command id="cmd_ul"           state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_ul')"/>
  <command id="cmd_ol"           state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_ol')"/>
  <command id="cmd_align"        state="left"      oncommand="ComposerCommands.doStatefulCommand('cmd_align', event.target.value)"/>

  <command id="cmd_dd"           state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_dd')"/>
  <command id="cmd_dt"           state="false"     oncommand="ComposerCommands.doStyleUICommand('cmd_dt')"/>

  <command id="cmd_indent"                         oncommand="goDoCommand('cmd_indent')"/>
  <command id="cmd_outdent"                        oncommand="goDoCommand('cmd_outdent')"/>

</commandset>

<commandset id="selectionBasedCommands"
            commandupdater="true"
            events="style,create"
            oncommandupdate="ComposerCommands.goUpdateComposerMenuItems(this);">
  <command id="cmd_selectionChanged"/>
  <command id="cmd_undo" label="&undoCmd.label;" 
           oncommand="goDoCommand('cmd_undo')"
           disabled="true"/>
  <command id="cmd_redo" label="&redoCmd.label;"
           oncommand="goDoCommand('cmd_redo')"
           disabled="true"/>
  <command id="cmd_cut" label="&cutCmd.label;"
           oncommand="goDoCommand('cmd_cut')"
           disabled="true"/>
  <command id="cmd_copy" label="&copyCmd.label;"
           oncommand="goDoCommand('cmd_copy')"
           disabled="true"/>
  <command id="cmd_paste" label="&pasteCmd.label;"
           oncommand="goDoCommand('cmd_paste')"
           disabled="true"/>
  <command id="cmd_delete" label="&deleteCmd.label;"
           oncommand="goDoCommand('cmd_delete')"
           disabled="true"/>
  <command id="cmd_selectAll" label="&selectAllCmd.label;"
           oncommand="goDoCommand('cmd_selectAll')"
           disabled="true"/>
</commandset>

<commandset id="composerSaveMenuItems"
            commandupdater="true"
            events="create,style,save"
            oncommandupdate="ComposerCommands.goUpdateComposerMenuItems(this)">
  <command id="cmd_save"           label="&saveCmd.label;"           oncommand="goDoCommand('cmd_save')"/>
  <command id="cmd_saveAs"         label="&saveAsCmd.label;"         oncommand="goDoCommand('cmd_saveAs')"/>
  <command id="cmd_closeTab"       label="&closeTabCmd.label;"       oncommand="goDoCommand('cmd_closeTab')"/>

  <command id="cmd_bgfind"         label="&findCmd.label;"           oncommand="goDoCommand('cmd_bgfind')"/>
  <command id="cmd_replace"        label="&replaceCmd.label;"        oncommand="goDoCommand('cmd_replace')"/>
  <command id="cmd_browse"                                           oncommand="goDoCommand('cmd_browse')"/>
</commandset>

<commandset id="composerEditMenuItems"
            commandupdater="true"
            events="create, mode_switch"
            oncommandupdate="ComposerCommands.goUpdateComposerMenuItems(this)">
  <command id="cmd_cleanup"         oncommand="goDoCommand('cmd_cleanup')"      label="&markupCleanerCmd.label;" accesskey="&markupcleaner.accesskey;"/>
</commandset>

<commandset id="composerTableMenuItems"
            commandupdater="true"
            events="create,style,mode_switch"
            oncommandupdate="ComposerCommands.goUpdateComposerMenuItems(this)">
  <!-- Table menu -->
  <command id="cmd_SelectTable"         oncommand="goDoCommand('cmd_SelectTable')"/>
  <command id="cmd_SelectRow"           oncommand="goDoCommand('cmd_SelectRow')"/>
  <command id="cmd_SelectColumn"        oncommand="goDoCommand('cmd_SelectColumn')"/>
  <command id="cmd_SelectCell"          oncommand="goDoCommand('cmd_SelectCell')"/>
  <command id="cmd_SelectAllCells"      oncommand="goDoCommand('cmd_SelectAllCells')"/>
  <command id="cmd_InsertTable"         oncommand="goDoCommand('cmd_InsertTable')"/>
  <command id="cmd_InsertRowAbove"      oncommand="goDoCommand('cmd_InsertRowAbove')"/>
  <command id="cmd_InsertRowBelow"      oncommand="goDoCommand('cmd_InsertRowBelow')"/>
  <command id="cmd_InsertColumnBefore"  oncommand="goDoCommand('cmd_InsertColumnBefore')"/>
  <command id="cmd_InsertColumnAfter"   oncommand="goDoCommand('cmd_InsertColumnAfter')"/>
  <command id="cmd_InsertCellBefore"    oncommand="goDoCommand('cmd_InsertCellBefore')"/>
  <command id="cmd_InsertCellAfter"     oncommand="goDoCommand('cmd_InsertCellAfter')"/>
  <command id="cmd_DeleteTable"         oncommand="goDoCommand('cmd_DeleteTable')"/>
  <command id="cmd_DeleteRow"           oncommand="goDoCommand('cmd_DeleteRow')"/>
  <command id="cmd_DeleteColumn"        oncommand="goDoCommand('cmd_DeleteColumn')"/>
  <command id="cmd_DeleteCell"          oncommand="goDoCommand('cmd_DeleteCell')"/>
  <command id="cmd_DeleteCellContents"  oncommand="goDoCommand('cmd_DeleteCellContents')"/>
  <command id="cmd_NormalizeTable"      oncommand="goDoCommand('cmd_NormalizeTable')"/>
  <command id="cmd_JoinTableCells"      oncommand="goDoCommand('cmd_JoinTableCells')"/>
  <command id="cmd_SplitTableCell"      oncommand="goDoCommand('cmd_SplitTableCell')"/>
  <command id="cmd_ConvertToTable"      oncommand="goDoCommand('cmd_ConvertToTable')"/>
  <command id="cmd_TableOrCellColor"    oncommand="goDoCommand('cmd_TableOrCellColor')"/>
  <command id="cmd_editTable"           oncommand="goDoCommand('cmd_editTable')"/>
</commandset>

<keyset id="editorKeys">
  <key id="key_newNavigator" key="n" modifiers="accel" observes="cmd_new"/>
</keyset>

<popupset id="editorPopupSet">

  <popup id="main-toolbar-context-menu">
    <menuitem oncommand="CustomizeToolbar('MainToolbox');" id="CustomizeMainToolbar" label="&customizeToolbar.label;" accesskey="&customizeToolbar.accesskey;"/>
  </popup>

  <popup id="format-toolbar-context-menu">
    <menuitem oncommand="CustomizeToolbar('FormatToolbox');" id="CustomizeFormatToolbar" label="&customizeToolbar.label;" accesskey="&customizeToolbar.accesskey;"/>
  </popup>

  <popup id="structureBarContextMenu"
         onpopupshowing="UpdateStructureBarContextMenu()">
    <menuitem label="&resetElementLanguage.label;"
              id="resetElementLanguageMenuitem"
              accesskey="&resetElementLanguage.accesskey;"
              oncommand="ResetLanguage(event)" />
    <menuitem label="&setElementLanguage.label;"
              accesskey="&setElementLanguage.accesskey;"
              oncommand="ShowLanguageDialog(event)" />
    <menuseparator/>
    <menuitem label="&deleteElement.label;"
              id="deleteElementMenuitem"
              accesskey="&deleteElement.accesskey;"
              oncommand="DeleteElement(event)"/>
    <menuitem label="&removeTag.label;"
              id="removeTagMenuitem"
              accesskey="&removeTag.accesskey;"
              oncommand="ExplodeElement(event)"/>
     <menuitem label="&changeTag.label;"
              id="changeTagMenuitem"
              accesskey="&changeTag.accesskey;"
              oncommand="ChangeTag(event)"/>
     <menuseparator/>
     <menu label="ARIA Role">
        <menupopup id="ARIARoleStructureBarPopup" oncommand="ComposerCommands.doStatefulCommand('cmd_ariaRole', event.target.value)"
                   onpopupshowing="onARIARoleChangeStructureBar('cmd_ariaRole')">
          <menuitem label="&noARIArole.label;" type="checkbox" value=""/>
          <menuseparator/>
          <menuitem label="alert" value="alert" tooltiptext="&alertRole.label;" type="checkbox"/>
          <menuitem label="alertdialog" value="alertdialog" tooltiptext="&alertdialogRole.label;" type="checkbox"/>
          <menuitem label="application" value="application" tooltiptext="&applicationRole.label;" type="checkbox"/>
          <menuitem label="article" value="article" tooltiptext="&articleRole.label;" type="checkbox"/>
          <menuitem label="banner" value="banner" tooltiptext="&bannerRole.label;" type="checkbox"/>
          <menuitem label="button" value="button" tooltiptext="&buttonRole.label;" type="checkbox"/>
          <menuitem label="checkbox" value="checkbox" tooltiptext="&checkboxRole.label;" type="checkbox"/>
          <menuitem label="columnheader" value="columnheader" tooltiptext="&columnheaderRole.label;" type="checkbox"/>
          <menuitem label="combobox" value="combobox" tooltiptext="&comboboxRole.label;" type="checkbox"/>
          <menuitem label="command" value="command" tooltiptext="&commandRole.label;" type="checkbox"/>
          <menuitem label="complementary" value="complementary" tooltiptext="&complementaryRole.label;" type="checkbox"/>
          <menuitem label="composite" value="composite" tooltiptext="&compositeRole.label;" type="checkbox"/>
          <menuitem label="contentinfo" value="contentinfo" tooltiptext="&contentinfoRole.label;" type="checkbox"/>
          <menuitem label="definition" value="definition" tooltiptext="&definitionRole.label;" type="checkbox"/>
          <menuitem label="dialog" value="dialog" tooltiptext="&dialogRole.label;" type="checkbox"/>
          <menuitem label="directory" value="directory" tooltiptext="&directoryRole.label;" type="checkbox"/>
          <menuitem label="document" value="document" tooltiptext="&documentRole.label;" type="checkbox"/>
          <menuitem label="form" value="form" tooltiptext="&formRole.label;" type="checkbox"/>
          <menuitem label="grid" value="grid" tooltiptext="&gridRole.label;" type="checkbox"/>
          <menuitem label="gridcell" value="gridcell" tooltiptext="&gridcellRole.label;" type="checkbox"/>
          <menuitem label="group" value="group" tooltiptext="&groupRole.label;" type="checkbox"/>
          <menuitem label="heading" value="heading" tooltiptext="&headingRole.label;" type="checkbox"/>
          <menuitem label="img" value="img" tooltiptext="&imgRole.label;" type="checkbox"/>
          <menuitem label="input" value="input" tooltiptext="&inputRole.label;" type="checkbox"/>
          <menuitem label="landmark" value="landmark" tooltiptext="&landmarkRole.label;" type="checkbox"/>
          <menuitem label="link" value="link" tooltiptext="&linkRole.label;" type="checkbox"/>
          <menuitem label="list" value="list" tooltiptext="&listRole.label;" type="checkbox"/>
          <menuitem label="listbox" value="listbox" tooltiptext="&listboxRole.label;" type="checkbox"/>
          <menuitem label="listitem" value="listitem" tooltiptext="&listitemRole.label;" type="checkbox"/>
          <menuitem label="log" value="log" tooltiptext="&logRole.label;" type="checkbox"/>
          <menuitem label="main" value="main" tooltiptext="&mainRole.label;" type="checkbox"/>
          <menuitem label="marquee" value="marquee" tooltiptext="&marqueeRole.label;" type="checkbox"/>
          <menuitem label="math" value="math" tooltiptext="&mathRole.label;" type="checkbox"/>
          <menuitem label="menu" value="menu" tooltiptext="&menuRole.label;" type="checkbox"/>
          <menuitem label="menubar" value="menubar" tooltiptext="&menubarRole.label;" type="checkbox"/>
          <menuitem label="menuitem" value="menuitem" tooltiptext="&menuitemRole.label;" type="checkbox"/>
          <menuitem label="menuitemcheckbox" value="menuitemcheckbox" tooltiptext="&menuitemcheckboxRole.label;" type="checkbox"/>
          <menuitem label="menuitemradio" value="menuitemradio" tooltiptext="&menuitemradioRole.label;" type="checkbox"/>
          <menuitem label="navigation" value="navigation" tooltiptext="&navigationRole.label;" type="checkbox"/>
          <menuitem label="note" value="note" tooltiptext="&noteRole.label;" type="checkbox"/>
          <menuitem label="option" value="option" tooltiptext="&optionRole.label;" type="checkbox"/>
          <menuitem label="presentation" value="presentation" tooltiptext="&presentationRole.label;" type="checkbox"/>
          <menuitem label="progressbar" value="progressbar" tooltiptext="&progressbarRole.label;" type="checkbox"/>
          <menuitem label="radio" value="radio" tooltiptext="&radioRole.label;" type="checkbox"/>
          <menuitem label="radiogroup" value="radiogroup" tooltiptext="&radiogroupRole.label;" type="checkbox"/>
          <menuitem label="range" value="range" tooltiptext="&rangeRole.label;" type="checkbox"/>
          <menuitem label="region" value="region" tooltiptext="&regionRole.label;" type="checkbox"/>
          <menuitem label="roletype" value="roletype" tooltiptext="&roletypeRole.label;" type="checkbox"/>
          <menuitem label="row" value="row" tooltiptext="&rowRole.label;" type="checkbox"/>
          <menuitem label="rowgroup" value="rowgroup" tooltiptext="&rowgroupRole.label;" type="checkbox"/>
          <menuitem label="rowheader" value="rowheader" tooltiptext="&rowheaderRole.label;" type="checkbox"/>
          <menuitem label="scrollbar" value="scrollbar" tooltiptext="&scrollbarRole.label;" type="checkbox"/>
          <menuitem label="search" value="search" tooltiptext="&searchRole.label;" type="checkbox"/>
          <menuitem label="section" value="section" tooltiptext="&sectionRole.label;" type="checkbox"/>
          <menuitem label="sectionhead" value="sectionhead" tooltiptext="&sectionheadRole.label;" type="checkbox"/>
          <menuitem label="select" value="select" tooltiptext="&selectRole.label;" type="checkbox"/>
          <menuitem label="separator" value="separator" tooltiptext="&separatorRole.label;" type="checkbox"/>
          <menuitem label="slider" value="slider" tooltiptext="&sliderRole.label;" type="checkbox"/>
          <menuitem label="spinbutton" value="spinbutton" tooltiptext="&spinbuttonRole.label;" type="checkbox"/>
          <menuitem label="status" value="status" tooltiptext="&statusRole.label;" type="checkbox"/>
          <menuitem label="structure" value="structure" tooltiptext="&structureRole.label;" type="checkbox"/>
          <menuitem label="tab" value="tab" tooltiptext="&tabRole.label;" type="checkbox"/>
          <menuitem label="tablist" value="tablist" tooltiptext="&tablistRole.label;" type="checkbox"/>
          <menuitem label="tabpanel" value="tabpanel" tooltiptext="&tabpanelRole.label;" type="checkbox"/>
          <menuitem label="textbox" value="textbox" tooltiptext="&textboxRole.label;" type="checkbox"/>
          <menuitem label="timer" value="timer" tooltiptext="&timerRole.label;" type="checkbox"/>
          <menuitem label="toolbar" value="toolbar" tooltiptext="&toolbarRole.label;" type="checkbox"/>
          <menuitem label="tooltip" value="tooltip" tooltiptext="&tooltipRole.label;" type="checkbox"/>
          <menuitem label="tree" value="tree" tooltiptext="&treeRole.label;" type="checkbox"/>
          <menuitem label="treegrid" value="treegrid" tooltiptext="&treegridRole.label;" type="checkbox"/>
          <menuitem label="treeitem" value="treeitem" tooltiptext="&treeitemRole.label;" type="checkbox"/>
          <menuitem label="widget" value="widget" tooltiptext="&widgetRole.label;" type="checkbox"/>
          <menuitem label="window" value="window" tooltiptext="&windowRole.label;" type="checkbox"/>
        </menupopup>
     </menu>
  </popup>

  <popup id="editorContextMenu"
         onpopupshowing="UpdateEditorContextMenu(event, this)">
    <menu label="&spellCheck.label;"
          id="spellCheckMenu">
      <menupopup onpopupshowing="UpdateSpellCheckMenu(this)"
                 onpopuphiding="CleanSpellCheckMenu()">
        <menuitem label="&addToDictionary;"
                  oncommand="AddWordToDictionary()"
                  id="addToDictionarySpellCheckMenuitem"/>
        <menuseparator/>
        <menuseparator id="suggestionsSpellCheckSeparator"/>
        <menuitem label="&ignoreWord.label;"
                  command="IgnoreWord()"/>
      </menupopup>
    </menu>
    <menu label="&dictionary.label;">
      <menupopup id="dictionaryMenupopup"
                 onpopupshowing="UpdateSpellCheckDictionaries(this)"
                 onpopuphiding="CleanSpellCheckDictionaries()"/>
    </menu>
    <menuseparator/>
    <menuitem id="cMenu_undo" key="key_undo"/>
    <menuitem id="cMenu_redo" key="key_redo"/>
    <menuseparator/>
    <menuitem id="cMenu_cut" key="key_cut"/>
    <menuitem id="cMenu_copy" key="key_copy"/>
    <menuitem id="cMenu_paste" key="key_paste"/>
    <menuitem id="cMenu_delete" key="key_delete"/>
    <menuseparator/>
    <menuitem id="cMenu_selectAll" key="key_selectAll"/>
    <menuseparator id="separator_before_ctableInsertMenu"/>
    <menu id="ctableInsertMenu" label="&tableInsertMenu2.label;" accesskey="&tableinsertmenu.accesskey;">
      <menupopup>
        <menuitem label="&tableRowAbove.label;"     accesskey="&tablerow.accesskey;"          observes="cmd_InsertRowAbove"/>
        <menuitem label="&tableRowBelow.label;"     accesskey="&tablerowbelow.accesskey;"     observes="cmd_InsertRowBelow"/>
        <menuseparator />
        <menuitem label="&tableColumnBefore.label;" accesskey="&tablecolumn.accesskey;"       observes="cmd_InsertColumnBefore"/>
        <menuitem label="&tableColumnAfter.label;"  accesskey="&tablecolumnafter.accesskey;"  observes="cmd_InsertColumnAfter"/>
        <menuseparator />
        <menuitem label="&tableCellBefore.label;"   accesskey="&tablecell.accesskey;"         observes="cmd_InsertCellBefore"/>
        <menuitem label="&tableCellAfter.label;"    accesskey="&tablecellafter.accesskey;"    observes="cmd_InsertCellAfter"/>
      </menupopup>
    </menu>
    <menu id="ctableSelectMenu" label="&tableSelectMenu2.label;" accesskey="&tableselectmenu.accesskey;">
      <menupopup id="ctableSelectPopup">
        <menuitem id="cmenu_SelectTable"    label="&tableTable.label;"    accesskey="&tabletable.accesskey;"    observes="cmd_SelectTable"    />
        <menuitem id="cmenu_SelectRow"      label="&tableRow.label;"      accesskey="&tablerow.accesskey;"      observes="cmd_SelectRow"      />
        <menuitem id="cmenu_SelectColumn"   label="&tableColumn.label;"   accesskey="&tablecolumn.accesskey;"   observes="cmd_SelectColumn"   />
        <menuitem id="cmenu_SelectCell"     label="&tableCell.label;"     accesskey="&tablecell.accesskey;"     observes="cmd_SelectCell"     />
        <menuitem id="cmenu_SelectAllCells" label="&tableAllCells.label;" accesskey="&tableallcells.accesskey;" observes="cmd_SelectAllCells" />
      </menupopup>
    </menu>
    <menu id="ctableDeleteMenu" label="&tableDeleteMenu2.label;" accesskey="&tabledeletemenu.accesskey;">
      <menupopup id="ctableDeletePopup">
        <menuitem id="cmenu_DeleteTable"         label="&tableTable.label;"        accesskey="&tabletable.accesskey;"          observes="cmd_DeleteTable"/>
        <menuitem id="cmenu_DeleteRow"           label="&tableRows.label;"         accesskey="&tablerow.accesskey;"            observes="cmd_DeleteRow"/>
        <menuitem id="cmenu_DeleteColumn"        label="&tableColumns.label;"      accesskey="&tablecolumn.accesskey;"         observes="cmd_DeleteColumn"/>
        <menuitem id="cmenu_DeleteCell"          label="&tableCells.label;"        accesskey="&tablecell.accesskey;"           observes="cmd_DeleteCell"/>
        <menuitem id="cmenu_DeleteCellContents"  label="&tableCellContents.label;" accesskey="&tablecellcontents.accesskey;"   observes="cmd_DeleteCellContents"/>
      </menupopup>
    </menu>
    <menuseparator />
    <!-- menu label is set in InitTableMenu -->
    <menuitem id="cmenu_JoinTableCells"   label="&tableJoinCells.label;"   accesskey="&tablejoincells.accesskey;"   observes="cmd_JoinTableCells"/>
    <menuitem id="cmenu_SplitTableCell"   label="&tableSplitCell.label;"   accesskey="&tablesplitcell.accesskey;"   observes="cmd_SplitTableCell"/>
    <menuseparator />
    <menuitem id="cmenu_tableProperties"  label="&tableProperties.label;"  accesskey="&tableProperties.accesskey;"  observes="cmd_editTable"/>
  </popup>
</popupset>

<stringbundleset id="languageSet">
  <stringbundle id="bundleRegions"      src="chrome://global/locale/regionNames.properties"/>
  <stringbundle id="bundleLanguages"    src="chrome://global/locale/languageNames.properties"/>
  <stringbundle id="bundlePreferences"  src="chrome://bluegriffon/locale/language.properties"/>
  <stringbundle id="bundleAccepted"     src="resource://gre/res/language.properties"/>
</stringbundleset>

<stringbundleset id="otherBundles"/>

