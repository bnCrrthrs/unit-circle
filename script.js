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
  settings.angle = settings.angle ?? Math.PI / 3;
  settings.showAnnotations = settings.showAnnotations ?? true;
  settings.mouseDown = false;
}

const lblAngleRad = document.querySelector("#lblAngleRad");
const lblAngleDeg = document.querySelector("#lblAngleDeg");
const lblSin = document.querySelector("#lblSin");
const lblCos = document.querySelector("#lblCos");
const lblTan = document.querySelector("#lblTan");
const lblCsc = document.querySelector("#lblCsc");
const lblSec = document.querySelector("#lblSec");
const lblCot = document.querySelector("#lblCot");

function line(coords, colour = c.main, width = 1) {
  if (coords.includes(NaN) || coords.includes(Infinity) || coords.includes(-Infinity)) return;
  const [x1, y1, x2, y2] = coords;
  svg.insertAdjacentHTML(
    "afterbegin",
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="fill: none; stroke: ${colour}; stroke-width: ${
      settings.strokeWidth * width
    }; stroke-linecap: round" />`
  );
}

function annotate(text, x, y, rotation = 0) {
  if (Math.abs(x) === Infinity || Math.abs(y) === Infinity || isNaN(x) || isNaN(y)) return;
  const rotateDegs = (-rotation * 180) / Math.PI;
  svg.insertAdjacentHTML(
    "beforeend",
    `<g transform="scale(1,-1) translate(${x}, ${-y})"><text class="annotation-sm" transform="rotate(${rotateDegs})">${text}</text></g>`
  );
}

function drawCircle(angle = settings.angle) {
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
  if (settings.showAnnotations) {
    annotate("cos", cos / 2, sin);
    annotate("sin", cos, sin / 2, Math.PI / 2 + (cosAbs > 0 ? Math.PI : 0));
    annotate("tan", cosAbs, (cosAbs * tan) / 2, Math.PI / 2 + (cosAbs > 0 ? Math.PI : 0));
    annotate("tan", cos + (sec - cos) / 2, sin / 2, angle - Math.PI / 2 + (sinAbs < 0 ? Math.PI : 0));
    annotate("cot", (sinAbs * cot) / 2, sinAbs);
    annotate("cot", cos / 2, sin + (csc - sin) / 2, angle - Math.PI / 2 + (sinAbs < 0 ? Math.PI : 0));
    annotate("sec", sec / 2, 0);
    annotate("csc", 0, csc / 2, Math.PI / 2 + (cosAbs < 0 ? Math.PI : 0));
    annotate("sec", cosAbs / 2, (cosAbs * tan) / 2, angle + (cosAbs < 0 ? Math.PI : 0));
    annotate("csc", (sinAbs * cot) / 2, sinAbs / 2, angle + (cosAbs < 0 ? Math.PI : 0));
  }

  //angle solid
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

  updateLabels();
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

function updateLabels() {
  const vertical = settings.angle === Math.PI / 2 || settings.angle === (3 * Math.PI) / 2;
  const horizontal = settings.angle === 0 || settings.angle === Math.PI || settings.angle === 2 * Math.PI;

  const degrees = (settings.angle * 180) / Math.PI;
  const sin = Math.sin(settings.angle);
  const cos = Math.cos(settings.angle);
  const tan = vertical ? "undef" : Math.tan(settings.angle);
  const csc = horizontal ? "undef" : 1 / sin;
  const sec = vertical ? "undef" : 1 / cos;
  const cot = vertical || horizontal ? "undef" : 1 / tan;

  lblAngleRad.value = roundNum(settings.angle);
  lblAngleDeg.value = roundNum(degrees);
  lblSin.textContent = roundNum(sin);
  lblCos.textContent = roundNum(cos);
  lblTan.textContent = roundNum(tan);
  lblCsc.textContent = roundNum(csc);
  lblSec.textContent = roundNum(sec);
  lblCot.textContent = roundNum(cot);
}

function roundNum(n, digits = 5) {
  if (isNaN(n)) return undefined;
  const multiplier = 10 ** digits;
  const rounded = Math.round(n * multiplier);
  return rounded / multiplier;
}

handle.addEventListener("mousedown", putMouseDown);
document.addEventListener("mouseup", putMouseUp);
document.addEventListener("mousemove", moveMouse);
window.addEventListener("resize", resize);
lblAngleRad.addEventListener("change", updateAngleFromRad);
lblAngleDeg.addEventListener("change", updateAngleFromDeg);

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

function setAngle(angle) {
  if (isNaN(angle)) return;
  angle += Math.PI * 2;
  angle %= Math.PI * 2;
  settings.angle = angle;
}

function moveMouse(e) {
  if (!settings.mouseDown) return;
  const cX = window.innerWidth / 2;
  const cY = window.innerHeight / 2;

  const x = e.clientX - cX;
  const y = -(e.clientY - cY);

  const angleOffset = x < 0 ? Math.PI : 0;
  const angle = Math.atan(y / x) + angleOffset;
  setAngle(angle);

  drawCircle();
}

function updateAngleFromRad(e) {
  const newAngle = Number(e.target.value);
  setAngle(newAngle);
  drawCircle();
  e.target.blur();
}

function updateAngleFromDeg(e) {
  const newAngle = Number(e.target.value);
  const radians = (newAngle * Math.PI) / 180;
  setAngle(radians);
  drawCircle();
  e.target.blur();
}

drawCircle();
