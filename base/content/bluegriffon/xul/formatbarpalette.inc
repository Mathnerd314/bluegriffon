  <toolbarpalette id="FormatToolbarPalette">

      <toolbarbutton id="boldButton" type="checkbox" autoCheck="false" observes="cmd_bold" label="&boldToolbarCmd.label;"
                     tooltiptext="&boldToolbarCmd.tooltip;">
        <observes element="cmd_bold" type="checkbox" attribute="state" onbroadcast="onButtonUpdate(this.parentNode, 'cmd_bold')"/>
      </toolbarbutton>

      <toolbarbutton id="italicButton" type="checkbox" autoCheck="false" observes="cmd_italic" label="&italicToolbarCmd.label;"
                     tooltiptext="&italicToolbarCmd.tooltip;">
        <observes element="cmd_italic" attribute="state" onbroadcast="onButtonUpdate(this.parentNode, 'cmd_italic')"/>
      </toolbarbutton>

      <toolbarbutton id="underlineButton" type="checkbox" autoCheck="false" observes="cmd_underline" label="&underlineToolbarCmd.label;"
                     tooltiptext="&underlineToolbarCmd.tooltip;">
        <observes element="cmd_underline" attribute="state" onbroadcast="onButtonUpdate(this.parentNode, 'cmd_underline')"/>
      </toolbarbutton>
    
      <toolbarbutton id="strongButton" type="checkbox" autoCheck="false" observes="cmd_strong" label="&strongToolbarCmd.label;"
                     tooltiptext="&strongToolbarCmd.tooltip;">
        <observes element="cmd_strong" attribute="state" onbroadcast="onButtonUpdate(this.parentNode, 'cmd_strong')"/>
      </toolbarbutton>
    
      <toolbarbutton id="emButton" type="checkbox" autoCheck="false" observes="cmd_em" label="&emToolbarCmd.label;"
                     tooltiptext="&emToolbarCmd.tooltip;">
        <observes element="cmd_em" attribute="state" onbroadcast="onButtonUpdate(this.parentNode, 'cmd_em')"/>
      </toolbarbutton>

      <toolbarbutton id="codeButton" type="checkbox" autoCheck="false" observes="cmd_code" label="&codeToolbarCmd.label;"
                     tooltiptext="&codeToolbarCmd.tooltip;">
        <observes element="cmd_code" type="checkbox" attribute="state" onbroadcast="onButtonUpdate(this.parentNode, 'cmd_code')"/>
      </toolbarbutton>

      <toolbaritem id="ParagraphSelectBox">
        <menulist class="toolbar-focustarget" id="ParagraphSelect" observes="cmd_renderedHTMLEnabler"
                  tooltiptext="&ParagraphSelect.tooltip;" crop="right">
          <observes element="cmd_paragraphState" attribute="state" onbroadcast="onParagraphFormatChange(this.parentNode, 'cmd_paragraphState')"/>
          <menupopup id="ParagraphPopup" oncommand="ComposerCommands.doStatefulCommand('cmd_paragraphState', event.target.value)">
            <!-- TODO : add an onpopupshowing handler to hide the body text
                        choice in strict mode -->
            <menuitem label="&bodyTextCmd.label;"            value=""/>
            <menuitem label="&paragraphParagraphCmd.label;"  value="p"/>
            <menuitem label="&heading1Cmd.label;"            value="h1"/>
            <menuitem label="&heading2Cmd.label;"            value="h2"/>
            <menuitem label="&heading3Cmd.label;"            value="h3"/>
            <menuitem label="&heading4Cmd.label;"            value="h4"/>
            <menuitem label="&heading5Cmd.label;"            value="h5"/>
            <menuitem label="&heading6Cmd.label;"            value="h6"/>
            <menuitem label="&paragraphAddressCmd.label;"    value="address"/>
            <menuitem label="&paragraphPreformatCmd.label;"  value="pre"/>
            <menuseparator />
            <menuitem label="&genericContainerCmd.label;"    value="div"/>
          </menupopup>
        </menulist>
      </toolbaritem>

    <toolbaritem id="ARIARoleSelectBox">
      <menulist class="toolbar-focustarget"
                id="ARIARoleSelect"
                observes="cmd_renderedHTMLEnabler"
                tooltiptext="&ARIARoleSelect.tooltip;" crop="right">
        <observes element="cmd_ariaRole" attribute="state" onbroadcast="onARIARoleChange(this.parentNode, 'cmd_ariaRole')"/>
        <menupopup id="ARIARolePopup" oncommand="ComposerCommands.doStatefulCommand('cmd_ariaRole', event.target.value)">
          <menuitem label="&noARIArole.label;" value=""/>
          <menuseparator/>
					<menuitem label="alert" value="alert" tooltiptext="&alertRole.label;"/>
					<menuitem label="alertdialog" value="alertdialog" tooltiptext="&alertdialogRole.label;"/>
					<menuitem label="application" value="application" tooltiptext="&applicationRole.label;"/>
					<menuitem label="article" value="article" tooltiptext="&articleRole.label;"/>
					<menuitem label="banner" value="banner" tooltiptext="&bannerRole.label;"/>
					<menuitem label="button" value="button" tooltiptext="&buttonRole.label;"/>
					<menuitem label="checkbox" value="checkbox" tooltiptext="&checkboxRole.label;"/>
					<menuitem label="columnheader" value="columnheader" tooltiptext="&columnheaderRole.label;"/>
					<menuitem label="combobox" value="combobox" tooltiptext="&comboboxRole.label;"/>
					<menuitem label="command" value="command" tooltiptext="&commandRole.label;"/>
					<menuitem label="complementary" value="complementary" tooltiptext="&complementaryRole.label;"/>
					<menuitem label="composite" value="composite" tooltiptext="&compositeRole.label;"/>
					<menuitem label="contentinfo" value="contentinfo" tooltiptext="&contentinfoRole.label;"/>
					<menuitem label="definition" value="definition" tooltiptext="&definitionRole.label;"/>
					<menuitem label="dialog" value="dialog" tooltiptext="&dialogRole.label;"/>
					<menuitem label="directory" value="directory" tooltiptext="&directoryRole.label;"/>
					<menuitem label="document" value="document" tooltiptext="&documentRole.label;"/>
					<menuitem label="form" value="form" tooltiptext="&formRole.label;"/>
					<menuitem label="grid" value="grid" tooltiptext="&gridRole.label;"/>
					<menuitem label="gridcell" value="gridcell" tooltiptext="&gridcellRole.label;"/>
					<menuitem label="group" value="group" tooltiptext="&groupRole.label;"/>
					<menuitem label="heading" value="heading" tooltiptext="&headingRole.label;"/>
					<menuitem label="img" value="img" tooltiptext="&imgRole.label;"/>
					<menuitem label="input" value="input" tooltiptext="&inputRole.label;"/>
					<menuitem label="landmark" value="landmark" tooltiptext="&landmarkRole.label;"/>
					<menuitem label="link" value="link" tooltiptext="&linkRole.label;"/>
					<menuitem label="list" value="list" tooltiptext="&listRole.label;"/>
					<menuitem label="listbox" value="listbox" tooltiptext="&listboxRole.label;"/>
					<menuitem label="listitem" value="listitem" tooltiptext="&listitemRole.label;"/>
					<menuitem label="log" value="log" tooltiptext="&logRole.label;"/>
					<menuitem label="main" value="main" tooltiptext="&mainRole.label;"/>
					<menuitem label="marquee" value="marquee" tooltiptext="&marqueeRole.label;"/>
					<menuitem label="math" value="math" tooltiptext="&mathRole.label;"/>
					<menuitem label="menu" value="menu" tooltiptext="&menuRole.label;"/>
					<menuitem label="menubar" value="menubar" tooltiptext="&menubarRole.label;"/>
					<menuitem label="menuitem" value="menuitem" tooltiptext="&menuitemRole.label;"/>
					<menuitem label="menuitemcheckbox" value="menuitemcheckbox" tooltiptext="&menuitemcheckboxRole.label;"/>
					<menuitem label="menuitemradio" value="menuitemradio" tooltiptext="&menuitemradioRole.label;"/>
					<menuitem label="navigation" value="navigation" tooltiptext="&navigationRole.label;"/>
					<menuitem label="note" value="note" tooltiptext="&noteRole.label;"/>
					<menuitem label="option" value="option" tooltiptext="&optionRole.label;"/>
					<menuitem label="presentation" value="presentation" tooltiptext="&presentationRole.label;"/>
					<menuitem label="progressbar" value="progressbar" tooltiptext="&progressbarRole.label;"/>
					<menuitem label="radio" value="radio" tooltiptext="&radioRole.label;"/>
					<menuitem label="radiogroup" value="radiogroup" tooltiptext="&radiogroupRole.label;"/>
					<menuitem label="range" value="range" tooltiptext="&rangeRole.label;"/>
					<menuitem label="region" value="region" tooltiptext="&regionRole.label;"/>
					<menuitem label="roletype" value="roletype" tooltiptext="&roletypeRole.label;"/>
					<menuitem label="row" value="row" tooltiptext="&rowRole.label;"/>
					<menuitem label="rowgroup" value="rowgroup" tooltiptext="&rowgroupRole.label;"/>
					<menuitem label="rowheader" value="rowheader" tooltiptext="&rowheaderRole.label;"/>
					<menuitem label="scrollbar" value="scrollbar" tooltiptext="&scrollbarRole.label;"/>
					<menuitem label="search" value="search" tooltiptext="&searchRole.label;"/>
					<menuitem label="section" value="section" tooltiptext="&sectionRole.label;"/>
					<menuitem label="sectionhead" value="sectionhead" tooltiptext="&sectionheadRole.label;"/>
					<menuitem label="select" value="select" tooltiptext="&selectRole.label;"/>
					<menuitem label="separator" value="separator" tooltiptext="&separatorRole.label;"/>
					<menuitem label="slider" value="slider" tooltiptext="&sliderRole.label;"/>
					<menuitem label="spinbutton" value="spinbutton" tooltiptext="&spinbuttonRole.label;"/>
					<menuitem label="status" value="status" tooltiptext="&statusRole.label;"/>
					<menuitem label="structure" value="structure" tooltiptext="&structureRole.label;"/>
					<menuitem label="tab" value="tab" tooltiptext="&tabRole.label;"/>
					<menuitem label="tablist" value="tablist" tooltiptext="&tablistRole.label;"/>
					<menuitem label="tabpanel" value="tabpanel" tooltiptext="&tabpanelRole.label;"/>
					<menuitem label="textbox" value="textbox" tooltiptext="&textboxRole.label;"/>
					<menuitem label="timer" value="timer" tooltiptext="&timerRole.label;"/>
					<menuitem label="toolbar" value="toolbar" tooltiptext="&toolbarRole.label;"/>
					<menuitem label="tooltip" value="tooltip" tooltiptext="&tooltipRole.label;"/>
					<menuitem label="tree" value="tree" tooltiptext="&treeRole.label;"/>
					<menuitem label="treegrid" value="treegrid" tooltiptext="&treegridRole.label;"/>
					<menuitem label="treeitem" value="treeitem" tooltiptext="&treeitemRole.label;"/>
					<menuitem label="widget" value="widget" tooltiptext="&widgetRole.label;"/>
					<menuitem label="window" value="window" tooltiptext="&windowRole.label;"/>
        </menupopup>
                   
      </menulist>
    </toolbaritem>

    <toolbarbutton id="ulButton" type="radio" group="lists" autoCheck="false" observes="cmd_ul"
                   tooltiptext="&unorderedList.tooltip;" label="&unorderedList.label;">
        <observes element="cmd_ul" attribute="state" onbroadcast="onButtonUpdate(this.parentNode, 'cmd_ul')"/>
    </toolbarbutton>

    <toolbarbutton id="olButton" type="radio" group="lists" autoCheck="false" observes="cmd_ol"
                   tooltiptext="&orderedList.tooltip;" label="&orderedList.label;">
        <observes element="cmd_ol" attribute="state" onbroadcast="onButtonUpdate(this.parentNode, 'cmd_ol')"/>
    </toolbarbutton>

    <toolbarbutton id="align-left-button" type="radio" group="align" autoCheck="false"
                   observes="cmd_renderedHTMLEnabler"
                   oncommand="ComposerCommands.doStatefulCommand('cmd_align', 'left')"
                   tooltiptext="&alignLeft.tooltip;" label="&alignLeft.label;" >
      <observes element="cmd_align" attribute="state" 
                onbroadcast="ComposerCommands.onStateButtonUpdate(this.parentNode, 'cmd_align', 'left')" />
    </toolbarbutton>

    <toolbarbutton id="align-center-button" type="radio" group="align" autoCheck="false"
                   observes="cmd_renderedHTMLEnabler"
                   oncommand="ComposerCommands.doStatefulCommand('cmd_align', 'center')"
                   tooltiptext="&alignCenter.tooltip;" label="&alignCenter.label;" >
      <observes element="cmd_align" attribute="state" 
                onbroadcast="ComposerCommands.onStateButtonUpdate(this.parentNode, 'cmd_align', 'center')"/>
    </toolbarbutton>

    <toolbarbutton id="align-right-button" type="radio" group="align" autoCheck="false"
                   observes="cmd_renderedHTMLEnabler"
                   oncommand="ComposerCommands.doStatefulCommand('cmd_align', 'right')"
                   tooltiptext="&alignRight.tooltip;" label="&alignRight.label;" >
      <observes element="cmd_align" attribute="state"
                onbroadcast="ComposerCommands.onStateButtonUpdate(this.parentNode, 'cmd_align', 'right')"/>
    </toolbarbutton>

    <toolbarbutton id="align-justify-button" type="radio" group="align" autoCheck="false"
                   observes="cmd_renderedHTMLEnabler"
                   oncommand="ComposerCommands.doStatefulCommand('cmd_align', 'justify')"
                   tooltiptext="&alignJustify.tooltip;" label="&alignJustify.label;" >
      <observes element="cmd_align" attribute="state"
                onbroadcast="ComposerCommands.onStateButtonUpdate(this.parentNode, 'cmd_align', 'justify')"/>
    </toolbarbutton>

    <toolbarbutton id="indentButton" observes="cmd_indent" label="&indentToolbarCmd.label;"
                   tooltiptext="&indentToolbarCmd.tooltip;"/>

    <toolbarbutton id="outdentButton" observes="cmd_outdent" label="&outdentToolbarCmd.label;"
                   tooltiptext="&outdentToolbarCmd.tooltip;"/>

    <toolbarbutton id="ddButton" type="radio" group="lists" autoCheck="false" observes="cmd_dd"
                   tooltiptext="&definitionDescription.tooltip;" label="&definitionDescription.label;">
        <observes element="cmd_dd" attribute="state" onbroadcast="onButtonUpdate(this.parentNode, 'cmd_dd')"/>
    </toolbarbutton>

    <toolbarbutton id="dtButton" type="radio" group="lists" autoCheck="false" observes="cmd_dt"
                   tooltiptext="&definitionTitle.tooltip;" label="&definitionTitle.label;">
        <observes element="cmd_dt" attribute="state" onbroadcast="onButtonUpdate(this.parentNode, 'cmd_dt')"/>
    </toolbarbutton>

    <toolbaritem id="FontFaceSelectBox">
      <menulist class="toolbar-focustarget" observes="cmd_renderedHTMLEnabler"
                id="FontFaceSelect" tooltiptext="&FontFaceSelect.tooltip;" crop="right">
        <observes element="cmd_fontFace" attribute="state" onbroadcast="onFontFaceChange(this.parentNode, 'cmd_fontFace')"/>
        <menupopup id="FontFacePopup" oncommand="ComposerCommands.doStatefulCommand('cmd_fontFace', event.target.value)" onpopupshowing="initFontFaceMenu(this);">
          <menuitem label="&fontVarWidth.label;"      value=""/>
          <menuitem label="&fontFixedWidth.label;"    value="tt"/>
          <menuseparator/>
          <menuitem label="&fontHelveticaFont.label;" value="Helvetica, Arial, sans-serif"/>
          <menuitem label="&fontTimes.label;"         value="Times New Roman, Times, serif"/>
          <menuitem label="&fontCourier.label;"       value="Courier New, Courier, monospace"/>
          <menuseparator/>
        </menupopup>
      </menulist>
    </toolbaritem>

    <toolbaritem id="ClassButtonsBox">
      <menulist class="toolbar-focustarget"
                id="ClassSelect"
                style="min-width: 10em"
                sizetopopup="none"
                editable="true"
                placeholder="&noClass.label;"
                onkeypress="OnKeyPressInClassMenulist(event)"
                onblur="OnBlurFromClassMenulist(event)"
                observes="cmd_renderedHTMLEnabler"
                tooltiptext="&applyClassToSelectionCmd.tooltip;">
        <observes element="cmd_class" attribute="state" onbroadcast="onClassChange(this.parentNode, 'cmd_class')"/>
        <menupopup id="ClassPopup"
                   oncommand="ComposerCommands.doStatefulCommand('cmd_class', event.target.value)"
                   onpopupshowing="initClassMenu(this, true);"/>
      </menulist>
    </toolbaritem>

    <toolbaritem id="IdButtonsBox">
      <menulist class="toolbar-focustarget"
                id="IdSelect"
                style="min-width: 10em"
                sizetopopup="none"
                editable="true"
                placeholder="&noId.label;"
                onkeypress="OnKeyPressInIdMenulist(event)"
                onblur="OnBlurFromIdMenulist(event)"
                observes="cmd_renderedHTMLEnabler"
                tooltiptext="&applyIdToSelectionCmd.tooltip;">
        <observes element="cmd_id" attribute="state" onbroadcast="onIdChange(this.parentNode, 'cmd_id')"/>
        <menupopup id="IdPopup"
                   oncommand="ComposerCommands.doStatefulCommand('cmd_id', event.target.value)"
                   onpopupshowing="initIdMenu(this);"/>
      </menulist>
    </toolbaritem>

    <toolbarbutton id="rotateButton" observes="cmd_renderedHTMLEnabler" label="Rotate" tooltiptext="Rotate"
                   type="checkbox" oncommand="CSSRotationsHandler.toggle(this)"/>
  </toolbarpalette>
