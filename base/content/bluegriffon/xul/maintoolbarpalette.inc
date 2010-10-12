  <toolbarpalette id="ComposerToolbarPalette">

      <toolbarbutton id="newButton"
                     label="&newMenu.label;"
                     type="menu-button"
                     oncommand="NewDocument(event);"
                     tooltiptext="&newToolbarCmd.tooltip;">
        <menupopup>
          <menuitem label="&newTab.label;"          oncommand="NewDocument(event);" default="true"/>
          <menuitem label="&newWindow.label;"       oncommand="NewDocumentInNewWindow(event);"/>
          <menuseparator/>
          <menuitem label="&newOtherCmd.label;"     oncommand="NewDocumentWithOptions(event);"/>
        </menupopup>
      </toolbarbutton>

      <toolbarbutton id="openButton"
                     label="&openMenu.label;"
                     type="menu-button"
                     oncommand="OpenLocation(event, 'tab');"
                     tooltiptext="&openMenu.tooltip;">
        <menupopup>
          <menuitem label="&openTab.label;"          oncommand="OpenLocation(event, 'tab');" default="true"/>
          <menuitem label="&openWindow.label;"       oncommand="OpenLocation(event, 'window');"/>
        </menupopup>
      </toolbarbutton>

      <toolbarbutton id="saveButton" class="toolbarbutton-1" observes="cmd_save"
                     tooltiptext="&saveToolbarCmd.tooltip;"/>

      <toolbarbutton id="stopButton"
                     label="&stopButton.label;"
                     class="toolbarbutton-1"
                     tooltiptext="&stopButton.tooltip;"
                     command="cmd_stopLoading"/>

      <toolbarbutton id="tableButton" class="toolbarbutton-1"
                     label="&tableToolbarCmd.label;" observes="cmd_table"
                     tooltiptext="&tableToolbarCmd.tooltip;"/>

      <toolbarbutton id="imageButton" class="toolbarbutton-1"
                     label="&imageToolbarCmd.label;" observes="cmd_image"
                     tooltiptext="&imageToolbarCmd.tooltip;"/>

      <toolbarbutton id="anchorButton" class="toolbarbutton-1"
                     label="&anchorToolbarCmd.label;" observes="cmd_anchor"
                     tooltiptext="&anchorToolbarCmd.tooltip;"/>

      <toolbarbutton id="linkButton" class="toolbarbutton-1"
                     label="&linkToolbarCmd.label;" observes="cmd_link"
                     tooltiptext="&linkToolbarCmd.tooltip;"/>

      <toolbarbutton id="cssButton" class="toolbarbutton-1"
                     label="&cssToolbarCmd.label;" observes="cmd_css"
                     tooltiptext="&cssToolbarCmd.tooltip;"/>

      <toolbarbutton id="videoButton" class="toolbarbutton-1"
                     label="&videoToolbarCmd.label;" observes="cmd_video"
                     tooltiptext="&videoToolbarCmd.tooltip;"/>

      <toolbarbutton id="audioButton" class="toolbarbutton-1"
                     label="&audioToolbarCmd.label;" observes="cmd_audio"
                     tooltiptext="&audioToolbarCmd.tooltip;"/>

      <toolbarbutton id="browseButton" class="toolbarbutton-1"
                     label="&browseToolbarCmd.label;" observes="cmd_browse"
                     tooltiptext="&browseToolbarCmd.tooltip;"/>

      <toolbarbutton id="formButton" class="toolbarbutton-1"
                     label="&formToolbarCmd.label;"
                     observes="cmd_form"
                     tooltiptext="&formToolbarCmd.tooltip;"
                     type="menu-button">
        <menupopup>
          <menuitem label="&formToolbarCmd.label;..."
                    accesskey="&formToolbarCmd.key;"
                    command="cmd_form"
                    default="true"/>
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
       </menupopup>
      </toolbarbutton>

      <toolbaritem id="throbber-box"  align="center" pack="center">
        <image id="composer-throbber" tooltiptext="&throbber.tooltip;" onclick="AboutComposer()"/>
      </toolbaritem> 

    </toolbarpalette>
