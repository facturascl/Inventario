import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const GOOGLE_SHEET_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQPJy4pyLaYkDz9aiHgsm8_8SUxaKtn6k6MrTYoGNygeeI1F3Bu9DNLkqFjRaxKig/pub?output=csv";

export default function App() {
  const [data, setData] = useState([]);
  const [filtros, setFiltros] = useState({ ubicacion: '', area: '' });

  useEffect(() => {
    Papa.parse(GOOGLE_SHEET_CSV, {
      download: true,
      header: true,
      complete: (res) => setData(res.data.filter(row => row.Item)), // Filtra filas vacías
    });
  }, []);

  const filtrados = data.filter(d =>
    (filtros.ubicacion === '' || d.Ubicación === filtros.ubicacion) &&
    (filtros.area === '' || d.Area === filtros.area)
  );

  const stats = {
    total: filtrados.length,
    valor: filtrados.reduce((acc, curr) => acc + (Number(curr['Precio aproximado']) || 0), 0)
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f4f4f9' }}>
      <h1>Panel de Inventario</h1>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <select onChange={e => setFiltros({ ...filtros, ubicacion: e.target.value })}>
          <option value="">Todas las Ubicaciones</option>
          {[...new Set(data.map(d => d.Ubicación))].map(u => <option key={u} value={u}>{u}</option>)}
        </select>

        <select onChange={e => setFiltros({ ...filtros, area: e.target.value })}>
          <option value="">Todas las Áreas</option>
          {[...new Set(data.map(d => d.Area))].map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* KPIs */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', flex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Total Items</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total}</p>
        </div>
        <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', flex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Valor Estimado</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${stats.valor.toLocaleString()}</p>
        </div>
      </div>

      {/* Gráfico */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filtrados}>
            <XAxis dataKey="Marca" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Precio aproximado" fill="#4f46e5" name="Precio" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}