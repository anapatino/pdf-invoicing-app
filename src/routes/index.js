import { Router } from "express";
import { buildPDF } from "../lib/invoice_pdf.js";

const router = Router();

router.get("/invoice", (req, res) => {
  const user = {
    name: req.query.name || "Cliente no especificado",
    address: req.query.address || "Dirección no especificada",
    phone: req.query.phone || "Teléfono no especificado",
  };

  const quotationData = JSON.parse(req.query.quotation || "{}");
  const methodOfPaymentData = JSON.parse(req.query.methodOfPayment || "{}");

  const quotation = {
    id: quotationData.id || "",
    name: quotationData.name || "",
    description: quotationData.description || "",
    idService: quotationData.idService || [],
    materials: quotationData.materials || [],
    length: quotationData.length || "",
    status: quotationData.status || "",
    total: quotationData.total || "",
    width: quotationData.width || "",
    userId: quotationData.userId || "",
  };

  let methodOfPayment;
  if (methodOfPaymentData.bancolombia) {
    methodOfPayment = {
      nequi: methodOfPaymentData.nequi || "",
      daviplata: methodOfPaymentData.daviplata || "",
      bancolombia: methodOfPaymentData.bancolombia,
    };
  } else {
    methodOfPayment = {
      nequi: methodOfPaymentData.nequi || "",
      daviplata: methodOfPaymentData.daviplata || "",
      bancolombia: "",
    };
  }
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "inline; filename=invoice.pdf",
  });
  //    "Content-Disposition": "attachment; filename=invoice.pdf",

  buildPDF(
    user,
    quotation,
    methodOfPayment,
    (data) => stream.write(data),
    () => stream.end()
  );
});

export default router;

/*
  const quotation = {
    id: quotationData.id || "",
    name: quotationData.name || "",
    description: quotationData.description || "",
    idService: quotationData.idService || [],
    length: quotationData.length || "",
    status: quotationData.status || "",
      materials: quotationData.materials || [],
    total: quotationData.total || "",
    width: quotationData.width || "",
    userId: quotationData.userId || "",
  };
*/
