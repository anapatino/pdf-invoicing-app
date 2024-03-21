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

  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=invoice.pdf",
  });

  buildPDF(
    user,
    quotation,
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
