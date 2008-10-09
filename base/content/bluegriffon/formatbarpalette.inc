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
      <menulist class="toolbar-focustarget" id="ClassSelect"
                observes="cmd_renderedHTMLEnabler"
                tooltiptext="&applyClassToSelectionCmd.tooltip;">
        <observes element="cmd_class" attribute="state" onbroadcast="onClassChange(this.parentNode, 'cmd_class')"/>
        <menupopup id="ClassPopup" oncommand="ComposerCommands.doStatefulCommand('cmd_class', event.target.value)" onpopupshowing="initClassMenu(this, true);">
          <menuitem label="&noClass.label;" id="NoClassMenuItem"/>
        </menupopup>
      </menulist>
    </toolbaritem>

  </toolbarpalette>
