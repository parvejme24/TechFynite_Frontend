import React, { useState, useMemo } from "react";
import { FiDownload, FiDollarSign } from "react-icons/fi";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

// Time period filter options
const timePeriods = [
  { label: 'Last 3 Months', value: '3m' },
  { label: 'Last 6 Months', value: '6m' },
  { label: 'Last Year', value: '1y' },
  { label: 'Last 2 Years', value: '2y' },
  { label: 'All Time', value: 'all' },
];

// Sample data for multiple years
const yearlyData = {
  '2023': [45, 52, 38, 45, 58, 62, 55, 48, 52, 58, 62, 65],
  '2022': [35, 42, 28, 35, 48, 52, 45, 38, 42, 48, 52, 55],
  '2021': [25, 32, 18, 25, 38, 42, 35, 28, 32, 38, 42, 45],
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
        weight: 'bold' as const,
      },
      bodyFont: {
        size: 13,
      },
      callbacks: {
        label: function(context: any) {
          return `${context.label}: $${context.raw}K`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        callback: function(value: any) {
          return `$${value}K`;
        }
      }
    },
    x: {
      grid: {
        display: false,
      }
    }
  },
  animation: {
    duration: 1000,
    easing: 'easeOutQuart' as const,
  }
};

const RevenueChart: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2023');

  const handleExportRevenue = () => {
    const headers = ['Month', 'Revenue (K$)'];
    const rows = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => [
      month,
      yearlyData[selectedYear as keyof typeof yearlyData][index]
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `revenue_data_${selectedYear}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = useMemo(() => {
    const data = yearlyData[selectedYear as keyof typeof yearlyData];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let filteredMonths = months;
    let filteredValues = data;

    switch (selectedPeriod) {
      case '3m':
        filteredMonths = months.slice(-3);
        filteredValues = data.slice(-3);
        break;
      case '6m':
        filteredMonths = months.slice(-6);
        filteredValues = data.slice(-6);
        break;
      case '1y':
        // Already showing full year
        break;
      case '2y':
        // This would require data from multiple years
        break;
      case 'all':
        // Already showing full year
        break;
    }

    return {
      labels: filteredMonths,
      datasets: [{
        label: 'Revenue (in thousands)',
        data: filteredValues,
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
          'rgba(255, 99, 255, 0.8)',
          'rgba(99, 255, 132, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(54, 162, 235, 0.8)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
          'rgba(255, 99, 255, 1)',
          'rgba(99, 255, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 2,
        borderRadius: 10,
      }]
    };
  }, [selectedPeriod, selectedYear]);

  const totalRevenue = useMemo(() => {
    const data = yearlyData[selectedYear as keyof typeof yearlyData];
    return data.reduce((a, b) => a + b, 0);
  }, [selectedYear]);

  return (
    <div className="bg-white dark:bg-[#1A1D37] rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Revenue Distribution
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total Revenue: ${totalRevenue}K
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportRevenue}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            title="Export Data"
          >
            <FiDownload className="w-5 h-5" />
          </button>
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <FiDollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-[#1A1D37] border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.keys(yearlyData).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-[#1A1D37] border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {timePeriods.map((period) => (
            <option key={period.value} value={period.value}>
              {period.label}
            </option>
          ))}
        </select>
      </div>
      <div className="h-[300px]">
        <Bar data={filteredData} options={barChartOptions} />
      </div>
    </div>
  );
};

export default RevenueChart;