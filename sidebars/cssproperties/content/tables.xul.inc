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

            <row align="center">
              <label value="&captionSide.label;"/>
              <hbox align="center">
                <toolbarbutton class="multibutton"
                               value="top" property="caption-side" type="checkbox" group="caption-side"
                               id="topCaptionSideButton" label="&topCaptionSide.label;"
                               oncommand="ToggleProperty(this)"/>
                <toolbarbutton class="multibutton"
                               value="bottom" property="caption-side" type="checkbox" group="caption-side"
                               id="bottomCaptionSideButton" label="&bottomCaptionSide.label;"
                               oncommand="ToggleProperty(this)"/>
              </hbox>
            </row>

            <row align="center">
              <label value="&borderCollapse.label;"/>
              <hbox align="center">
                <toolbarbutton class="multibutton"
                               value="collapse" property="border-collapse" type="checkbox" group="border-collapse"
                               id="collapseBorderCollapseButton" label="&collapseBorderCollapse.label;"
                               oncommand="ToggleProperty(this)"/>
                <toolbarbutton class="multibutton"
                               value="separate" property="border-collapse" type="checkbox" group="border-collapse"
                               id="separateBorderCollapseButton" label="&separateBorderCollapse.label;"
                               oncommand="ToggleProperty(this)"/>
              </hbox>
            </row>

            <row align="center">
              <label value="&borderSpacing.label;"/>
              <hbox align="center">
                <menulist editable="true" id="borderSpacingHMenulist" sizetopopup="none"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', false); ApplyBorderSpacing()"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', false); ApplyBorderSpacing()">
                  <menupopup onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')"/>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex'); ApplyBorderSpacing()"
                                 ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false); ApplyBorderSpacing()"/>
              </hbox>
              <hbox align="center">
                <menulist editable="true" id="borderSpacingVMenulist" sizetopopup="none"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', false); ApplyBorderSpacing()"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', false); ApplyBorderSpacing()">
                  <menupopup onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')"/>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex'); ApplyBorderSpacing()"
                                 ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false); ApplyBorderSpacing()"/>
              </hbox>
            </row>

            <row align="center">
              <label value="&emptyCells.label;"/>
              <hbox align="center">
                <toolbarbutton class="multibutton"
                               value="show" property="empty-cells" type="checkbox" group="empty-cells"
                               id="showEmptyCellsButton" label="&showEmptyCells.label;"
                               oncommand="ToggleProperty(this)"/>
                <toolbarbutton class="multibutton"
                               value="hide" property="empty-cells" type="checkbox" group="empty-cells"
                               id="hideEmptyCellsButton" label="&hideEmptyCells.label;"
                               oncommand="ToggleProperty(this)"/>
              </hbox>
            </row>
          </rows>
        </grid>
      </vbox>
