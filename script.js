let expression = "",
  lastExpression = "",
  isDegree = true,
  lastWasResult = false,
  history = [],
  isEditing = false;

const display = document.getElementById("display"),
  historyDiv = document.getElementById("history");

// Create live result div
const liveResult = document.createElement("div");
liveResult.id = "liveResult";
liveResult.className = "live-result-in-history";
liveResult.textContent = "= 0";
historyDiv.appendChild(liveResult);

window.toRad = function (d) {
  return d * Math.PI / 180;
};

function flipCard() {
  document.getElementById("card").classList.toggle("flipped");
}

// Clear all: expression + history
function clearAll() {
  expression = "";
  history = [];
  renderHistory();
  updateDisplay();
}

// Clear current display only
function clearCurrent() {
  expression = "";
  updateDisplay();
}

// Append numbers
function appendNumber(num) {
  const cursorPos = display.selectionStart;
  if (lastWasResult && !isEditing) {
    expression = num;
    lastWasResult = false;
    updateDisplay();
    setCursorToEnd();
  } else {
    expression = expression.slice(0, cursorPos) + num + expression.slice(cursorPos);
    updateDisplay();
    setCursor(cursorPos + num.length);
  }
}

// Append operators (handles post-result correctly)
function appendOperator(op) {
  const cursorPos = display.selectionStart;

  if (lastWasResult && !isEditing) {
    expression = lastLiveResult;
    lastWasResult = false;
    updateDisplay();
    setCursorToEnd();
  }

  // Always insert at cursor
  const insertPos = display.selectionStart;
  expression = expression.slice(0, insertPos) + op + expression.slice(insertPos);
  updateDisplay();
  setCursor(insertPos + op.length);
}

// Add brackets
function appendBracket(br) {
  const cursorPos = display.selectionStart;
  expression = expression.slice(0, cursorPos) + br + expression.slice(cursorPos);
  updateDisplay();
  setCursor(cursorPos + 1);
}

// Insert functions like sin, cos, log
function addFunc(func) {
  if (lastWasResult && !isEditing) {
    expression = "";
    lastWasResult = false;
  }

  const funcStr = func === '√' ? "√(" : func + "(";
  const cursorPos = display.selectionStart;
  expression = expression.slice(0, cursorPos) + funcStr + expression.slice(cursorPos);
  updateDisplay();
  setCursor(cursorPos + funcStr.length);
}

// Delete last character at cursor
function deleteLast() {
  const cursorPos = display.selectionStart;
  if (cursorPos > 0) {
    expression = expression.slice(0, cursorPos - 1) + expression.slice(cursorPos);
    updateDisplay();
    setCursor(cursorPos - 1);
  }
}

// Toggle between DEG and RAD
function toggleMode() {
  isDegree = !isDegree;
  document.getElementById("mode").textContent = isDegree ? "DEG" : "RAD";
  updateDisplay();
}

// Calculate full result
function calculateResult() {
  try {
    lastExpression = expression;

    let expr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/√\(/g, "Math.sqrt(")
      .replace(/sin\(([^)]+)\)/g, (_, a) => isDegree ? `Math.sin(toRad(${a}))` : `Math.sin(${a})`)
      .replace(/cos\(([^)]+)\)/g, (_, a) => isDegree ? `Math.cos(toRad(${a}))` : `Math.cos(${a})`)
      .replace(/tan\(([^)]+)\)/g, (_, a) => isDegree ? `Math.tan(toRad(${a}))` : `Math.tan(${a})`)
      .replace(/log\(/g, "Math.log10(");

    const res = eval(expr);
    const result = parseFloat(res.toFixed(6)).toString();

    history.push(`${expression} = ${result}`);
    renderHistory();

    expression = result;
    lastWasResult = true;
    isEditing = false;
    updateDisplay();
    setCursorToEnd();
  } catch (e) {
    expression = "SorryPookie";
    lastWasResult = true;
    updateDisplay();
  }
}

// Render history
function renderHistory() {
  const items = Array.from(historyDiv.children).filter(c => c.id !== "liveResult");
  items.forEach(c => historyDiv.removeChild(c));

  history.forEach(item => {
    const div = document.createElement("div");
    div.textContent = item;
    div.className = "history-line";
    div.onclick = () => {
      expression = item.split(" = ")[0];
      isEditing = true;
      updateDisplay();
      setCursorToEnd();
    };
    historyDiv.insertBefore(div, liveResult);
  });
}

let lastLiveResult = "0";

// Update display and live preview
function updateDisplay() {
  display.value = expression || "0";
  display.scrollLeft = display.scrollWidth;

  try {
    let expr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/√\(/g, "Math.sqrt(")
      .replace(/sin\(([^)]+)\)/g, (_, a) => isDegree ? `Math.sin(toRad(${a}))` : `Math.sin(${a})`)
      .replace(/cos\(([^)]+)\)/g, (_, a) => isDegree ? `Math.cos(toRad(${a}))` : `Math.cos(${a})`)
      .replace(/tan\(([^)]+)\)/g, (_, a) => isDegree ? `Math.tan(toRad(${a}))` : `Math.tan(${a})`)
      .replace(/log\(/g, "Math.log10(");

    if (expression.trim() !== "") {
      const result = eval(expr);
      const formatted = parseFloat(result.toFixed(6)).toString();
      document.getElementById("liveResult").textContent = "= " + formatted;
      lastLiveResult = formatted;
    } else {
      document.getElementById("liveResult").textContent = "= 0";
      lastLiveResult = "0";
    }
  } catch {
    document.getElementById("liveResult").textContent = "= " + lastLiveResult;
  }
}

// Set cursor at specific position
function setCursor(pos) {
  setTimeout(() => {
    display.setSelectionRange(pos, pos);
    display.focus();
  }, 0);
}

// Set cursor at the end
function setCursorToEnd() {
  const len = expression.length;
  setCursor(len);
}

function editFromHistory() {
  isEditing = true;
}
let currentTheme = 0;

const themes = [
  {
    name: "pink",
    values: {
      "--bg-main": "#f6bac4",
      "--bg-history": "#f6a6b3",
      "--bg-display": "white",
      "--bg-button": "#fc889b",
      "--bg-clear": "#FF3659",
      "--bg-hover": "#FF0833",
      "--bg-active": "#5DF15D",
      "--text-color": "black",
      "--text-display": "black",
      "--history-result-bg": "#ffccd5",
      "--history-result-border": "#fc889b",
      "--history-line-selected": "#f77d91",
    }
  },
  {
    name: "black",
    values: {
      "--bg-main": "#121212",
      "--bg-history": "#1e1e1e",
      "--bg-display": "#2c2c2c",
      "--bg-button": "#333",
      "--bg-clear": "#FF3659",
      "--bg-hover": "#444",
      "--bg-active": "#5DF15D",
      "--text-color": "white",
      "--text-display": "white",
      "--history-result-bg": "#444",
      "--history-result-border": "#888",
      "--history-line-selected": "#555",
    }
  },
  {
    name: "blue",
    values: {
      "--bg-main": "#b3d9ff",
      "--bg-history": "#99ccff",
      "--bg-display": "#e6f0ff",
      "--bg-button": "#66b3ff",
      "--bg-clear": "#FF3659",
      "--bg-hover": "#3399ff",
      "--bg-active": "#5DF15D",
      "--text-color": "black",
      "--text-display": "black",
      "--history-result-bg": "#cce6ff",
      "--history-result-border": "#3399ff",
      "--history-line-selected": "#80bfff",
    }
  },
  {
    name: "green",
    values: {
      "--bg-main": "#c2f0c2",
      "--bg-history": "#b3e6b3",
      "--bg-display": "#e6ffe6",
      "--bg-button": "#66cc66",
      "--bg-clear": "#FF3659",
      "--bg-hover": "#33aa33",
      "--bg-active": "#5DF15D",
      "--text-color": "black",
      "--text-display": "black",
      "--history-result-bg": "#ccffcc",
      "--history-result-border": "#33aa33",
      "--history-line-selected": "#99e699",
    }
  },
  {
  name: "yellow",
  values: {
    "--bg-main": "#fff7b3",                // light yellow background
    "--bg-history": "#fff099",
    "--bg-display": "#ffffe6",
    "--bg-button": "#ffd966",              // main yellow buttons
    "--bg-clear": "#FF3659",
    "--bg-hover": "#ffcc33",               // hover yellow
    "--bg-active": "#5DF15D",
    "--text-color": "black",
    "--text-display": "black",
    "--history-result-bg": "#fff8cc",
    "--history-result-border": "#ffcc33",
    "--history-line-selected": "#ffee99",
  }
}

];

// 1. Apply theme function
function applyTheme(index) {
  const theme = themes[index].values;
  for (let key in theme) {
    document.documentElement.style.setProperty(key, theme[key]);
  }
}

// 2. Immediately restore saved theme
(function() {
  const savedThemeIndex = localStorage.getItem("themeIndex");
  currentTheme = savedThemeIndex !== null ? parseInt(savedThemeIndex) : 0;
  applyTheme(currentTheme);
})();

// 3. Theme changer function
function changeTheme() {
  currentTheme = (currentTheme + 1) % themes.length;
  applyTheme(currentTheme);
  localStorage.setItem("themeIndex", currentTheme);
}

// 4. Optional DOMContentLoaded if needed
window.addEventListener("DOMContentLoaded", () => {
  console.log("Theme loaded:", themes[currentTheme].name);
});




