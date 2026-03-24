require('dotenv').config();
const ai = require('./services/ai.service');

async function run() {
  const tests = [
    { name: 'Remeras por cantidad + presupuesto', msg: 'Quiero comprar remeras por cantidad, ¿cómo hago para pedir presupuesto?' },
    { name: 'Cómo pido presupuesto (simple)', msg: '¿Cómo pido presupuesto?' },
    { name: 'Consulta general - taza', msg: '¿Cuál es el precio de una taza?' },
  ];

  for (const t of tests) {
    console.log('---');
    console.log(t.name);
    try {
      const res = await ai.chat(t.msg);
      console.log('Reply:');
      console.log(res);
    } catch (err) {
      console.error('Error:', err.message || err);
    }
  }
}

run().catch(e => console.error(e));
