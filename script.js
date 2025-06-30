async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('https://bloqueasol-1jcd.onrender.com/login', {
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

    document.getElementById('login').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';

    actualizarDashboard();
    setInterval(actualizarDashboard, 5000);
  } else {
    document.getElementById('loginError').textContent = 'Usuario o contraseña incorrectos.';
  }
}

let chart; // global para actualizarla

async function actualizarDashboard() {
  const token = localStorage.getItem('token');

  const response = await fetch('https://bloqueasol-1jcd.onrender.com/api/v1/mediciones/', {
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

    // Alerta por bloqueador bajo
    if (data.bloqueador_restante < 20) {
      document.getElementById('alerta').classList.remove('d-none');
    } else {
      document.getElementById('alerta').classList.add('d-none');
    }

    // Gráfico
    const restante = data.bloqueador_restante;
    const usado = 100 - restante;

    if (!chart) {
      const ctx = document.getElementById('graficaPiel').getContext('2d');
      chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Disponible', 'Consumido'],
          datasets: [{
            label: 'Bloqueador',
            data: [restante, usado],
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
    } else {
      chart.data.datasets[0].data = [restante, usado];
      chart.update();
    }

  } else {
    console.error('Error al obtener datos del dashboard');
  }
}
