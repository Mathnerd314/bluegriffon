      <hbox align="center" class="csspropertiesHeader">
        <image src="chrome://cssproperties/skin/filter.png" onclick="ToggleSection(this)"/>
        <label value="&generalSectionHeader.label;"/>
      </hbox>

      <vbox class="section" hidden="true">
        <listbox id="fontFamilyListbox"
                 rows="4">
          <listitem label="qsdqsd"/>
        </listbox>
        <hbox class="listboxBg">
          <toolbarbutton id="addFontButton" class="listboxBgPlusButton" type="menu">
            <menupopup>
              <menuitem label="Arial, Helvetica, sans-serif" global="true"
                        style="font-family: Arial, Helvetica, sans-serif" />
              <menuitem label="Time New Roman, Time, serif" global="true"
                        style="font-family: Time New Roman, Time, serif"/>
              <menuitem label="Courier New, Courier, monospace" global="true"
                        style="font-family: Courier New, Courier, monospace"/>
              <menuseparator/>
            </menupopup>
          </toolbarbutton>
          <toolbarbutton id="removeFontButton" class="listboxBgMinusButton"/>
          <label value="Font family"/>
        </hbox>
        <grid>
          <columns><column/><column/></columns>
          <rows>
            <row align="center">
              <label value="&fontWeight.label;"/>
		          <hbox align="center">
		            <toolbarbutton class="multibutton" label="Bold" value="bold" property="font-weight" type="checkbox"
		                           style="font-weight:bold" id="fontWeightBoldButton" group="font-weight"
		                           oncommand="ToggleProperty(this)"/>
		            <toolbarbutton class="multibutton" label="lighter" value="lighter" property="font-weight" type="checkbox"
		                           style="font-weight: lighter" id="fontWeightLighterButton" group="font-weight"
		                           oncommand="ToggleProperty(this)"/>
		            <toolbarbutton class="multibutton" label="bolder" value="bolder" property="font-weight" type="checkbox"
		                           style="font-weight: bolder" id="fontWeightBolderButton" group="font-weight"
		                           oncommand="ToggleProperty(this)"/>
		          </hbox>
            </row>
            <row align="center">
              <label value="&fontStyle.label;"/>
              <hbox align="center">
                <toolbarbutton class="multibutton" label="Italic" value="italic" property="font-style" type="checkbox"
                               style="font-style: italic" id="fontStyleItalicButton"
                               oncommand="ToggleProperty(this)"/>
                <toolbarbutton class="multibutton" label="Oblique" value="oblique" property="font-style" type="checkbox"
                               style="font-style: oblique" id="fontStyleObliqueButton"
                               oncommand="ToggleProperty(this)"/>
              </hbox>
            </row>
            <row align="center">
              <label value="&textDecoration.label;"/>
			        <hbox align="center">
			          <toolbarbutton class="multibutton" label="Underlined" value="underline" property="text-decoration" type="checkbox"
			                         style="text-decoration: underline" agregator="text-decoration"
                               id="textDecorationUnderlineButton"
                               oncommand="ToggleProperty(this)"/>
			          <toolbarbutton class="multibutton" label="Overlined" value="overline" property="text-decoration" type="checkbox"
			                         style="text-decoration: overline" agregator="text-decoration"
                               id="textDecorationOverlineButton"
                               oncommand="ToggleProperty(this)"/>
			          <toolbarbutton class="multibutton" label="Line-through" value="line-through" property="text-decoration" type="checkbox"
			                         style="text-decoration: line-through" agregator="text-decoration"
                               id="textDecorationLinethroughButton"
                               oncommand="ToggleProperty(this)"/>
			        </hbox>
            </row>
            <row align="center">
              <label value="&textTransform.label;"/>
			        <hbox align="center">
			          <toolbarbutton class="multibutton" label="lower case" value="lowercase" property="text-transform" type="checkbox"
			                         group="text-transform" id="textTransformLowercaseButton"
			                         oncommand="ToggleProperty(this)"/>
			          <toolbarbutton class="multibutton" label="UPPER CASE" value="uppercase" property="text-transform" type="checkbox"
			                         group="text-transform" id="textTransformUppercaseButton"
			                         oncommand="ToggleProperty(this)"/>
			          <toolbarbutton class="multibutton" label="Capitalized" value="capitalize" property="text-transform" type="checkbox"
			                         group="text-transform" id="textTransformLinethroughButton"
			                         oncommand="ToggleProperty(this)"/>
			        </hbox>
            </row>
          </rows>
        </grid>
      </vbox>
