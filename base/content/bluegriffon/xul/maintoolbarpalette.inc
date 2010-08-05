  <toolbarpalette id="ComposerToolbarPalette">

      <toolbarbutton id="newButton"
                     label="&newMenu.label;" type="menu-button"
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
                     label="&openMenu.label;" type="menu-button"
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

      <toolbaritem id="throbber-box"  align="center" pack="center">
        <image id="composer-throbber" tooltiptext="&throbber.tooltip;" onclick="AboutComposer()"/>
      </toolbaritem> 

    </toolbarpalette>
