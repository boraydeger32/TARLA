/**
 * Registers the chart Alpine data factories (lineChart, pieChart, barChart,
 * areaChart) on the provided Alpine instance. Called once during app boot.
 *
 * @module components/charts
 */

import { apexChart } from './apexFactory.js';

/**
 * @param {import('alpinejs').Alpine} Alpine
 */
export function registerChartFactories(Alpine) {
  Alpine.data('lineChart', (config) => apexChart('line', config));
  Alpine.data('areaChart', (config) => apexChart('area', config));
  Alpine.data('barChart', (config) => apexChart('bar', config));
  Alpine.data('pieChart', (config) => apexChart('pie', config));
}
