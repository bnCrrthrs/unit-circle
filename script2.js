"use strict";
// svg.innerHTML = `<circle cx="1.25" cy="1.25" r="1" style="fill: #22feb0; stroke: #220919; stroke-width: ${strokeWidth}" />`;

const svg = document.querySelector("#svg-circle");
const handle = document.querySelector("#handle");

let sq = Math.min(window.innerHeight, window.innerWidth);
let r = svg.getBoundingClientRect().width / 4;
let strokeWidth = 2 / r;
let mouseDown = false;

svg.innerHTML = `<circle cx="0" cy="0" r="1" style="fill: none; stroke: #22feb0; stroke-width: ${strokeWidth}" />`;
svg.insertAdjacentHTML(
  "beforeend",
  `<line x1="0" y1="0" x2="${Math.cos(Math.PI / 4)}" y2="${Math.sin(
    Math.PI / 4
  )}" style="fill: none; stroke: #22feb0; stroke-linecap: round; stroke-width: ${strokeWidth}"  />`
);

function positionHandle(angle = Math.PI / 4) {
  const cX = window.innerWidth / 2;
  const cY = window.innerHeight / 2;

  const x = r * Math.cos(angle);
  const y = r * Math.sin(angle);

  handle.style.left = x + cX + "px";
  handle.style.top = y + cY + "px";
}

handle.addEventListener("mousedown", putMouseDown);
document.addEventListener("mouseup", putMouseUp);
document.addEventListener("mousemove", moveMouse);

function putMouseDown() {
  mouseDown = true;
}

function putMouseUp() {
  mouseDown = false;
}

function moveMouse(e) {
  if (!mouseDown) return;
  const cX = window.innerWidth / 2;
  const cY = window.innerHeight / 2;

  const x = e.clientX - cX;
  const y = -(e.clientY - cY);

  const angleOffset = x < 0 ? Math.PI : 0;
  const angle = Math.atan(y / x) + angleOffset;

  svg.innerHTML = `<circle cx="0" cy="0" r="1" style="fill: none; stroke: #22feb0; stroke-width: ${strokeWidth}" />`;
  svg.insertAdjacentHTML(
    "beforeend",
    `<line x1="0" y1="0" x2="${Math.cos(angle)}" y2="${Math.sin(
      angle
    )}" style="fill: none; stroke: #22feb0; stroke-linecap: round; stroke-width: ${strokeWidth}"  />`
  );
}

positionHandle();
