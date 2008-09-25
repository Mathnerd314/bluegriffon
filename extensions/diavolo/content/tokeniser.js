/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Diavolo.
 *
 * The Initial Developer of the Original Code is
 * Disruptive Innovations SARL.
 * Portions created by the Initial Developer are Copyright (C) 2006-2008
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Daniel Glazman <daniel.glazman@disruptive-innovations.com>, Original author
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

function DiavoloTokenizer(aURLspec)
{
  this.init(aURLspec);
}

DiavoloTokenizer.prototype = {

  mGrammar: null,

  init: function(aURLspec)
  {
    // Get the grammar file
    this.mGrammar = new DiavoloGrammar(aURLspec);
  },

  getGrammar: function getGrammar()
  {
    return this.mGrammar;
  },

  getNextToken: function getNextToken(aSourceString, aLastIndex)
  {
    if (aLastIndex >= aSourceString.length)
      return null;
    var tokens = this.getGrammar().getDeftokens();
    var tokenFound = false;
    var tokenName = "";
    var tokenString = "";
    for (var i in tokens)
    {
      var token = tokens[i];
      switch (token.type)
      {
        case this.getGrammar().kSTRING_TOKEN:
          {
            var s = token.value;
            var l = s.length;
            if (aSourceString.substr(aLastIndex, l) == s)
            {
              tokenName = i;
              tokenString = s;
              tokenFound = true;
            }
          }
          break;
        case this.getGrammar().kREGEXP_TOKEN:
          {
            var r = token.value;
            r.lastIndex = aLastIndex;
            var result = r.exec(aSourceString); 
            if (result)
            {
              tokenName = i;
              tokenString = result[0];
              tokenFound = true;
            }
          }
          break;
        default: // we should not ever reach this
          break;
      }
      if (tokenFound)
        break;
    }
    if (tokenFound)
      return {name: tokenName, string: tokenString, error: false};
    return {name: "", string: aSourceString[aLastIndex], error: true};
  },

  getNextTokenAs: function getNextTokenAs(aSourceString, aLastIndex, aTokenName)
  {
    if (aLastIndex >= aSourceString.length)
      return null;
    if (!aTokenName)
      return this.getNextToken(aSourceString, aLastIndex);

    var tokens = this.getGrammar().getDeftokens();
    var tokenFound = false;
    var tokenName = "";
    var tokenString = "";
    if (!(aTokenName in tokens))
      return null;

    var token = tokens[aTokenName];
    switch (token.type)
    {
      case this.getGrammar().kSTRING_TOKEN:
        {
          var s = token.value;
          var l = s.length;
          if (aSourceString.substr(aLastIndex, l) == s)
          {
            tokenName = aTokenName;
            tokenString = s;
            tokenFound = true;
          }
        }
        break;
      case this.getGrammar().kREGEXP_TOKEN:
        {
          var r = token.value;
          r.lastIndex = aLastIndex;
          var result = r.exec(aSourceString); 
          if (result)
          {
            tokenName = aTokenName;
            tokenString = result[0];
            tokenFound = true;
          }
        }
        break;
      default: // we should not ever reach this
        break;
    }

    if (tokenFound)
      return {name: tokenName, string: tokenString, error: false};
    return {name: "", string: "", error:true};
  }
};

