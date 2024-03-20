import PDFDocument from "pdfkit";

export function buildPDF(cliente, productos, dataCallback, endCallback) {
  const doc = new PDFDocument();

  const fecha = new Date().toLocaleDateString();
  const total = productos.reduce((a, b) => a + b.total, 0);
  const iva = total * 0.15;
  const subtotal = total - iva;

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  doc.image("src/lib/images/logo_invoice.png", 430, 60, {
    fit: [95, 95],
    align: "left",
  });
  // Encabezado
  doc.fontSize(20).text("FERRENERGY", 80, 50);
  doc.fontSize(15).text("Facturación", 80, 80);
  doc.fontSize(12).text("Fecha:", 80, 100);
  doc.fontSize(12).text("Nombre:", 80, 115);
  doc.fontSize(12).text("Direccion:", 80, 130);
  doc.fontSize(12).text("Telefono:", 80, 145);

  doc.fontSize(12).text(fecha, 160, 100);
  doc.fontSize(12).text(cliente.nombre, 160, 115);
  doc.fontSize(12).text(cliente.direccion, 160, 130);
  doc.fontSize(12).text(cliente.telefono, 160, 145);

  doc.fontSize(12).text("Descripción", 80, 200);
  doc.fontSize(12).text("Cantidad", 250, 200);
  doc.fontSize(12).text("Descuento", 370, 200);
  doc.fontSize(12).text("Total", 480, 200);

  doc.moveTo(80, 220).lineTo(530, 220).stroke();

  productos.forEach((producto, index) => {
    doc.fontSize(12).text(producto.descripcion, 80, 230 + 30 * index, {
      align: "left",
    });
    doc.fontSize(12).text(producto.cantidad, 270, 230 + 30 * index, {
      align: "left",
    });
    if (producto.descuento != null) {
      doc.fontSize(12).text(producto.descuento + "%", 390, 230 + 30 * index, {
        align: "left",
      });
    }

    doc.fontSize(12).text(producto.total, 480, 230 + 30 * index, {
      align: "left",
    });
  });
  doc
    .moveTo(80, 220 + 30 * productos.length + 10)
    .lineTo(530, 220 + 30 * productos.length + 10)
    .stroke();

  doc.fontSize(12).text("Subtotal", 340, 220 + 30 * productos.length + 20);
  doc.fontSize(12).text("30000", 480, 220 + 30 * productos.length + 20);
  doc.fontSize(12).text("Iva", 340, 220 + 30 * productos.length + 40);
  doc.fontSize(12).text("300", 480, 220 + 30 * productos.length + 40);

  doc.fontSize(12).text("TOTAL", 340, 220 + 30 * productos.length + 60);
  doc.fontSize(12).text("43000", 480, 220 + 30 * productos.length + 60);
  doc.end();
}
