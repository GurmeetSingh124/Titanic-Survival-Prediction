const form = document.querySelector('#predict-form');
const message = document.querySelector('#form-message');

function drawBars(containerId, rows) {
  const node = document.getElementById(containerId);
  node.innerHTML = rows.map(row => `<div class="bar-item"><b>${row.rate}%</b><i style="height:${Math.max(row.rate, 4)}%"></i><span>${row.label}</span></div>`).join('');
}

function drawAges(rows) {
  document.getElementById('age-chart').innerHTML = rows.map(row => `<div class="age-item" title="${row.label}: ${row.rate}%"><i style="height:${Math.max(row.rate, 4)}%"></i><span>${row.label}</span></div>`).join('');
}

async function loadStats() {
  try {
    const response = await fetch('/api/stats');
    if (!response.ok) throw new Error('Could not load dataset insights.');
    const data = await response.json();
    document.getElementById('passenger-count').textContent = data.passengers.toLocaleString();
    document.getElementById('survival-rate').textContent = `${data.survival_rate}%`;
    document.querySelector('.stats-strip > div:last-child small').textContent = `${data.missing_age} age values missing`;
    drawBars('class-chart', data.by_class);
    drawBars('sex-chart', data.by_sex);
    drawAges(data.by_age);
  } catch (error) {
    message.textContent = error.message;
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = '';
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.querySelector('.button-label').textContent = 'Calculating…';
  const data = Object.fromEntries(new FormData(form).entries());
  for (const key of ['pclass', 'age', 'family_size', 'fare']) data[key] = Number(data[key]);
  try {
    const response = await fetch('/api/predict', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.detail?.[0]?.msg || 'Prediction failed. Check the passenger details.');
    const probability = result.survival_probability;
    document.getElementById('score').textContent = `${probability}%`;
    document.getElementById('gauge').style.setProperty('--score', probability);
    document.getElementById('outcome').textContent = result.outcome;
    document.getElementById('outcome').style.color = probability >= 50 ? '#278070' : '#c96c5c';
    document.getElementById('result-note').textContent = `${probability >= 50 ? 'This profile has a higher' : 'This profile has a lower'} estimated survival likelihood in the model.`;
    document.getElementById('result-subtitle').textContent = `Updated for ${data.sex === 'female' ? 'a female' : 'a male'} passenger in ${data.pclass}${data.pclass === 1 ? 'st' : data.pclass === 2 ? 'nd' : 'rd'} class.`;
    document.getElementById('result-card')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) {
    message.textContent = error.message;
  } finally {
    button.disabled = false;
    button.querySelector('.button-label').textContent = 'Run prediction';
  }
});

loadStats();
form.requestSubmit();
