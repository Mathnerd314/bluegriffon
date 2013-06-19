
const kFONT_FEATURES = [
  "aalt",
  "afrc",
  "c2pc",
  "c2sc",
  "calt",
  "case",
  "ccmp",
  "clig",
  "cpsp",
  "cswh",
  "dlig",
  "dnom",
  "fina",
  "frac",
  "hist",
  "hlig",
  "init",
  "isol",
  "liga",
  "lnum",
  "locl",
  "mark",
  "medi",
  "mgrk",
  "mkmk",
  "nalt",
  "numr",
  "onum",
  "ordn",
  "ornm",
  "pcap",
  "pnum",
  "rlig",
  "salt",
  "sinf",
  "size",
  "smcp",
  "subs",
  "sups",
  "swsh",
  "titl",
  "tnum",
  "unic",
  "zero"
];

RegisterIniter(FontsSectionIniter);

function FontsSectionIniter(aElt, aRuleset)
{
}

function FontsInit()
{
  window.removeEventListener('load',
		                          FontsInit,
		                          false);

  var rows = document.getElementById("ffRows");
  alert(rows);
  for (var i = 0; i < kFONT_FEATURES.length; i+=2) {
    var row = document.createElement("row");
    row.setAttribute("align", "center");

    var id1 = kFONT_FEATURES[i];
    var id2 = kFONT_FEATURES[i+1];

    var c1 = document.createElement("checkbox");
    c1.setAttribute("id", "ff" + id1.toUpperCase());
    row.appendChild(c1);

    var t1 = document.createElement("textbox");
    t1.setAttribute("size", "2");
    t1.setAttribute("id", "ff" + id1.toUpperCase() + 'val');
    row.appendChild(t1);

    var h1 = document.createElement("hbox");
    h1.setAttribute("align", "center");
    row.appendChild(h1);

    var i1 = document.createElement("image");
    i1.setAttribute("src", "chrome://cssproperties/skin/fontFeatures/" + id1 + ".png");
    h1.appendChild(i1);

    var sp = document.createElement("spacer");
    row.appendChild(sp);
    
    var c2 = document.createElement("checkbox");
    c2.setAttribute("id", "ff" + id2.toUpperCase());
    row.appendChild(c2);

    var t2 = document.createElement("textbox");
    t2.setAttribute("size", "2");
    t2.setAttribute("id", "ff" + id2.toUpperCase() + 'val');
    row.appendChild(t2);

    var h2 = document.createElement("hbox");
    h2.setAttribute("align", "center");
    row.appendChild(h2);

    var i2 = document.createElement("image");
    i2.setAttribute("src", "chrome://cssproperties/skin/fontFeatures/" + id2 + ".png");
    h2.appendChild(i2);

    rows.appendChild(row);
  }
}
