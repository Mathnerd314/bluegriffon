      <hbox align="center" class="csspropertiesHeader last">
        <image src="chrome://cssproperties/skin/filter.png" onclick="ToggleSection(this)"/>
        <label value="&columnsSectionHeader.label;"/>
      </hbox>

      <vbox class="section" hidden="true">
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
      </vbox>
