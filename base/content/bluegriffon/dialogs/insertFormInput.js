var gNode = null;
var gType = null;

const kPARAMETERS = [
  ["value"],
  ["value", "autocomplete", "list", "maxlength", "pattern", "placeholder", "readonly", "required", "size"],
  ["value", "autocomplete", "list", "maxlength", "multiple", "pattern", "placeholder", "readonly", "required", "size"],
  ["value", "autocomplete", "maxlength", "pattern", "placeholder", "readonly", "required", "size"],
  ["value", "autocomplete", "list", "max", "min", "readonly", "required", "step"],
  ["value", "autocomplete", "list", "max", "min", "readonly", "required", "step"],
  ["value", "autocomplete", "list", "max", "min", "step"],
  ["value", "autocomplete", "list"],
  ["value", "checked", "required"],
  ["value", "accept", "multiple", "required"],
  ["value", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget"],
  ["value", "alt", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "height", "src", "width"],
  ["value"]
];

const kTYPES = {
  "hidden":         0,
  "text":           1,
  "search":         1,
  "url":            1,
  "tel":            1,
  "email":          2,
  "password":       3,
  "datetime":       4,
  "date":           4,
  "month":          4,
  "week":           4,
  "time":           4,
  "datetime-local": 5,
  "number":         5,
  "range":          6,
  "color":          7,
  "checkbox":       8,
  "radio":          8,
  "file":           9,
  "submit":         10,
  "image":          11,
  "reset":          12,
  "button":         12
};

function Startup()
{
  gNode = window.arguments[0];
  gType = window.arguments[1];
  GetUIElements();

  gDialog.typeMenulist.value = gType;
  if (gNode)
    gDialog.typeMenulist.disabled = true;
}

