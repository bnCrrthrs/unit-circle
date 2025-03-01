"use strict";
// svg.innerHTML = `<circle cx="1.25" cy="1.25" r="1" style="fill: #22feb0; stroke: #220919; stroke-width: ${strokeWidth}" />`;

const svg = document.querySelector("#svg-circle");
const handle = document.querySelector("#handle");

const c = {
  white: "#91848C",
  grey: "#64535E",
  main: "#22feb0",
  red: "#FF4870",
  orange: "#EEA243",
  yellow: "#FDE74C",
  green: "#76B041",
  blue: "#02A9EA",
  purple: "#5E239D",
  pink: "#FF66B3",
};

const settings = {};
setSettings();
function setSettings() {
  settings.sq = Math.min(window.innerHeight, window.innerWidth);
  settings.r = svg.getBoundingClientRect().width / 4;
  settings.strokeWidth = 2 / settings.r;
  settings.max = Math.max(window.innerHeight, window.innerWidth) / settings.r;
  settings.mouseDown = false;
}

function line(coords, colour = c.main, width = 1) {
  if (coords.includes(NaN) || coords.includes(Infinity) || coords.includes(-Infinity)) return;
  const [x1, y1, x2, y2] = coords;
  // const [x1, y1, x2, y2] = coords.map((n) => {
  //   if (isNaN(n)) return 0;
  //   if (n === Infinity) return 1000000000;
  //   if (n === -Infinity) return -1000000000;
  //   return n;
  // });
  svg.insertAdjacentHTML(
    "afterbegin",
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="fill: none; stroke: ${colour}; stroke-width: ${
      settings.strokeWidth * width
    }; stroke-linecap: round" />`
  );
}

function drawCircle(angle = Math.PI / 3) {
  angle += Math.PI * 2;
  angle %= Math.PI * 2;
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  const tan = Math.tan(angle);
  const sec = 1 / cos;
  const csc = 1 / sin;
  const cot = 1 / tan;

  const sinAbs = sin / Math.abs(sin);
  const cosAbs = cos / Math.abs(cos);

  //circle
  svg.innerHTML = `<circle cx="0" cy="0" r="1" style="fill: none; stroke: #ffffff; stroke-width: ${settings.strokeWidth / 2}" />`;

  line([cos, 0, cos, sin], c.main, 0.5); //sin
  line([0, sin, cos, sin], c.red, 0.5); //cos
  line([0, csc, cos, sin], c.orange, 0.5); //cot
  line([sec, 0, cos, sin], c.yellow, 0.5); //tan
  line([0, 0, sec, 0], c.pink, 0.5); //sec
  line([0, 0, 0, csc], c.blue, 0.5); //csc

  line([0, sinAbs * settings.strokeWidth, cosAbs * 1, cosAbs * tan + sinAbs * settings.strokeWidth], c.pink, 0.5); // outer sec
  line([0, 0, sinAbs * cot, sinAbs * 1], c.blue, 0.5); //outer csc
  line([cosAbs, 0, cosAbs, cosAbs * tan + sinAbs * settings.strokeWidth], c.yellow, 0.5); // outer tan
  line([0, sinAbs, cot * sinAbs, sinAbs], c.orange, 0.5); // outer cot

  //axes
  line([-settings.max, 0, settings.max, 0], c.grey, 0.25);
  line([0, -settings.max, 0, settings.max], c.grey, 0.25);
  line([-settings.max, 1, settings.max, 1], c.grey, 0.25);
  line([-settings.max, -1, settings.max, -1], c.grey, 0.25);
  line([-1, -settings.max, -1, settings.max], c.grey, 0.25);
  line([1, -settings.max, 1, settings.max], c.grey, 0.25);

  // annotations
  svg.insertAdjacentHTML(
    "beforeend",
    // `<path id="cos" d="M0 0 L1 0" /><text text-anchor="middle" style="font-size: 0.05; fill: white"><textPath href="#cos">Cosine</textPath></text>`
    `  <text text-anchor="middle" x="0.5" y="0" style="font-size: 0.075; fill: white; transform: scale(1,-1);">Cosine</text>
`
  );

  //angle solid
  //M0 0 L0.2 0 A0 0 0 1 1 ${cos * 0.2} ${sin * 0.2} C"
  svg.insertAdjacentHTML(
    "afterbegin",
    `<path d="M0.15 0 A0.15 0.15 0 ${angle > Math.PI ? 1 : 0} 1 ${cos * 0.15} ${sin * 0.15}" style="fill: none; stroke: ${
      c.purple
    }; stroke-width: ${settings.strokeWidth}" />`
  );

  // drawHandle
  svg.insertAdjacentHTML(
    "beforeend",
    `<circle cx="${cos}" cy="${sin}" r="${0.05}" style="fill: #220919; stroke: #ffffff; stroke-width: ${settings.strokeWidth / 2}" />`
  );
  positionHandle(angle);
}

function positionHandle(angle) {
  const cX = window.innerWidth / 2;
  const cY = window.innerHeight / 2;

  const x = settings.r * Math.cos(angle);
  const y = settings.r * Math.sin(angle);

  handle.style.left = x + cX + "px";
  handle.style.top = y + cY + "px";
}

handle.addEventListener("mousedown", putMouseDown);
document.addEventListener("mouseup", putMouseUp);
document.addEventListener("mousemove", moveMouse);
window.addEventListener("resize", resize);

function resize() {
  setSettings();
  drawCircle();
}

function putMouseDown() {
  settings.mouseDown = true;
}

function putMouseUp() {
  settings.mouseDown = false;
}

function moveMouse(e) {
  if (!settings.mouseDown) return;
  const cX = window.innerWidth / 2;
  const cY = window.innerHeight / 2;

  const x = e.clientX - cX;
  const y = -(e.clientY - cY);

  const angleOffset = x < 0 ? Math.PI : 0;
  const angle = Math.atan(y / x) + angleOffset;

  drawCircle(angle);
}

drawCircle();
