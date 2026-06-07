export function exportToExcel(ventas, gastos, inventario, filtersDescription) {
  // XML header for Excel 2003 XML spreadsheet
  let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Title>Informe Contable Panini</Title>
    <Created>${new Date().toISOString()}</Created>
  </DocumentProperties>
  <Styles>
    <Style ss:ID="Header">
      <Font ss:Bold="1" ss:Color="#FFFFFF" />
      <Interior ss:Color="#18181B" ss:Pattern="Solid" />
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" />
    </Style>
    <Style ss:ID="Currency">
      <NumberFormat ss:Format="$#,##0" />
    </Style>
    <Style ss:ID="Bold">
      <Font ss:Bold="1" />
    </Style>
  </Styles>
  `;

  // 1. Sheet: INGRESOS_VENTAS
  xml += `  <Worksheet ss:Name="INGRESOS_VENTAS">
    <Table>
      <Row>
        <Cell ss:StyleID="Header"><Data ss:Type="String">ID Venta</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Fecha</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Cliente</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Método Pago</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Total Venta</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Utilidad Bruta</Data></Cell>
      </Row>
  `;
  ventas.forEach(v => {
    const fecha = v.fechaVenta ? new Date(v.fechaVenta).toLocaleString() : '';
    const clienteNombre = v.cliente ? `${v.cliente.nombre} (${v.cliente.telefono || ''})` : '';
    xml += `      <Row>
        <Cell><Data ss:Type="Number">${v.id}</Data></Cell>
        <Cell><Data ss:Type="String">${fecha}</Data></Cell>
        <Cell><Data ss:Type="String">${clienteNombre}</Data></Cell>
        <Cell><Data ss:Type="String">${v.metodoPago || ''}</Data></Cell>
        <Cell ss:StyleID="Currency"><Data ss:Type="Number">${v.totalVenta || 0}</Data></Cell>
        <Cell ss:StyleID="Currency"><Data ss:Type="Number">${v.utilidadBrutaTotal || 0}</Data></Cell>
      </Row>
    `;
  });
  xml += `    </Table>
  </Worksheet>
  `;

  // 2. Sheet: EGRESOS_GASTOS
  xml += `  <Worksheet ss:Name="EGRESOS_GASTOS">
    <Table>
      <Row>
        <Cell ss:StyleID="Header"><Data ss:Type="String">ID Gasto</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Fecha</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Descripción</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Categoría</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Lote / Inversionista</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Monto</Data></Cell>
      </Row>
  `;
  gastos.forEach(g => {
    const fecha = g.fechaGasto ? new Date(g.fechaGasto).toLocaleString() : '';
    const lote = g.loteInversionista ? g.loteInversionista.nombreLote : 'General / Sede';
    xml += `      <Row>
        <Cell><Data ss:Type="Number">${g.id}</Data></Cell>
        <Cell><Data ss:Type="String">${fecha}</Data></Cell>
        <Cell><Data ss:Type="String">${g.descripcion || ''}</Data></Cell>
        <Cell><Data ss:Type="String">${g.categoria || ''}</Data></Cell>
        <Cell><Data ss:Type="String">${lote}</Data></Cell>
        <Cell ss:StyleID="Currency"><Data ss:Type="Number">${g.monto || 0}</Data></Cell>
      </Row>
    `;
  });
  xml += `    </Table>
  </Worksheet>
  `;

  // 3. Sheet: INVENTARIO_VALORADO
  xml += `  <Worksheet ss:Name="INVENTARIO_VALORADO">
    <Table>
      <Row>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Producto</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Tipo de Stock</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Lote / Inversionista</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Stock Actual</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Costo de Compra (P/C/U)</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Valoración Total</Data></Cell>
      </Row>
  `;
  inventario.forEach(i => {
    const p = i.producto || {};
    const lote = i.loteInversionista ? i.loteInversionista.nombreLote : '';
    let stockStr = '';
    let costoStr = '';
    let valTotal = 0;

    if (p.tipo === 'FRACCIONADO_LAMINAS') {
      stockStr = `${i.cantActualPacas || 0} Pacas / ${i.cantActualCajas || 0} Cajas / ${i.cantActualUnidades || 0} Sobres`;
      costoStr = `Pacas: $${i.costoCompraPaca || 0} / Cajas: $${i.costoCompraCaja || 0} / Sobres: $${i.costoCompraUnidad || 0}`;
      valTotal = ((i.cantActualPacas || 0) * Number(i.costoCompraPaca || 0)) + 
                 ((i.cantActualCajas || 0) * Number(i.costoCompraCaja || 0)) + 
                 ((i.cantActualUnidades || 0) * Number(i.costoCompraUnidad || 0));
    } else if (p.tipo === 'FRACCIONADO_ALBUMES') {
      stockStr = `${i.cantActualCajas || 0} Cajas / ${i.cantActualUnidades || 0} Unidades`;
      costoStr = `Cajas: $${i.costoCompraCaja || 0} / Unidades: $${i.costoCompraUnidad || 0}`;
      valTotal = ((i.cantActualCajas || 0) * Number(i.costoCompraCaja || 0)) + 
                 ((i.cantActualUnidades || 0) * Number(i.costoCompraUnidad || 0));
    } else {
      stockStr = `${i.cantActualUnidades || 0} Unidades`;
      costoStr = `Unidades: $${i.costoCompraUnidad || 0}`;
      valTotal = (i.cantActualUnidades || 0) * Number(i.costoCompraUnidad || 0);
    }

    xml += `      <Row>
        <Cell><Data ss:Type="String">${p.nombre || ''}</Data></Cell>
        <Cell><Data ss:Type="String">${p.tipo || ''}</Data></Cell>
        <Cell><Data ss:Type="String">${lote}</Data></Cell>
        <Cell><Data ss:Type="String">${stockStr}</Data></Cell>
        <Cell><Data ss:Type="String">${costoStr}</Data></Cell>
        <Cell ss:StyleID="Currency"><Data ss:Type="Number">${valTotal}</Data></Cell>
      </Row>
    `;
  });
  xml += `    </Table>
  </Worksheet>
  `;

  xml += `</Workbook>`;

  // Create file Blob and download
  const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Informe_Contable_${filtersDescription}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
