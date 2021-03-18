function iniciarLotus() {
  camadaCopia.clear();
  centroLotus = {
    x: width / 2,
    y: height / 2,
  };
}

let centroLotus;

let curva = {
  x: 100,
  y: 50,
};

let angulo = 0;

function lotus() {
  camadaCopia.noFill();
  camadaCopia.strokeWeight(6);
  camadaCopia.stroke(random(100, 255), random(100), random(150), 100);

  petalaX = dist(mouseX, mouseY, centroLotus.x, centroLotus.y);

  calcularRotacao();

  camadaCopia.push();
  camadaCopia.translate(centroLotus.x, centroLotus.y);
  camadaCopia.rotate(angulo);
  //pétala seguindo o mouse
  camadaCopia.beginShape();
  camadaCopia.curveVertex(petalaX, 0);
  camadaCopia.curveVertex(petalaX, 0);
  camadaCopia.curveVertex(curva.x, -curva.y);
  camadaCopia.curveVertex(10, 0);
  camadaCopia.curveVertex(curva.x, curva.y);
  camadaCopia.curveVertex(petalaX, 0);
  camadaCopia.curveVertex(petalaX, 0);
  camadaCopia.endShape();
  camadaCopia.pop();
  camadaCopia.push();
  camadaCopia.translate(centroLotus.x, centroLotus.y);
  camadaCopia.rotate(-angulo);
  // pétala invertida
  camadaCopia.beginShape();
  camadaCopia.curveVertex(-petalaX, 0);
  camadaCopia.curveVertex(-petalaX, 0);
  camadaCopia.curveVertex(-curva.x, curva.y);
  camadaCopia.curveVertex(-10, 0);
  camadaCopia.curveVertex(-curva.x, -curva.y);
  camadaCopia.curveVertex(-petalaX, 0);
  camadaCopia.curveVertex(-petalaX, 0);
  camadaCopia.endShape();
  camadaCopia.pop();
}

function mouseClicked() {
  centroLotus = {
    x: mouseX,
    y: mouseY,
  };
}

function calcularRotacao() {
  angulo = atan2(mouseY - centroLotus.y, mouseX - centroLotus.x);
}
