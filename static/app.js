const form = document.querySelector('#predict-form');
const message = document.querySelector('#form-message');

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

async function loadProjectStats() {
  try {
    const response = await fetch('/api/stats');
    if (!response.ok) throw new Error('Dataset summary is unavailable.');
    const data = await response.json();

    setText('hero-passengers', data.passengers.toLocaleString());
    setText('passenger-record-count', data.passengers.toLocaleString());
    setText('hero-features', data.features_used);

    const classRates = { 1: 'class-rate-1', 2: 'class-rate-2', 3: 'class-rate-3' };
    for (const row of data.groups.class) {
      const classNumber = Number(row.label[0]);
      if (classRates[classNumber]) setText(classRates[classNumber], `${row.rate}%`);
    }

    const women = data.groups.sex.find(row => row.label === 'Women');
    if (women) setText('women-rate', `${women.rate}%`);
  } catch (error) {
    if (message) {
      message.textContent = error.message;
      message.classList.add('show');
    }
  }
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.textContent = '';
    message.classList.remove('show');

    const button = form.querySelector('button[type="submit"]');
    const buttonLabel = button.querySelector('.button-label');
    button.disabled = true;
    buttonLabel.textContent = 'Calculating…';

    const passenger = Object.fromEntries(new FormData(form).entries());
    for (const key of ['pclass', 'age', 'family_size', 'fare']) {
      passenger[key] = Number(passenger[key]);
    }

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passenger),
      });
      const result = await response.json();

      if (!response.ok) {
        const detail = Array.isArray(result.detail) ? result.detail[0]?.msg : result.detail;
        throw new Error(detail || 'Prediction failed. Check the passenger details.');
      }

      setText('score', `${result.survival_probability}%`);
      setText('outcome', result.outcome);
      setText('result-note', result.note);
      const probability = Math.max(0, Math.min(100, Number(result.survival_probability) || 0));
      const gauge = document.getElementById('result-gauge');
      if (gauge) {
        gauge.style.setProperty('--score-angle', `${probability * 3.6}deg`);
        gauge.setAttribute('aria-label', `Estimated survival probability: ${probability}%`);
      }
      document.getElementById('prediction-result')?.classList.add('has-result');
    } catch (error) {
      message.textContent = error.message;
      message.classList.add('show');
    } finally {
      button.disabled = false;
      buttonLabel.textContent = 'Run prediction';
    }
  });
}

loadProjectStats();
