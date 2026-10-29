const dimensionSelect = document.getElementById('dimension');
const measureSelect = document.getElementById('measure');
let datasetStats;

const dimensionNames = {
  class: 'ticket class', sex: 'passenger sex', age: 'age group',
  embarked: 'embarkation town', family: 'family size'
};
const measureNames = {
  rate: ['Survival rate', 'Share of passengers in each group who survived.', '%'],
  passengers: ['Passenger count', 'Number of passenger records in each group.', 'passengers'],
  survived: ['Survived count', 'Number of records marked as survived in each group.', 'passengers'],
  not_survived: ['Did not survive count', 'Number of records marked as not survived in each group.', 'passengers']
};

function setLoadingError(error) {
  document.getElementById('explore-chart').innerHTML = `<p class="loading-state">${error}</p>`;
}

function updateChart() {
  if (!datasetStats) return;
  const dimension = dimensionSelect.value;
  const measure = measureSelect.value;
  const rows = datasetStats.groups[dimension] || [];
  const [title, description, unit] = measureNames[measure];
  document.getElementById('chart-title').textContent = `${title} by ${dimensionNames[dimension]}`;
  document.getElementById('chart-description').textContent = description;
  document.getElementById('table-title').textContent = `Passenger details by ${dimensionNames[dimension]}`;

  const maxValue = measure === 'rate' ? 100 : Math.max(...rows.map(row => row[measure]), 1);
  const ticks = measure === 'rate'
    ? ['100%', '75%', '50%', '25%', '0']
    : [maxValue.toLocaleString(), Math.round(maxValue * .75).toLocaleString(), Math.round(maxValue * .5).toLocaleString(), Math.round(maxValue * .25).toLocaleString(), '0'];
  document.getElementById('axis-labels').innerHTML = ticks.map(tick => `<span>${tick}</span>`).join('');

  const chart = document.getElementById('explore-chart');
  chart.innerHTML = rows.map(row => {
    const rawValue = Number(row[measure]) || 0;
    const height = Math.max(1.5, rawValue / maxValue * 100);
    const displayValue = measure === 'rate' ? `${rawValue.toFixed(1)}%` : rawValue.toLocaleString();
    const detail = `${row.label}: ${displayValue}${measure === 'rate' ? '' : ` passengers`}; ${row.passengers} records total`;
    return `<div class="plot-col" tabindex="0" title="${detail}" aria-label="${detail}"><span class="plot-value">${displayValue}</span><div class="plot-bar" style="height:${height}%"></div><span class="plot-label">${row.label}</span></div>`;
  }).join('');

  const ranked = [...rows].sort((a, b) => b[measure] - a[measure]);
  const top = ranked[0];
  document.getElementById('chart-insight').textContent = top
    ? measure === 'rate'
      ? `${top.label} has the highest observed survival rate here (${top.rate}%). This describes this dataset only.`
      : `${top.label} has the largest ${title.toLowerCase()} (${Number(top[measure]).toLocaleString()}). Group size affects counts.`
    : '';

  document.getElementById('group-table').innerHTML = rows.map(row => `<tr><td>${row.label}</td><td>${row.passengers.toLocaleString()}</td><td>${row.survived.toLocaleString()}</td><td>${row.not_survived.toLocaleString()}</td><td class="rate-cell">${row.rate.toFixed(1)}%</td></tr>`).join('');
}

function renderMissingValues(rows, passengerTotal) {
  const withMissing = rows.filter(row => row.missing > 0).sort((a, b) => b.missing - a.missing);
  document.getElementById('missing-bars').innerHTML = withMissing.map(row => {
    const completeness = 100 - row.percent;
    return `<div class="missing-row"><strong>${row.column || 'unnamed index'}</strong><span>${row.missing} / ${passengerTotal}</span><div class="missing-meter" title="${row.percent}% missing"><i style="width:${row.percent}%"></i></div></div>`;
  }).join('');
  const agePercent = (datasetStats.missing_age / passengerTotal * 100).toFixed(1);
  document.getElementById('age-missing-share').textContent = `${agePercent}%`;
}

async function initExplorer() {
  try {
    const response = await fetch('/api/stats');
    if (!response.ok) throw new Error('Dataset summary could not be loaded. Restart the server and refresh this page.');
    datasetStats = await response.json();
    document.getElementById('explore-total').textContent = datasetStats.passengers.toLocaleString();
    document.getElementById('explore-survived').textContent = datasetStats.survived.toLocaleString();
    document.getElementById('explore-not-survived').textContent = datasetStats.not_survived.toLocaleString();
    document.getElementById('explore-missing').textContent = datasetStats.missing_age.toLocaleString();
    document.getElementById('explore-survival-copy').textContent = `${datasetStats.survival_rate}% of all passengers`;
    renderMissingValues(datasetStats.missing_values, datasetStats.passengers);
    updateChart();
  } catch (error) {
    setLoadingError(error.message);
  }
}

dimensionSelect.addEventListener('change', updateChart);
measureSelect.addEventListener('change', updateChart);
document.getElementById('field-search').addEventListener('input', event => {
  const query = event.target.value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll('.dictionary-item').forEach(card => {
    const match = card.dataset.search.includes(query) || card.textContent.toLowerCase().includes(query);
    card.hidden = !match;
    if (match) visible++;
  });
  document.getElementById('no-fields').hidden = visible > 0;
});

initExplorer();
