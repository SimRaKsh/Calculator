// script.js
let expression      = "";
let lastExpression  = "";
let isDegree        = true;
let lastWasResult   = false;

const display = document.getElementById("display");

display.addEventListener("input", e => {
  // keep expression in sync if ever edited directly
  expression = e.target.value;
});

// move caret to a given position
function focusAt(pos) {
  setTimeout(() => {
    display.focus();
    display.selectionStart = display.selectionEnd = pos;
  }, 0);
}

function updateDisplay() {
  display.value = expression || "0";
}

// insert any text at the current cursor (or end)
function insertAtCursor(text) {
  expression = display.value;
  const start = display.selectionStart;
  const end   = display.selectionEnd;

  // if just "0" and typing a digit, replace rather than append
  if (expression === "0" && start === end && /\d/.test(text)) {
    expression = text;
  } else {
    expression = expression.slice(0, start)
               + text
               + expression.slice(end);
  }

  lastWasResult = false;
  updateDisplay();
  focusAt(start + text.length);
}

// wrappers for your buttons
// replace your appendNumber with:
function appendNumber(num) {
  if (lastWasResult) {
    // user typed a digit right after "=", so start fresh
    expression = num;
    lastWasResult = false;
  } else {
    // normal case: append
    expression += num;
  }
  updateDisplay();
}
// replace your appendOperator with:
function appendOperator(op) {
  if (lastWasResult) {
    // user pressed operator right after "=", keep the result then chain
    lastWasResult = false;
  }
  expression += op;
  updateDisplay();
}
function appendBracket(b)       { insertAtCursor(b); }
function addFunc(f)             { insertAtCursor(f); }

// clear everything
function clearDisplay() {
  expression    = "";
  lastWasResult = false;
  updateDisplay();
}

// delete at cursor (or selection)
function deleteLast() {
  expression = display.value;
  const start = display.selectionStart;
  const end   = display.selectionEnd;

  if (start === end && start > 0) {
    // no selection: delete one char before cursor
    expression = expression.slice(0, start - 1)
               + expression.slice(end);
    updateDisplay();
    focusAt(start - 1);
  } else if (start !== end) {
    // delete entire selection
    expression = expression.slice(0, start)
               + expression.slice(end);
    updateDisplay();
    focusAt(start);
  }

  lastWasResult = false;
}

function restoreLast() {
  if (lastExpression) {
    expression    = lastExpression;
    lastWasResult = false;
    updateDisplay();
    focusAt(expression.length);
  }
}

function moveCursor(direction) {
  const pos = Math.max(
    0,
    Math.min(display.value.length,
      display.selectionStart + direction
    )
  );
  focusAt(pos);
}

function toRadians(deg) {
  return deg * Math.PI / 180;
}

function toggleMode() {
  isDegree = !isDegree;
  document.getElementById("mode").textContent = isDegree ? "DEG" : "RAD";
}

function calculateResult() {
  try {
    // save the expression you just evaluated
    lastExpression = expression;

    // translate your display symbols into valid JS
    let expr = expression
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/sin\(/g, isDegree ? "Math.sin(toRadians(" : "Math.sin(")
      .replace(/cos\(/g, isDegree ? "Math.cos(toRadians(" : "Math.cos(")
      .replace(/tan\(/g, isDegree ? "Math.tan(toRadians(" : "Math.tan(")
      .replace(/log\(/g, "Math.log10(");

    // evaluate
    const result = eval(expr);
    expression   = parseFloat(result.toFixed(6)).toString();
    lastWasResult = true;
  } catch (e) {
    console.error("Calc error:", e);
    expression = "Sorry Pookie";
  }

  updateDisplay();
  focusAt(expression.length);
}

// optional: keyboard support
document.addEventListener("keydown", e => {
  if (document.activeElement === display) return;
  const k = e.key;
  if (/\d/.test(k))        { e.preventDefault(); insertAtCursor(k); }
  else if ("+-*/.".includes(k)) { e.preventDefault(); insertAtCursor(k); }
  else if (k === "Enter")  { e.preventDefault(); calculateResult(); }
  else if (k === "Backspace") { e.preventDefault(); deleteLast(); }
  else if (k === "(" || k === ")") { e.preventDefault(); insertAtCursor(k); }
});
