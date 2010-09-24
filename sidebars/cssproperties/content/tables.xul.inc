      <hbox align="center" class="csspropertiesHeader" context="sectionHeaderContext"
            id="tablesSectionHeader">
        <image src="chrome://cssproperties/skin/filter.png" onclick="ToggleSection(this.parentNode)"/>
        <label value="&tablesSectionHeader.label;"/>
      </hbox>

      <vbox class="section" id="tablesSection">
        <grid>
          <columns><column/><column/></columns>
          <rows>
            <row align="center">
              <label value="&tableLayout.label;"/>
              <hbox align="center">
                <toolbarbutton class="multibutton"
                               value="auto" property="table-layout" type="checkbox" group="table-layout"
                               id="autoTableLayoutButton" label="&autoTableLayout.label;"
                               oncommand="ToggleProperty(this)"/>
                <toolbarbutton class="multibutton"
                               value="fixed" property="table-layout" type="checkbox" group="table-layout"
                               id="fixedTableLayoutButton" label="&fixedTableLayout.label;"
                               oncommand="ToggleProperty(this)"/>
              </hbox>
            </row>
          </rows>
        </grid>
      </vbox>
