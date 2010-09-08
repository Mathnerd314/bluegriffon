      <hbox align="center" class="csspropertiesHeader last"
            id="columnSectionHeader">
        <image src="chrome://cssproperties/skin/filter.png" onclick="ToggleSection(this)"/>
        <label value="&columnsSectionHeader.label;"/>
      </hbox>

      <grid class="section">
        <columns><column/><column/></columns>
        <rows>
          <row align="center">
            <label value="&columnCount.label;"/>
            <hbox align="center">
		          <textbox type="number"
		                   min="1"
		                   onchange="ColumnCountChanged()"
		                   oninput="ColumnCountChanged()"
		                   size="2"
		                   id="columnCount"/>
		          <toolbarbutton id="oneColumnButton"
		                         tooltiptext="&oneColumn.label;"
		                         oncommand="SetColumnCount(1)"/>
		          <toolbarbutton id="twoColumnsButton"
		                         tooltiptext="&twoColumns.label;"
		                         oncommand="SetColumnCount(2)"/>
		          <toolbarbutton id="threeColumnsButton"
		                         tooltiptext="&threeColumns.label;"
		                         oncommand="SetColumnCount(3)"/>
            </hbox>
          </row>

          <row align="center">
            <label value="&columnWidth.label;"/>
            <hbox align="center">
			        <menulist editable="true" id="columnWidthMenulist" sizetopopup="none"
                        oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', false)"
			                  property="-moz-column-width"
                        oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', false)">
			          <menupopup onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                  <menuseparator/>
                  <menuitem label="&automaticColumnWidth.label;" value="auto"/>
                </menupopup>
			        </menulist>
			        <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
			                         ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
            </hbox>
          </row>

          <row align="center">
            <label value="&columnGap.label;"/>
            <hbox align="center">
              <menulist editable="true" id="columnGapMenulist" sizetopopup="none"
                        oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'normal', false)"
                        property="-moz-column-gap"
                        oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'normal', false)">
                <menupopup onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                  <menuseparator/>
                  <menuitem label="&normalColumnGap.label;" value="normal"/>
                </menupopup>
              </menulist>
              <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                               ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
            </hbox>

          </row>
        </rows>
      </grid>
