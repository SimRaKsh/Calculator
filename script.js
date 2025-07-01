let expression = "";
let isDegree = true;

function updateDisplay() {
  document.getElementById("display").value = expression || "0";
}

document.getElementById("display").addEventListener("input", (e) => {
  expression = e.target.value;
});

function insertAtCursor(text) {
  const input = document.getElementById("display");

  expression = input.value;

  const start = input.selectionStart;
  const end = input.selectionEnd;

  if (expression === "0" && start === end && !isNaN(text)) {
    expression = text;
    updateDisplay();
    setTimeout(() => {
      input.focus();
      input.selectionStart = input.selectionEnd = 1;
    }, 0);
    return;
  }

  expression = expression.slice(0, start) + text + expression.slice(end);
  updateDisplay();

  setTimeout(() => {
    input.focus();
    input.selectionStart = input.selectionEnd = start + text.length;
  }, 0);
}

function appendNumber(num) {
  insertAtCursor(num);
}

function appendOperator(op) {
  insertAtCursor(op);
}

function appendBracket(bracket) {
  insertAtCursor(bracket);
}

function addFunc(func) {
  insertAtCursor(func);
}

function clearDisplay() {
  expression = "";
  updateDisplay();
}

function deleteLast() {
  const input = document.getElementById("display");
  expression = input.value;

  const start = input.selectionStart;
  const end = input.selectionEnd;

  if (start === end && start > 0) {
    expression = expression.slice(0, start - 1) + expression.slice(end);
    updateDisplay();

    setTimeout(() => {
      input.focus();
      input.selectionStart = input.selectionEnd = start - 1;
    }, 0);
  } else if (start !== end) {
    expression = expression.slice(0, start) + expression.slice(end);
    updateDisplay();

    setTimeout(() => {
      input.focus();
      input.selectionStart = input.selectionEnd = start;
    }, 0);
  }
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
    lastExpression = expression;

    let finalExpr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/sin\(/g, isDegree ? "Math.sin(toRadians(" : "Math.sin(")
      .replace(/cos\(/g, isDegree ? "Math.cos(toRadians(" : "Math.cos(")
      .replace(/tan\(/g, isDegree ? "Math.tan(toRadians(" : "Math.tan(")
      .replace(/log\(/g, "Math.log10(");

    const open = (finalExpr.match(/\(/g) || []).length;
    const close = (finalExpr.match(/\)/g) || []).length;
    if (open > close) finalExpr += ")".repeat(open - close);

    const result = eval(finalExpr);
    expression = parseFloat(result.toFixed(6)).toString();
  } catch {
    expression = "Sorry Pookie";
  }

  updateDisplay();
}

document.addEventListener("keydown", (e) => {
  const active = document.activeElement;
  const isTyping = active.id === "display";

  if (isTyping) return;

  const key = e.key;

  if (/\d/.test(key)) insertAtCursor(key);
  else if (["+", "-", "*", "/", "."].includes(key)) insertAtCursor(key);
  else if (key === "Enter") {
    e.preventDefault();
    calculateResult();
  } else if (key === "Backspace") {
    e.preventDefault();
    deleteLast();
  } else if (key === "(" || key === ")") {
    insertAtCursor(key);
  }
});

function moveCursor(direction) {
  const input = document.getElementById("display");
  let pos = input.selectionStart;

  pos = Math.max(0, Math.min(expression.length, pos + direction));
  setTimeout(() => {
    input.focus();
    input.selectionStart = input.selectionEnd = pos;
  }, 0);
}

function restoreLast() {
  if (lastExpression) {
    expression = lastExpression;
    updateDisplay();
  }
}

