const XLSX = require('xlsx');
const path = require('path');

// Función para obtener la lista de productos desde el archivo Excel
function obtenerListaDeProductos() {
  const filePath = path.join(__dirname, 'public', 'info.xlsx');
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(worksheet); // Retornar array de objetos
}

function guardarProductoEnExcel(nombreProducto, precio, modelo, caracteristicas) {
  const filePath = path.join(__dirname, 'public', 'info.xlsx');
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet);
  data.push({ Producto: nombreProducto, Precio: precio, Modelo: modelo, Características: caracteristicas });
  const newWorksheet = XLSX.utils.json_to_sheet(data);
  workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
  XLSX.writeFile(workbook, filePath);
}

function actualizarPrecioEnExcel(nombreProducto, nuevoPrecio) {
  const filePath = path.join(__dirname, 'public', 'info.xlsx');
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet);
  const producto = data.find(item => item.Producto === nombreProducto);
  if (producto) {
    producto.Precio = nuevoPrecio;
    const newWorksheet = XLSX.utils.json_to_sheet(data);
    workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
    XLSX.writeFile(workbook, filePath);
    return true;
  }
  return false;
}

function eliminarProductoEnExcel(nombreProducto) {
  const filePath = path.join(__dirname, 'public', 'info.xlsx');
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet);
  const nuevoData = data.filter(item => item.Producto !== nombreProducto);
  if (nuevoData.length === data.length) return false;
  const newWorksheet = XLSX.utils.json_to_sheet(nuevoData);
  workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
  XLSX.writeFile(workbook, filePath);
  return true;
}

module.exports = { obtenerListaDeProductos, guardarProductoEnExcel, actualizarPrecioEnExcel, eliminarProductoEnExcel };
