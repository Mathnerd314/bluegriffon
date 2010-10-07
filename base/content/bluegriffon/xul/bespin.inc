            <hbox id="bespinToolbox" align="center" hidden="true">
              <label value="Line:"/>
              <textbox id="bespinLineTextbox"
                       size="5"
                       onkeypress="onBespinLineKeypress(event, this)"
                       onblur="onBespinLineBlur(this)"/>
              <spacer flex="1"/>
              <checkbox label="Case sensitive"
                        hidden="true"
                        id="bespinFindCaseSensitive"
                        oncommand="ToggleBespinFindCaseSensitivity()"/>
              <label  id="bespinFindPrevious"
                      onclick="BespinFind(false, false)"
                      hidden="true"
                      value="Previous"/>
              <label  id="bespinFindNext"
                      onclick="BespinFind(true, false)"
                      hidden="true"
                      value="Next"/>
              <label value="Find:"/>
              <textbox id="bespinFindTextbox"
                       size="5"
                       type="search"
                       oncommand="onBespinFindClear(event, this)"
                       onkeypress="onBespinFindKeypress(event)"
                       onblur="onBespinFindClear(event, this)"
                       oninput="BespinFind(true, true)"/>
            </hbox>
