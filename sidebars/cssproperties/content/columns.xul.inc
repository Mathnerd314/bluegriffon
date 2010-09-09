      <hbox align="center" class="csspropertiesHeader last"
            id="columnSectionHeader">
        <image src="chrome://cssproperties/skin/filter.png" onclick="ToggleSection(this)"/>
        <label value="&columnsSectionHeader.label;"/>
      </hbox>

      <grid class="section" id="columnSection">
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

          <row align="center">
            <label value="&columnRuleColor.label;"/>
            <hbox align="center">
	            <ecolorpicker id="columnRuleColorpicker"
	                          color=""
	                          colorObjectId="ColumnRuleColor"
	                          windowTitle="&columnRuleColor.title;"
	                          showTransparency="false"
	                          property="-moz-column-rule-color"
	                          oncommand="SetColor(this)"/>
            </hbox>
          </row>

          <row align="center">
            <label value="&columnRuleStyle.label;"/>
            <hbox align="center">
	            <menulist id="columnRuleStyleMenulist" property="-moz-column-rule-style"
	                      oncommand="ApplyPropertyFromMenulist(this)">
	              <menupopup>
	                <menuitem label="&noneColumnRuleStyle.label;" value="none"/>
	                <menuitem label="&hiddenColumnRuleStyle.label;" value="hidden"/>
	                <menuseparator/>
	                <menuitem label="&solidColumnRuleStyle.label;" value="solid"/>
	                <menuitem label="&doubleColumnRuleStyle.label;" value="double"/>
	                <menuitem label="&dottedColumnRuleStyle.label;" value="dotted"/>
	                <menuitem label="&dashedColumnRuleStyle.label;" value="dashed"/>
	                <menuitem label="&grooveColumnRuleStyle.label;" value="groove"/>
	                <menuitem label="&ridgeColumnRuleStyle.label;" value="ridge"/>
	                <menuitem label="&insetColumnRuleStyle.label;" value="inset"/>
	                <menuitem label="&outsetColumnRuleStyle.label;" value="outset"/>
	              </menupopup>
	            </menulist>
            </hbox>
          </row>

          <row align="center">
            <label value="&columnRuleWidth.label;"/>
            <hbox align="center">
	            <menulist editable="true" id="columnRuleWidthMenulist" property="-moz-column-rule-width"
	                      oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'none thin medium thick', false)"
	                      oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'none thin medium thick', false)">
	              <menupopup id="columnRuleWidthMenupopup"
	                         onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
	                <menuseparator/>
                  <menuitem label="&thinColumnRuleWidth.label;" value="thin"/>
                  <menuitem label="&mediumColumnRuleWidth.label;" value="medium"/>
                  <menuitem label="&thickColumnRuleWidth.label;" value="thick"/>
                  <menuseparator/>
                  <menuitem label="&noneColumnRuleWidth.label;" value="none"/>
	              </menupopup>
	            </menulist>
	            <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
	                         ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
            </hbox>
          </row>
        </rows>
      </grid>
