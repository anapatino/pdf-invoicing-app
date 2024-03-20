import { Router } from "express";
import { buildPDF } from "../lib/pdfkit.js";

const router = Router();

router.get("/invoice", (req, res) => {
  // Obtener datos del cliente y productos de la URL
  const cliente = {
    nombre: req.query.clienteNombre || "Cliente no especificado",
    direccion: req.query.clienteDireccion || "Dirección no especificada",
    telefono: req.query.clienteTelefono || "Teléfono no especificado",
  };

  const productos = JSON.parse(req.query.productos || "[]");

  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "inline; filename=invoice.pdf",
  });

  buildPDF(
    cliente,
    productos,
    (data) => stream.write(data),
    () => stream.end()
  );
});

export default router;
