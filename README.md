# 🎡 WheelWorks — Custom Spinning Wheel App

WheelWorks is a lightweight, customizable spinning‑wheel application built with HTML, CSS, and JavaScript. It allows users to add items, edit them, remove them, and spin a fully animated wheel featuring a casino‑style motion with acceleration, long spin, ease‑out, and a final bounce.

This project is ideal for:
- Classroom activities
- Randomized selection
- Games and challenges
- Prize wheels
- Decision-making tools

---

## ✨ Features

- **Add / Edit / Remove Items**  
  Items are stored in `localStorage` and persist across sessions.

- **Collapsible Items Panel**  
  Clean UI with smooth open/close transitions.

- **Dynamic Wheel Rendering**  
  Each item becomes a slice of the wheel, drawn using the HTML5 Canvas API.

- **Casino‑Style Spin Animation**  
  Includes acceleration, long spin, ease‑out, and bounce for a realistic feel.

- **Accurate Slice Selection**  
  The wheel calculates the winning slice based on the final rotation angle.

- **Persistent Data**  
  Items remain saved even after closing the browser.

- **Responsive Layout**  
  Works on desktop and laptop screens.

---

## 📁 Project Structure


---

## 🚀 How It Works

### 1. Item Management
Users can add items through an input field. Each item is stored as an object:

```js
{
  id: "itm_123456789",
  name: "Example Item",
  created: 123456789
}

wheelworks_items
