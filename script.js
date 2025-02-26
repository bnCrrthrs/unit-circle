"use strict";

const container = document.querySelector("#container");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
canvas.width = container.getBoundingClientRect().width;
canvas.height = container.getBoundingClientRect().height;
ctx.translate(canvas.width / 2, canvas.height / 2);
ctx.scale(1, -1);

const handle = document.querySelector("#handle");

let mainAngle = 1;
let mousedown = false;

function getSize() {
  return {
    extent: canvas.width / 2,
    radius: canvas.width / 4,
  };
}

function positionHandle(angle = 1) {
  const { extent, radius } = getSize();
  const c = canvas.getBoundingClientRect();
  const h = handle.getBoundingClientRect();
  const thisWidth = h.width / 2;
  const thisHeight = h.height / 2;

  const cX = c.left + c.width / 2;
  const cY = c.top + c.height / 2;

  const x = radius * Math.cos(angle);
  const y = -radius * Math.sin(angle);

  handle.style.left = x + cX - thisWidth + "px";
  handle.style.top = y + cY - thisHeight + "px";
}

function drawCircle() {
  const { extent, radius } = getSize();
  const sin = Math.sin(mainAngle);
  const cos = Math.cos(mainAngle);

  // circle
  ctx.fillStyle = "#E9E6E8";
  ctx.fillRect(-extent, -extent, canvas.width, canvas.height);
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.stroke();

  // axes
  ctx.beginPath();
  ctx.moveTo(-extent, 0);
  ctx.lineTo(extent, 0);
  ctx.moveTo(0, -extent);
  ctx.lineTo(0, extent);
  ctx.closePath();
  ctx.stroke();

  // sin and cos
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(radius * cos, radius * sin);
  ctx.lineTo(radius * cos, 0);
  ctx.closePath();
  ctx.stroke();

  // tangent
  const tan = sin / cos;
  const absTanX = Math.abs(cos) + Math.sqrt(tan ** 2 - sin ** 2);
  const tanX = cos >= 0 ? absTanX : -absTanX;
  ctx.beginPath();
  ctx.moveTo(radius * cos, radius * sin);
  ctx.lineTo(radius * tanX, 0);
  ctx.closePath();
  ctx.stroke();
}

function getAngleFromMouse(e) {
  if (!mousedown) return;
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  const cX = window.innerWidth / 2;
  const cY = window.innerHeight / 2;

  const x = mouseX - cX;
  const y = mouseY - cY;

  const boundedAngle = -Math.atan(y / x);
  const angle = x >= 0 ? boundedAngle : boundedAngle + Math.PI;

  positionHandle(angle);
  updateDetails(angle);
}

function updateDetails(angle) {
  mainAngle = angle < 0 ? angle + Math.PI * 2 : angle;
  const sin = Math.sin(mainAngle);
  const cos = Math.cos(mainAngle);
  const tan = Math.sin(mainAngle);
  const { radius } = getSize();
  drawCircle();

  // console.log(`sin: ${Math.sin(mainAngle)}\ncos: ${Math.cos(mainAngle)}\ntan: ${Math.tan(mainAngle)}`);
}

window.addEventListener("mousemove", getAngleFromMouse);
window.addEventListener("mouseup", putMouseUp);
handle.addEventListener("mousedown", putMouseDown);

function putMouseUp() {
  mousedown = false;
}

function putMouseDown() {
  mousedown = true;
}

positionHandle();
drawCircle();
