function iniciarLotus() {
  camadaCopia.clear();
  centroLotus = {
    x: width / 2,
    y: height / 2,
  };
}

let centroLotus;

let curva = {
  eX: 100,
  eY: -70,
  dX: 100,
  dY: 70,
};

let angulo = 0;

function lotus() {
  camadaCopia.noStroke();
  // fill(random(100,255), random(100),random(150), 50);
  camadaCopia.noFill();
  camadaCopia.strokeWeight(15);
  camadaCopia.stroke(random(100, 255), random(100), random(150), 100);

  petalaX = dist(mouseX, mouseY, centroLotus.x, centroLotus.y);

  calcularRotacao();
  camadaCopia.push();
  camadaCopia.translate(centroLotus.x, centroLotus.y);
  camadaCopia.rotate(angulo);
  //pétala seguindo o mouse
  camadaCopia.beginShape();
  camadaCopia.curveVertex(0, 0);
  camadaCopia.curveVertex(0, 0);
  camadaCopia.curveVertex(petalaX / 2, curva.eY);
  camadaCopia.curveVertex(petalaX, 0);
  camadaCopia.curveVertex(petalaX, 0);
  camadaCopia.endShape();
  camadaCopia.beginShape();
  camadaCopia.curveVertex(0, 0);
  camadaCopia.curveVertex(0, 0);
  camadaCopia.curveVertex(petalaX / 2, curva.dY);
  camadaCopia.curveVertex(petalaX, 0);
  camadaCopia.curveVertex(petalaX, 0);
  camadaCopia.endShape();
  // pétala invertida
  camadaCopia.beginShape();
  camadaCopia.curveVertex(0, 0);
  camadaCopia.curveVertex(0, 0);
  camadaCopia.curveVertex(-curva.eX, -curva.eY);
  camadaCopia.curveVertex(-petalaX, 0);
  camadaCopia.curveVertex(-petalaX, 0);
  camadaCopia.endShape();
  camadaCopia.beginShape();
  camadaCopia.curveVertex(0, 0);
  camadaCopia.curveVertex(0, 0);
  camadaCopia.curveVertex(-curva.dX, -curva.dY);
  camadaCopia.curveVertex(-petalaX, 0);
  camadaCopia.curveVertex(-petalaX, 0);
  camadaCopia.endShape();
  camadaCopia.pop();
}

function mouseClicked() {
  // console.log("mouse foi clicado");
  centroLotus = {
    x: mouseX,
    y: mouseY,
  };
}

function calcularRotacao() {
  angulo = atan2(mouseY - centroLotus.y, mouseX - centroLotus.x);
}
