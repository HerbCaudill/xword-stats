module.exports =
  function debounce(func, wait, immediate) {
    let timeout;
    return function (...args) {
      const context = this;
      function later() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };
