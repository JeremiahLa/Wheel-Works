// -------------------------------
// Step 3: Data Model + LocalStorage
// -------------------------------

// Collapsible panel logic (from Step 2)
const toggleBtn = document.getElementById("toggleItems");
const itemsContainer = document.getElementById("itemsContainer");

let itemsOpen = false;

toggleBtn.addEventListener("click", () => {
  itemsOpen = !itemsOpen;

  if (itemsOpen) {
    toggleBtn.textContent = "Hide Items";
    itemsContainer.style.maxHeight = "500px";
    itemsContainer.style.opacity = "1";
  } else {
    toggleBtn.textContent = "Show Items";
    itemsContainer.style.maxHeight = "0";
    itemsContainer.style.opacity = "0";
  }
});

// -------------------------------
// Item Data Model
// -------------------------------

let items = []; // array of item objects

// Load items from localStorage
function loadItems() {
  try {
    const stored = localStorage.getItem("wheelworks_items");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      items = parsed;
    }
  } catch (err) {
    console.error("Error loading items:", err);
  }
}

// Save items to localStorage
function saveItems() {
  localStorage.setItem("wheelworks_items", JSON.stringify(items));
}

// -------------------------------
// Add Item
// -------------------------------

const itemInput = document.getElementById("itemInput");
const addBtn = document.getElementById("addBtn");
const itemsList = document.getElementById("itemsList");

addBtn.addEventListener("click", () => {
  const name = itemInput.value.trim();
  if (name === "") return;

  const newItem = {
    id: "itm_" + Date.now(),
    name,
    created: Date.now()
  };

  items.push(newItem);
  saveItems();
  renderItems();

  itemInput.value = "";
});

// -------------------------------
// Render Items
// -------------------------------

function renderItems() {
  itemsList.innerHTML = "";

  items.forEach(item => {
    const row = document.createElement("div");
    row.className = "item-row";

    const input = document.createElement("input");
    input.value = item.name;

    input.addEventListener("input", () => {
      item.name = input.value.trim();
      saveItems();
    });

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";

    removeBtn.addEventListener("click", () => {
      items = items.filter(i => i.id !== item.id);
      saveItems();
      renderItems();
    });

    row.appendChild(input);
    row.appendChild(removeBtn);
    itemsList.appendChild(row);
  });
}

// -------------------------------
// Initialize
// -------------------------------

loadItems();
renderItems();

let rotation = 0;   // IMPORTANT: rotation must be defined BEFORE drawWheel()
console.log("Step 3 complete: Data model + localStorage ready.");

// -------------------------------
// Step 4: Wheel Rendering
// -------------------------------

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

function drawWheel() {
  const w = canvas.width;
  const h = canvas.height;
  const radius = Math.min(w, h) / 2;

  ctx.clearRect(0, 0, w, h);

  if (items.length === 0) {
    ctx.fillStyle = "#111111";
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, radius - 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#00c26e";
    ctx.font = "20px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Add items to begin", w / 2, h / 2);
    return;
  }

  const sliceAngle = (Math.PI * 2) / items.length;

  items.forEach((item, i) => {
    const start = i * sliceAngle;
    const end = start + sliceAngle;

    const gray = 200 - (i * 120) / items.length;
    ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(rotation);   // FULL WHEEL ROTATION

    // Slice
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius - 10, start, end);
    ctx.closePath();
    ctx.fill();

    // Text
    ctx.save();
    ctx.rotate(start + sliceAngle / 2);
    ctx.fillStyle = "#000000";
    ctx.font = "16px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(item.name, radius * 0.55, 6);
    ctx.restore();

    ctx.restore();
  });

  // Pointer (fixed, pointing downward)
  ctx.fillStyle = "#00c26e";
  ctx.beginPath();
  ctx.moveTo(w / 2, 40);
  ctx.lineTo(w / 2 - 15, 10);
  ctx.lineTo(w / 2 + 15, 10);
  ctx.closePath();
  ctx.fill();
}

// Re-render wheel whenever items change
function updateWheel() {
  drawWheel();
}

// Hook into Step 3 rendering
const originalRenderItems = renderItems;
renderItems = function () {
  originalRenderItems();
  updateWheel();
};

// Initial draw
updateWheel();

console.log("Step 4 complete: Wheel rendering ready.");

// -------------------------------
// Step 5: Spin Animation (Casino + Medium Bounce)
// -------------------------------

let spinning = false;

const spinBtn = document.getElementById("spinBtn");

spinBtn.addEventListener("click", () => {
  if (items.length === 0 || spinning) return;

  spinning = true;

  const sliceAngle = (Math.PI * 2) / items.length;

  const winningIndex = Math.floor(Math.random() * items.length);

  const targetAngle = (Math.PI * 2) * 8 + (winningIndex * sliceAngle) + sliceAngle / 2;

  const startRotation = rotation;
  const totalRotation = targetAngle - startRotation;

  const accelDuration = 400;
  const spinDuration = 6000;
  const easeOutDuration = 1200;
  const bounceBack = 0.10;

  const startTime = performance.now();

  function animate(time) {
    const elapsed = time - startTime;

    if (elapsed < accelDuration) {
      const t = elapsed / accelDuration;
      const eased = t * t * t;
      rotation = startRotation + totalRotation * 0.1 * eased;
      updateWheel();
      requestAnimationFrame(animate);
      return;
    }

    if (elapsed < accelDuration + spinDuration) {
      const t = (elapsed - accelDuration) / spinDuration;
      rotation = startRotation + totalRotation * (0.1 + 0.7 * t);
      updateWheel();
      requestAnimationFrame(animate);
      return;
    }

    if (elapsed < accelDuration + spinDuration + easeOutDuration) {
      const t = (elapsed - accelDuration - spinDuration) / easeOutDuration;
      const eased = 1 - Math.pow(1 - t, 3);
      rotation = startRotation + totalRotation * (0.8 + 0.2 * eased);
      updateWheel();
      requestAnimationFrame(animate);
      return;
    }

    // Bounce backward
    rotation = startRotation + totalRotation - bounceBack;
    updateWheel();

    // Settle forward
    setTimeout(() => {
      rotation = startRotation + totalRotation;

      // Prevent backward drift on next spin
      rotation = rotation % (Math.PI * 2);

      updateWheel();
      spinning = false;
    }, 120);
  }

  requestAnimationFrame(animate);
});
