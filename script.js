let expression = "";

function updateDisplay() {
  document.getElementById("display").textContent = expression || "0";
}
function appendBracket(bracket) {
  expression += bracket;
  updateDisplay();
}

function appendNumber(num) {
  expression += num;
  updateDisplay();
}

function appendOperator(op) {
  expression += op;
  updateDisplay();
}

function clearDisplay() {
  expression = "";
  updateDisplay();
}

function addTrig(func) {
  expression += func
  updateDisplay();
}

function deleteLast() {
  expression = expression.slice(0, -1); // remove last character
  updateDisplay();
}


function calculateResult() {
  try {
    // Replace sin/cos with Math.sin/Math.cos (in radians)
    const finalExpr = expression
      .replace(/sin\(/g, "Math.sin(toRadians(")
      .replace(/cos\(/g, "Math.cos(toRadians(")

    const result = eval(finalExpr + ")".repeat((finalExpr.match(/\(/g) || []).length - (finalExpr.match(/\)/g) || []).length));
    expression = parseFloat(result.toFixed(6)).toString();
  } catch {
    expression = "Sorry Pookie";
  }
  updateDisplay();
}

function toRadians(deg) {
  return deg * Math.PI / 180;
}
