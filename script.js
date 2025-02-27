"use strict";

const container = document.querySelector("#container");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.translate(canvas.width / 2, canvas.height / 2);
ctx.scale(1, -1);

const handle = document.querySelector("#handle");

let mainAngle = 1;
let mousedown = false;

const lblAngleRad = document.querySelector("#lblAngleRad");
const lblAngleDeg = document.querySelector("#lblAngleDeg");
const lblSin = document.querySelector("#lblSin");
const lblCos = document.querySelector("#lblCos");
const lblTan = document.querySelector("#lblTan");
const lblCsc = document.querySelector("#lblCsc");
const lblSec = document.querySelector("#lblSec");
const lblCot = document.querySelector("#lblCot");

function getSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(1, -1);
  return {
    biggest: Math.max(canvas.width, canvas.height),
    smallest: Math.min(canvas.width, canvas.height),
    widthExtent: canvas.width / 2,
    heightExtent: canvas.height / 2,
    radius: Math.min(canvas.width, canvas.height) / 4,
  };
}

function positionHandle(angle = mainAngle) {
  const { biggest, smallest, radius } = getSize();
  // const c = document.body.getBoundingClientRect();
  // const h = document.body.getBoundingClientRect();
  // const thisWidth = h.width / 2;
  // const thisHeight = h.height / 2;
  const handleRadius = handle.getBoundingClientRect().height / 2;

  const cX = window.innerWidth / 2;
  const cY = window.innerHeight / 2;

  const x = radius * Math.cos(angle);
  const y = -radius * Math.sin(angle);

  handle.style.left = x + cX - handleRadius + "px";
  handle.style.top = y + cY - handleRadius + "px";
}

function drawCircle() {
  const { biggest, smallest, widthExtent, heightExtent, radius } = getSize();
  const sin = Math.sin(mainAngle);
  const cos = Math.cos(mainAngle);
  const tan = sin / cos;

  const csc = 1 / sin;
  const sec = 1 / cos;
  const cot = 1 / tan;

  const cosAbs = cos / Math.abs(cos);
  const sinAbs = sin / Math.abs(sin);
  // const absTanX = Math.abs(cos) + Math.sqrt(tan ** 2 - sin ** 2);

  const cscY = Math.sqrt((radius * csc) ** 2 - radius ** 2) * sinAbs;
  const secX = Math.sqrt((radius * sec) ** 2 - radius ** 2) * cosAbs;

  // const tanX = cos >= 0 ? absTanX : -absTanX;

  const angleSolidRadius = Math.min(smallest / 10, 64);

  // Update main Labels
  lblAngleRad.textContent = mainAngle;
  lblAngleDeg.textContent = (mainAngle * 180) / Math.PI;
  lblSin.textContent = sin;
  lblCos.textContent = cos;
  lblTan.textContent = tan;
  lblCsc.textContent = csc;
  lblSec.textContent = sec;
  lblCot.textContent = cot;

  // background
  ctx.fillStyle = "#E9E6E8";
  ctx.fillRect(-widthExtent, -heightExtent, canvas.width, canvas.height);

  // border
  ctx.strokeStyle = "#D3CED1";
  ctx.beginPath();
  ctx.moveTo(-widthExtent, -radius);
  ctx.lineTo(widthExtent, -radius);
  ctx.moveTo(-widthExtent, radius);
  ctx.lineTo(widthExtent, radius);
  ctx.moveTo(-radius, -heightExtent);
  ctx.lineTo(-radius, heightExtent);
  ctx.moveTo(radius, -heightExtent);
  ctx.lineTo(radius, heightExtent);
  ctx.closePath();
  ctx.stroke();

  // circle
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.stroke();

  // angle solid
  ctx.fillStyle = "#FFB6C6";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, angleSolidRadius, 0, mainAngle);
  ctx.closePath();
  ctx.fill();

  // axes
  ctx.beginPath();
  ctx.moveTo(-widthExtent, 0);
  ctx.lineTo(widthExtent, 0);
  ctx.moveTo(0, -heightExtent);
  ctx.lineTo(0, heightExtent);
  ctx.closePath();
  ctx.stroke();

  // angle line to tan
  // ctx.strokeStyle = "#D3CED1";
  // ctx.beginPath();
  // ctx.moveTo(radius * cos, radius * sin);
  // ctx.lineTo(radius * cosAbs, Math.abs(radius * tan) * sinAbs);
  // ctx.lineTo(Math.abs(radius * cot) * cosAbs, radius * sinAbs);
  // ctx.closePath();
  // ctx.stroke();

  // angle to tan
  ctx.strokeStyle = "#D3CED1";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(radius, radius * tan);
  ctx.closePath();
  ctx.stroke();

  //angle to cot
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(radius * cot, radius);
  ctx.closePath();
  ctx.stroke();

  // main angle line
  ctx.strokeStyle = "#220919";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(radius * cos, radius * sin);
  ctx.closePath();
  ctx.stroke();

  // // sec and csc

  // ctx.strokeStyle = "#EEA243";
  // ctx.beginPath();
  // ctx.moveTo(radius * cos, radius * sin + 1);
  // ctx.lineTo(radius * cosAbs, cscY + 1);
  // ctx.closePath();
  // ctx.stroke();

  // ctx.strokeStyle = "#5E239D";
  // ctx.beginPath();
  // ctx.moveTo(radius * cos, radius * sin - 1);
  // ctx.lineTo(secX, sinAbs * radius - 1);
  // ctx.closePath();
  // ctx.stroke();

  // sec
  ctx.strokeStyle = "#5E239D";
  ctx.beginPath();
  ctx.moveTo(0, -5);
  ctx.lineTo(radius * sec, -5);
  ctx.closePath();
  ctx.stroke();

  // csc
  ctx.strokeStyle = "#5E239D";
  ctx.beginPath();
  ctx.moveTo(-5, 0);
  ctx.lineTo(-5, radius * csc);
  ctx.closePath();
  ctx.stroke();

  // cosine
  ctx.strokeStyle = "#FF4870";
  ctx.beginPath();
  ctx.moveTo(0, radius * sin);
  ctx.lineTo(radius * cos, radius * sin);
  ctx.closePath();
  ctx.stroke();

  // sine
  ctx.strokeStyle = "#76B041";
  ctx.beginPath();
  ctx.moveTo(radius * cos, 0);
  ctx.lineTo(radius * cos, radius * sin);
  ctx.closePath();
  ctx.stroke();

  // tangent
  // ctx.strokeStyle = "#FF66B3";
  // ctx.beginPath();
  // ctx.moveTo(radius * cos, radius * sin);
  // ctx.lineTo(radius * tanX, 0);
  // ctx.closePath();
  // ctx.stroke();

  // tangent line
  ctx.strokeStyle = "#02A9EA";
  ctx.beginPath();
  ctx.moveTo(0, csc * radius);
  ctx.lineTo(sec * radius, 0);
  ctx.closePath();
  ctx.stroke();

  // tangent length
  // ctx.strokeStyle = "#EEA243";
  // ctx.beginPath();
  // ctx.moveTo(radius * cosAbs, 0);
  // ctx.lineTo(radius * cosAbs, Math.abs(tan * radius) * sinAbs);
  // ctx.closePath();
  // ctx.stroke();

  // tangent length
  ctx.strokeStyle = "#EEA243";
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(radius, radius * tan);
  ctx.closePath();
  ctx.stroke();

  // cotan length
  // ctx.strokeStyle = "#EEA243";
  // ctx.beginPath();
  // ctx.moveTo(0, radius * sinAbs);
  // ctx.lineTo(Math.abs(cot * radius) * cosAbs, radius * sinAbs);
  // ctx.closePath();
  // ctx.stroke();

  // cotan length
  ctx.strokeStyle = "#EEA243";
  ctx.beginPath();
  ctx.moveTo(0, radius);
  ctx.lineTo(radius * cot, radius);
  ctx.closePath();
  ctx.stroke();

  // update text labels
  ctx.fillStyle = "#220919";
  ctx.strokeStyle = "#E9E6E8";
  ctx.lineWidth = 4;
  ctx.font = "1.8rem serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  ctx.save();
  ctx.scale(1, -1);
  ctx.translate((radius * cos) / 2, -radius * sin);
  ctx.strokeText(`cos ≈ ${roundNumber(cos)}`, 0, 0);
  ctx.fillText(`cos ≈ ${roundNumber(cos)}`, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.scale(1, -1);
  ctx.translate(radius * cos, (-radius * sin) / 2);
  ctx.rotate(Math.PI / 2);
  ctx.strokeText(`sin ≈ ${roundNumber(sin)}`, 0, 0);
  ctx.fillText(`sin ≈ ${roundNumber(sin)}`, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.scale(1, -1);
  const secLblX = Math.max(Math.min((sec * radius) / 2, widthExtent - 60), -widthExtent + 60);
  ctx.translate(secLblX, 12);
  ctx.strokeText(`sec  ≈ ${roundNumber(sec)}`, 0, 0);
  ctx.fillText(`sec  ≈ ${roundNumber(sec)}`, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.scale(1, -1);
  const cscLblY = Math.max(Math.min((csc * radius) / 2, heightExtent - 60), -heightExtent + 60);
  ctx.translate(-12, -cscLblY);
  ctx.rotate((-cosAbs * Math.PI) / 2);
  ctx.strokeText(`csc ≈ ${roundNumber(csc)}`, 0, 0);
  ctx.fillText(`csc ≈ ${roundNumber(csc)}`, 0, 0);
  ctx.restore();

  // ctx.save();
  // ctx.scale(1, -1);
  // const tanLblY = Math.max(Math.min((-cosAbs * radius * tan) / 2, heightExtent - 60), -heightExtent + 60);
  // ctx.translate((radius + 12) * cosAbs, tanLblY);
  // ctx.rotate((cosAbs * Math.PI) / 2);
  // ctx.strokeText(`tan ≈ ${roundNumber(tan)}`, 0, 0);
  // ctx.fillText(`tan ≈ ${roundNumber(tan)}`, 0, 0);
  // ctx.restore();

  ctx.save();
  ctx.scale(1, -1);
  const tanLblY = Math.min(Math.max((radius * -tan) / 2, -heightExtent + 60), heightExtent - 60);
  ctx.translate(radius + 12, tanLblY);
  ctx.rotate(Math.PI / 2);
  ctx.strokeText(`tan ≈ ${roundNumber(tan)}`, 0, 0);
  ctx.fillText(`tan ≈ ${roundNumber(tan)}`, 0, 0);
  ctx.restore();

  // ctx.save();
  // ctx.scale(1, -1);
  // const cotLblX = Math.max(Math.min((cosAbs * Math.abs(radius * cot)) / 2, widthExtent - 60), -widthExtent + 60);
  // ctx.strokeText(`cot ≈ ${roundNumber(cot)}`, cotLblX, (radius + 12) * -sinAbs);
  // ctx.fillText(`cot ≈ ${roundNumber(cot)}`, cotLblX, (radius + 12) * -sinAbs);
  // ctx.restore();

  ctx.save();
  ctx.scale(1, -1);
  const cotLblX = Math.max(Math.min((radius * cot) / 2, widthExtent - 60), -widthExtent + 60);
  ctx.strokeText(`cot ≈ ${roundNumber(cot)}`, cotLblX, -radius - 10);
  ctx.fillText(`cot ≈ ${roundNumber(cot)}`, cotLblX, -radius - 10);
  ctx.restore();
}

function roundNumber(num) {
  const multiplied = num * 1000;
  const rounded = Math.round(multiplied);
  const divided = rounded / 1000;
  return divided;
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

function updateCircle() {
  setTimeout(() => drawCircle(), 1);
  positionHandle(mainAngle);
}

window.addEventListener("mousemove", getAngleFromMouse);
window.addEventListener("mouseup", putMouseUp);
handle.addEventListener("mousedown", putMouseDown);
window.addEventListener("resize", updateCircle);

function putMouseUp() {
  mousedown = false;
}

function putMouseDown() {
  mousedown = true;
}

positionHandle();
drawCircle();
