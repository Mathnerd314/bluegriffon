      <hbox align="center" class="csspropertiesHeader" context="sectionHeaderContext"
            id="flexboxSectionHeader">
        <image src="chrome://cssproperties/skin/filter.png" onclick="ToggleSection(this.parentNode)"/>
        <label value="&flexboxSectionHeader.label;"/>
      </hbox>

      <vbox class="section" id="flexboxSection">
        <checkbox label="&enableFlexBox.label;"
                  id="flexBoxEnabledCheckbox"
                  oncommand="ToggleFlexBox()"/>
        <checkbox label="&inlineBox.label;" class="indent"
                  id="inlineBoxCheckbox"
                  oncommand="ToggleFlexBox()"/>
        <grid>
          <columns><column/><column/></columns>
          <rows>
            <row align="center">
              <label value="&boxAlign.label;"/>
              <hbox align="center">
                <toolbarbutton class="multibutton" label="&startBoxAlign.label;" value="start" property="-moz-box-align" type="checkbox"
                               id="startBoxAlignButton" group="-moz-box-align"
                               oncommand="ToggleProperty(this)"/>
                <toolbarbutton class="multibutton" label="&centerBoxAlign.label;" value="center" property="-moz-box-align" type="checkbox"
                               id="centerBoxAlignButton" group="-moz-box-align"
                               oncommand="ToggleProperty(this)"/>
                <toolbarbutton class="multibutton" label="&endBoxAlign.label;" value="end" property="-moz-box-align" type="checkbox"
                               id="endBoxAlignButton" group="-moz-box-align"
                               oncommand="ToggleProperty(this)"/>
              </hbox>
              <hbox>
                <toolbarbutton class="multibutton" label="&baselineBoxAlign.label;" value="baseline" property="-moz-box-align" type="checkbox"
                               id="baselineBoxAlignButton" group="-moz-box-align"
                               oncommand="ToggleProperty(this)"/>
              </hbox>
              <hbox>
                <toolbarbutton class="multibutton" label="&stretchBoxAlign.label;" value="stretch" property="-moz-box-align" type="checkbox"
                               id="stretchBoxAlignButton" group="-moz-box-align"
                               oncommand="ToggleProperty(this)"/>
              </hbox>
            </row>

            <row align="center">
              <label value="&boxDirection.label;"/>
              <hbox align="center">
                <toolbarbutton class="multibutton" label="&normalBoxDirection.label;" value="normal" property="-moz-box-direction" type="checkbox"
                               id="normalBoxDirectionButton" group="-moz-box-direction"
                               oncommand="ToggleProperty(this)"/>
                <toolbarbutton class="multibutton" label="&reverseBoxDirection.label;" value="reverse" property="-moz-box-direction" type="checkbox"
                               id="reverseBoxDirectionButton" group="-moz-box-direction"
                               oncommand="ToggleProperty(this)"/>
              </hbox>
            </row>

            <row align="center">
              <label value="&boxOrientation.label;"/>
              <hbox align="center">
                <toolbarbutton class="multibutton" label="&horizontalBoxOrientation.label;" value="horizontal" property="-moz-box-orient" type="checkbox"
                               id="horizontalBoxOrientButton" group="-moz-box-orient"
                               oncommand="ToggleProperty(this)"/>
                <toolbarbutton class="multibutton" label="&verticalBoxOrientation.label;" value="vertical" property="-moz-box-orient" type="checkbox"
                               id="verticalBoxOrientButton" group="-moz-box-orient"
                               oncommand="ToggleProperty(this)"/>
              </hbox>
            </row>

            <row align="center">
              <label value="&boxFlex.label;"/>
              <hbox>
                <textbox id="boxFlexTextbox" type="number" min="0" decimalplaces="2"
                         property="-moz-box-flex"
                         oninput="ToggleProperty(this)"
                         oncommand="ToggleProperty(this)"/>
              </hbox>
            </row>

            <row align="center">
              <label value="&boxOrdinalGroup.label;"/>
              <hbox>
                <textbox id="boxOrdinalGroupTextbox" type="number" min="0"
                         property="-moz-box-ordinal-group"
                         oninput="ToggleProperty(this)"
                         oncommand="ToggleProperty(this)"/>
              </hbox>
            </row>
          </rows>
        </grid>
      </vbox>