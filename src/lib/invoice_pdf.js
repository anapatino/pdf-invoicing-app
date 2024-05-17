import PDFDocument from "pdfkit";
const customFont = "src/lib/fonts/VarelaRound-Regular.ttf";

function addHeader(doc, quotation, fecha) {
  doc.font(customFont);
  doc.fontSize(20).text("DmSolumax", 50, 50);
  doc.fontSize(15).text("Facturación", 50, 90);
  doc.fontSize(12).text("Fecha:", 50, 110);
  doc.fontSize(12).text("Nombre:", 50, 130);
  doc.fontSize(12).text("Direccion:", 50, 150);
  doc.fontSize(12).text("Telefono:", 50, 170);

  doc.fontSize(12).text(fecha, 130, 110);
  doc.fontSize(12).text(quotation.name, 130, 130);
  doc.fontSize(12).text(quotation.address, 130, 150);
  doc.fontSize(12).text(quotation.phone, 130, 170);
}
function addMaterialTable(doc, materials) {
  doc.fontSize(10).text("Descripción", 50, 200);
  doc.fontSize(10).text("Cant.", 140, 200, { width: 60, align: "right" });
  doc.fontSize(10).text("Uni.", 180, 200, { width: 80, align: "right" });
  doc.fontSize(10).text("Subtotal", 260, 200, { width: 80, align: "right" });
  doc.fontSize(10).text("Med.", 370, 200);
  doc.fontSize(10).text("Val. m²", 390, 200, { width: 70, align: "right" });
  doc.fontSize(10).text("%", 420, 200, { width: 80, align: "right" });
  doc.fontSize(10).text("Total", 510, 200, { width: 60, align: "right" });
  doc.moveTo(50, 220).lineTo(580, 220).stroke();

  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength - 3) + "...";
    } else {
      return str;
    }
  }


  let subtotal = 0;
  materials.forEach((material, index) => {
    const truncatedName = truncateString(material.name, 45);
    doc
      .fontSize(10)
      .text(truncatedName, 50, 230 + 30 * index, { width: 130, align: "left" });
    doc
      .fontSize(10)
      .text(material.quantity, 183, 230 + 30 * index, { align: "left" });
    doc
      .fontSize(10)
      .text(material.purchasePrice, 230, 230 + 30 * index, { align: "left" });
    let subTotalMaterial = 0;
    if (material.purchasePrice != null && material.quantity !== "") {
      subTotalMaterial = material.purchasePrice * material.quantity;
      doc.fontSize(10).text(subTotalMaterial, 300, 230 + 30 * index, {
        align: "left",
      });
    }
    let discountAmount = 0;
    if (material.discount != null && material.discount !== "") {
      const discount = parseFloat(material.discount);
      discountAmount = subTotalMaterial * discount;
      doc
        .fontSize(10)
        .text(material.discount * 100 + "%", 493, 230 + 30 * index, {
          align: "left",
        });
    }

    const materialTotal = subTotalMaterial - discountAmount;
    subtotal += materialTotal;
    doc.fontSize(10).text(Math.round(materialTotal), 540, 230 + 30 * index, {
      align: "left",
    });
  });

  return subtotal;
}

function addServiceTable(doc, customizedServices, startIndex) {
  let subtotal = 0;
  customizedServices.forEach((service, index) => {
    doc.fontSize(10).text(service.name, 50, 230 + 30 * (startIndex + index), {
      width: 130,
      align: "left",
    });
    doc
      .fontSize(10)
      .text(
        service.measures.height * service.measures.width + "m²",
        370,
        230 + 30 * (startIndex + index),
        { align: "left" }
      );
    doc.fontSize(10).text(service.price, 425, 230 + 30 * (startIndex + index), {
      align: "left",
    });

    doc
      .fontSize(10)
      .text(Math.round(service.total), 540, 230 + 30 * (startIndex + index), {
        align: "left",
      });
    subtotal += parseFloat(service.total);
  });
  return subtotal;
}

function addPaymentMethods(doc, methodOfPayment, servicesLength) {
  doc
    .fillColor("black")
    .fontSize(12)
    .text("Métodos de Pago", 80, 220 + 30 * (servicesLength + 1) + 170);

  const currentX = 80;
  const startY = 220 + 20 * (servicesLength + 1) + 265;
  const imageWidth = 70;
  const imageHeight = 70;
  const textY = 220 + 20 * (servicesLength + 1) + 265;

  const method = "bancolombia";
  const bancolombiaData = methodOfPayment.bancolombia;

  doc.image(`src/lib/images/${method}.jpeg`, currentX, startY, {
    fit: [imageWidth, imageHeight],
    align: "left",
  });

  doc
    .fillColor("black")
    .fontSize(12)
    .text(method + ":", currentX + 70, textY);

  if (typeof methodOfPayment.bancolombia === "object") {
    doc
      .fontSize(10)
      .text(`Cuenta ${bancolombiaData.account}`, currentX + 70, textY + 15)
      .text(`${bancolombiaData.number}`, currentX + 70, textY + 30)
      .text(`${bancolombiaData.name}`, currentX + 70, textY + 45)
      .text(`${bancolombiaData.cc}`, currentX + 70, textY + 55);
  }
}
function addSummary(doc, subtotal, servicesLength, methodOfPayment) {
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  doc.fontSize(12).text("Subtotal", 400, 220 + 30 * (servicesLength + 1) + 20);
  doc
    .fontSize(12)
    .text(Math.round(subtotal), 480, 220 + 30 * (servicesLength + 1) + 20);
  doc.fontSize(12).text("Iva", 400, 220 + 30 * (servicesLength + 1) + 40);
  doc
    .fontSize(12)
    .text(Math.round(iva), 480, 220 + 30 * (servicesLength + 1) + 40);
  doc
    .fillColor("#4F6DF5")
    .fontSize(12)
    .text("TOTAL", 400, 220 + 30 * (servicesLength + 1) + 60);
  doc
    .fillColor("#4F6DF5")
    .fontSize(12)
    .text(Math.round(total), 480, 220 + 30 * (servicesLength + 1) + 60);

  addPaymentMethods(doc, methodOfPayment, servicesLength);
}

export function buildPDF(
  quotation,
  methodOfPayment,
  dataCallback,
  endCallback
) {
  const doc = new PDFDocument();
  const fecha = new Date().toLocaleDateString();

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  doc.image("src/lib/images/logo_invoice.png", 480, 60, {
    fit: [95, 95],
    align: "left",
  });

  addHeader(doc, quotation, fecha);

  const materialSubtotal = addMaterialTable(doc, quotation.materials);
  const serviceSubtotal = addServiceTable(
    doc,
    quotation.customizedServices,
    quotation.materials.length
  );
  const totalSubtotal = materialSubtotal + serviceSubtotal;

  addSummary(doc, totalSubtotal, 6, methodOfPayment); /**/

  doc.end();
}
