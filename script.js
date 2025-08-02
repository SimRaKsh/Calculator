let expression = "", lastExpression = "", isDegree = true, lastWasResult = false, history = [], isEditing = false, selectedHistoryIndex = -1;
const display = document.getElementById("display"), historyDiv = document.getElementById("history");

window.toRad = function(d) {
  return d * Math.PI / 180;
};

function flipCard() {
  document.getElementById("card").classList.toggle("flipped");
}

function isResetCondition() {
  return expression === "SorryPookie" || expression.toLowerCase().includes("pookie");
}

function updateDisplay() {
  display.value = expression || "0";
}

function renderHistory() {
  historyDiv.innerHTML = '';
  history.forEach((rec, index) => {
    const d = document.createElement('div');
    d.className = 'history-line';
    d.textContent = rec;

    d.onclick = () => {
      expression = rec.split('=')[0].trim();
      lastWasResult = false;
      isEditing = false;
      selectedHistoryIndex = index; // save selected index
      updateDisplay();
    };

    historyDiv.appendChild(d);
  });

  historyDiv.scrollTop = historyDiv.scrollHeight;
}


function insertAtCursor(text) {
  const pos = display.selectionStart;
  expression = expression.slice(0, pos) + text + expression.slice(pos);
  setTimeout(() => {
    display.focus();
    display.selectionStart = display.selectionEnd = pos + text.length;
  }, 0);
}

function appendNumber(n) {
  if (lastWasResult || isResetCondition()) {
    expression = n;
    lastWasResult = false;
  } else if (isEditing) {
    insertAtCursor(n);
  } else {
    expression += n;
  }
  updateDisplay();
}

function appendOperator(op) {
  if (isResetCondition()) {
    expression = op;
  } else if (isEditing) {
    insertAtCursor(op);
  } else {
    if (lastWasResult) lastWasResult = false;
    expression += op;
  }
  updateDisplay();
}

function appendBracket(b) {
  if (isResetCondition()) {
    expression = b;
    lastWasResult = false;
  } else if (isEditing) {
    insertAtCursor(b);
  } else {
    expression += b;
  }
  updateDisplay();
}

function addFunc(f) {
  const func = f + '(';
  if (isResetCondition()) {
    expression = func;
    lastWasResult = false;
  } else if (isEditing) {
    insertAtCursor(func);
  } else {
    expression += func;
  }
  updateDisplay();
}

function clearDisplay() {
  expression = "";
  lastWasResult = false;
  history = [];
  updateDisplay();
  renderHistory();
}

function clearCurrent() {
  expression = "";
  lastWasResult = false;
  updateDisplay();
}

function deleteLast() {
  if (lastWasResult || expression === "SorryPookie") {
    expression = "";
    lastWasResult = false;
  } else {
    const pos = display.selectionStart;
    if (isEditing && pos > 0) {
      expression = expression.slice(0, pos - 1) + expression.slice(pos);
      setTimeout(() => {
        display.focus();
        display.selectionStart = display.selectionEnd = pos - 1;
      }, 0);
    } else {
      expression = expression.slice(0, -1);
    }
  }
  updateDisplay();
}

function moveCursor(d) {
  const p = Math.max(0, Math.min(display.value.length, display.selectionStart + d));
  setTimeout(() => {
    display.focus();
    display.selectionStart = display.selectionEnd = p;
  }, 0);
}

function toggleMode() {
  isDegree = !isDegree;
  document.getElementById("mode").textContent = isDegree ? "DEG" : "RAD";
  if (lastWasResult && lastExpression) {
    expression = lastExpression;
    calculateResult();
  }
}

function calculateResult() {
  try {
    lastExpression = expression;
    let expr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/√\(/g, "Math.sqrt(")
      .replace(/sin\(([^)]+)\)/g, (_, angle) => isDegree ? `Math.sin(toRad(${angle}))` : `Math.sin(${angle})`)
      .replace(/cos\(([^)]+)\)/g, (_, angle) => isDegree ? `Math.cos(toRad(${angle}))` : `Math.cos(${angle})`)
      .replace(/tan\(([^)]+)\)/g, (_, angle) => isDegree ? `Math.tan(toRad(${angle}))` : `Math.tan(${angle})`)
      .replace(/log\(/g, "Math.log10(");

    const res = eval(expr);
    const s = parseFloat(res.toFixed(6)).toString();

    expression = s;
    updateDisplay();
    lastWasResult = true;
    isEditing = false;

    history.push(lastExpression + " = " + s);
    renderHistory();
  } catch (e) {
    expression = "SorryPookie";
    lastWasResult = true;
    updateDisplay();
  }
}
function editFromHistory() {
  if (selectedHistoryIndex === -1) return;

  const selected = history[selectedHistoryIndex];
  expression = selected.split('=')[0].trim();
  lastWasResult = false;
  isEditing = true;
  updateDisplay();

  setTimeout(() => {
    display.focus();
    display.selectionStart = display.selectionEnd = display.value.length;
  }, 0);
}

