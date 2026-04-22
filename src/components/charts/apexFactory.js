/**
 * Shared ApexCharts Alpine factory builder.
 * Creates an Alpine data object that renders the chart into `$refs.chartContainer`
 * on init and destroys it on component teardown.
 *
 * Charts react to theme (`$store.theme?.mode`) by re-rendering with appropriate
 * foreground colors when Alpine detects a reactive read.
 *
 * @module components/charts/apexFactory
 */

import ApexCharts from 'apexcharts';

const BASE_OPTIONS = Object.freeze({
  chart: {
    height: 300,
    fontFamily: 'Inter, system-ui, sans-serif',
    toolbar: { show: false },
    animations: { enabled: true, speed: 400 },
    background: 'transparent',
  },
  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 4,
    padding: { left: 12, right: 12 },
  },
  tooltip: {
    theme: 'light',
    style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' },
  },
  legend: {
    position: 'bottom',
    fontFamily: 'Inter, sans-serif',
    labels: { colors: '#4b5563' },
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
});

function deepMerge(a, b) {
  if (Array.isArray(b)) return b.slice();
  if (b && typeof b === 'object') {
    const out = { ...(a ?? {}) };
    for (const [k, v] of Object.entries(b)) {
      out[k] = deepMerge(a?.[k], v);
    }
    return out;
  }
  return b;
}

/**
 * @param {'line'|'area'|'bar'|'pie'} type
 * @param {object} userConfig - { series, xaxis, labels, colors, ... }
 */
export function apexChart(type, userConfig) {
  return {
    _chart: null,
    init() {
      const merged = deepMerge(BASE_OPTIONS, {
        chart: { type },
        ...userConfig,
      });
      this._chart = new ApexCharts(this.$refs.chartContainer, merged);
      this._chart.render();
    },
    destroy() {
      this._chart?.destroy();
      this._chart = null;
    },
  };
}
