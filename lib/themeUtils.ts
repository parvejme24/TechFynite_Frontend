// Theme utility functions to ensure light mode is always default

export const ensureLightModeDefault = () => {
  if (typeof window !== 'undefined') {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // If no theme is saved or it's set to system, default to light
    if (!savedTheme || savedTheme === 'system') {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }
};

export const resetThemeToLight = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }
};

export const getCurrentTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      return 'dark';
    }
  }
  return 'light';
}; 