<broadcasterset id="broadcasterset"/>

<keyset id="mainKeySet">
  <key id="savekb"              key="&filesave.key;"         observes="cmd_save"      modifiers="accel"/>
  <key id="saveaskb"            key="&filesaveas.key;"       observes="cmd_saveAs"    modifiers="accel,shift"/>
  <key id="key_quitApplication" key="&quit.key;"                                      modifiers="accel"/>
  <key id="closetabkb"          key="&closeWindow.key;"      observes="cmd_closeTab"  modifiers="accel"/>
  <key id="openpagekb"          key="&openPage.key;"         observes="cmd_open"      modifiers="accel"/>
  <key id="findkb"              key="u"                      observes="cmd_bgfind"    modifiers="accel"/>
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

  <command id="cmd_paragraphState" state=""        oncommand="ComposerCommands.doStatefulCommand('cmd_paragraphState', event.target.value)"/>
  <command id="cmd_fontFace"     state=""          oncommand="ComposerCommands.doStatefulCommand('cmd_fontFace', event.target.value)"/>
  <command id="cmd_class"        state=""          oncommand="ComposerCommands.doStatefulCommand('cmd_class', event.target.value)"/>
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
            oncommandupdate="/*ComposerCommands.updateSelectionBased(this, event)*/">
  <command id="cmd_selectionChanged"/>
</commandset>

<commandset id="composerSaveMenuItems"
            commandupdater="true"
            events="create,style,save"
            oncommandupdate="ComposerCommands.goUpdateComposerMenuItems(this)">
  <command id="cmd_save"           label="&saveCmd.label;"           oncommand="goDoCommand('cmd_save')"/>
  <command id="cmd_saveAs"         label="&saveAsCmd.label;"         oncommand="goDoCommand('cmd_saveAs')"/>
  <command id="cmd_closeTab"       label="&closeTabCmd.label;"       oncommand="goDoCommand('cmd_closeTab')"/>

  <command id="cmd_bgfind"         label="Find"                      oncommand="goDoCommand('cmd_bgfind')"/>
  <command id="cmd_browse"                                           oncommand="goDoCommand('cmd_browse')"/>
</commandset>

<commandset id="composerEditMenuItems"
            commandupdater="true"
            events="create, mode_switch"
            oncommandupdate="ComposerCommands.goUpdateComposerMenuItems(this)">
  <command id="cmd_cleanup"         oncommand="goDoCommand('cmd_cleanup')"      label="&markupCleanerCmd.label;" accesskey="&markupcleaner.accesskey;"/>
</commandset>

<keyset id="editorKeys">
  <key id="key_newNavigator" key="n" modifiers="control" />
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
  </popup>

</popupset>

<stringbundleset id="languageSet">
  <stringbundle id="bundleRegions"      src="chrome://global/locale/regionNames.properties"/>
  <stringbundle id="bundleLanguages"    src="chrome://global/locale/languageNames.properties"/>
  <stringbundle id="bundlePreferences"  src="chrome://bluegriffon/locale/language.properties"/>
  <stringbundle id="bundleAccepted"     src="resource://gre/res/language.properties"/>
</stringbundleset>

<stringbundleset id="otherBundles"/>

