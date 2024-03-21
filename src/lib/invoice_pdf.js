import PDFDocument from "pdfkit";
const customFont = "src/lib/fonts/VarelaRound-Regular.ttf";

function addHeader(doc, user, fecha) {
  doc.font(customFont);
  doc.fontSize(20).text("FERRENERGY", 80, 50);
  doc.fontSize(15).text("Facturación", 80, 90);
  doc.fontSize(12).text("Fecha:", 80, 110);
  doc.fontSize(12).text("Nombre:", 80, 130);
  doc.fontSize(12).text("Direccion:", 80, 150);
  doc.fontSize(12).text("Telefono:", 80, 170);

  doc.fontSize(12).text(fecha, 160, 110);
  doc.fontSize(12).text(user.name, 160, 130);
  doc.fontSize(12).text(user.address, 160, 150);
  doc.fontSize(12).text(user.phone, 160, 170);
}

function addMaterialTable(doc, materials) {
  doc.fontSize(12).text("Descripción", 80, 200);
  doc.fontSize(12).text("Cantidad", 250, 200);
  doc.fontSize(12).text("Descuento", 370, 200);
  doc.fontSize(12).text("Total", 480, 200);
  doc.moveTo(80, 220).lineTo(530, 220).stroke();

  let subtotal = 0;
  materials.forEach((material, index) => {
    doc
      .fontSize(12)
      .text(material.name, 80, 230 + 30 * index, { align: "left" });
    doc
      .fontSize(12)
      .text(material.quantity, 250, 230 + 30 * index, { align: "left" });
    if (material.discount != null) {
      doc.fontSize(12).text(material.discount + "%", 370, 230 + 30 * index, {
        align: "left",
      });
    }
    const materialTotal = material.salePrice * material.quantity;
    subtotal += materialTotal;
    doc.fontSize(12).text(Math.round(materialTotal), 480, 230 + 30 * index, {
      align: "left",
    });
  });

  return subtotal;
}

function addServiceTable(doc, services, startIndex) {
  let subtotal = 0;
  services.forEach((service, index) => {
    doc.fontSize(12).text(service.name, 80, 230 + 30 * (startIndex + index), {
      align: "left",
    });
    doc
      .fontSize(12)
      .text(Math.round(service.price), 480, 230 + 30 * (startIndex + index), {
        align: "left",
      });
    subtotal += parseFloat(service.price);
  });
  return subtotal;
}

function addSummary(doc, subtotal, servicesLength) {
  const iva = subtotal * 0.15;
  const total = subtotal + iva;

  doc.fontSize(12).text("Subtotal", 340, 220 + 30 * (servicesLength + 1) + 20);
  doc
    .fontSize(12)
    .text(Math.round(subtotal), 480, 220 + 30 * (servicesLength + 1) + 20);
  doc.fontSize(12).text("Iva", 340, 220 + 30 * (servicesLength + 1) + 40);
  doc
    .fontSize(12)
    .text(Math.round(iva), 480, 220 + 30 * (servicesLength + 1) + 40);
  doc
    .fillColor("#4F6DF5")
    .fontSize(12)
    .text("TOTAL", 340, 220 + 30 * (servicesLength + 1) + 60);
  doc
    .fillColor("#4F6DF5")
    .fontSize(12)
    .text(Math.round(total), 480, 220 + 30 * (servicesLength + 1) + 60);
}

export function buildPDF(user, quotation, dataCallback, endCallback) {
  const doc = new PDFDocument();
  const fecha = new Date().toLocaleDateString();

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  doc.image("src/lib/images/logo_invoice.png", 430, 60, {
    fit: [95, 95],
    align: "left",
  });

  addHeader(doc, user, fecha);

  const materialSubtotal = addMaterialTable(doc, quotation.materials);
  const serviceSubtotal = addServiceTable(
    doc,
    quotation.idService,
    quotation.materials.length
  );
  const totalSubtotal = materialSubtotal + serviceSubtotal;

  addSummary(
    doc,
    totalSubtotal,
    quotation.materials.length + quotation.idService.length
  );

  doc.end();
}