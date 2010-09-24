      <hbox align="center" class="csspropertiesHeader last" context="sectionHeaderContext"
            id="miscSectionHeader">
        <image src="chrome://cssproperties/skin/filter.png" onclick="ToggleSection(this.parentNode)"/>
        <label value="&miscSectionHeader.label;"/>
      </hbox>

      <vbox class="section" id="miscSection">
        <grid>
          <columns><column/><column/></columns>
          <rows>
            <row align="center">
              <label value="&cursor.label;"/>
              <hbox>
	              <menulist id="cursorMenulist" oncommand="ToggleProperty(this)"
	                        property="cursor" sizetopopup="none">
	                <menupopup>
	                  <menuitem label="&autoCursor.label;" value="auto"/>
	                  <menuseparator/>
	                  <menuitem label="&defaultCursor.label;" value="default"/>
	                  <menuseparator/>
	                  <menuitem label="&crossHairCursor.label;" value="crosshair"/>
	                  <menuitem label="&pointerCursor.label;" value="pointer"/>
	                  <menuitem label="&moveCursor.label;" value="move"/>
	                  <menuitem label="&eResizeCursor.label;" value="e-resize"/>
	                  <menuitem label="&neResizeCursor.label;" value="ne-resize"/>
	                  <menuitem label="&nwResizeCursor.label;" value="nw-resize"/>
	                  <menuitem label="&nResizeCursor.label;" value="n-resize"/>
	                  <menuitem label="&seResizeCursor.label;" value="se-resize"/>
	                  <menuitem label="&swResizeCursor.label;" value="sw-resize"/>
	                  <menuitem label="&sResizeCursor.label;" value="s-resize"/>
	                  <menuitem label="&wResizeCursor.label;" value="w-resize"/>
	                  <menuitem label="&textCursor.label;" value="text"/>
	                  <menuitem label="&busyCursor.label;" value="wait"/>
	                  <menuitem label="&helpCursor.label;" value="help"/>
	                  <menuitem label="&progress.label;" value="progress"/>
	                </menupopup>
	              </menulist>
              </hbox>
            </row>

            <row align="center">
              <label value="&unicodeBidi.label;"/>
              <hbox align="center">
                <toolbarbutton class="multibutton"
                               value="normal" property="unicode-bidi" type="checkbox" group="unicode-bidi"
                               id="normalUnicodeBidiButton" label="&normalUnicodeBidi.label;"
                               oncommand="ToggleProperty(this)"/>
                <toolbarbutton class="multibutton"
                               value="embed" property="unicode-bidi" type="checkbox" group="unicode-bidi"
                               id="embedUnicodeBidiButton" label="&embedUnicodeBidi.label;"
                               oncommand="ToggleProperty(this)"/>
                <toolbarbutton class="multibutton"
                               value="bidi-override" property="unicode-bidi" type="checkbox" group="unicode-bidi"
                               id="bidiOverrideUnicodeBidiButton" label="&bidiOverrideUnicodeBidi.label;"
                               oncommand="ToggleProperty(this)"/>
              </hbox>
            </row>
          </rows>
        </grid>
      </vbox>
