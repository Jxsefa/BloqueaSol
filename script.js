document.getElementById("usos").textContent = "12";
document.getElementById("uv").textContent = "7.3";
document.getElementById("piel").textContent = "Tipo III";
document.getElementById("bloqueador").textContent = "68%";

// Mostrar alerta si bloqueador es bajo
if (parseInt("68") < 20) {
  document.getElementById("alerta").classList.remove("d-none");
}

// Gráfico de bloqueador restante
const ctx = document.getElementById('graficaPiel').getContext('2d');
new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Disponible', 'Consumido'],
    datasets: [{
      label: 'Bloqueador',
      data: [68, 32],
      backgroundColor: ['#f1c40f', '#e0e0e0'],
      borderWidth: 1
    }]
  },
  options: {
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});
async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('token', data.token);

    // Mostrar dashboard y ocultar login
    document.getElementById('login').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';

    // Cargar datos iniciales
    actualizarDashboard();
    setInterval(actualizarDashboard, 5000);

  } else {
    document.getElementById('loginError').textContent = 'Usuario o contraseña incorrectos.';
  }
}

async function actualizarDashboard() {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:3000/api/v1/mediciones/last', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  if (response.ok) {
    const data = await response.json();

    document.getElementById("usos").textContent = data.usos_hoy;
    document.getElementById("uv").textContent = data.promedio_uv;
    document.getElementById("piel").textContent = data.tipo_piel;
    document.getElementById("bloqueador").textContent = data.bloqueador_restante + "%";
    document.getElementById("dispositivo-id").textContent = data.dispositivo_id;


    // Opcional: alerta si bloqueador < 20%
    if (data.bloqueador_restante < 20) {
      document.getElementById('alerta').classList.remove('d-none');
    } else {
      document.getElementById('alerta').classList.add('d-none');
    }

  } else {
    console.error('Error al obtener datos del dashboard');
  }
}

