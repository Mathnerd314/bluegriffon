      <hbox align="center" class="csspropertiesHeader" context="sectionHeaderContext"
            id="flexboxSectionHeader">
        <image src="chrome://cssproperties/skin/filter.png" onclick="ToggleSection(this.parentNode)"/>
        <label value="&flexboxSectionHeader.label;"/>
      </hbox>

      <vbox class="section" id="flexboxSection">
        <checkbox label="&enableFlexBox.label;"
                  id="flexBoxEnabledCheckbox"
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
          </rows>
        </grid>
      </vbox>