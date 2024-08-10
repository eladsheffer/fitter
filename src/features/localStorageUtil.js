export const loadState = (key) => {
    try {
      const serializedData = localStorage.getItem(key);

      return serializedData ? {value: JSON.parse(serializedData)} : undefined;
    } catch (err) {
      return undefined;
    }
  };
  
  export const saveState = (key, state) => {
    try {
      const serializedState = JSON.stringify(state.value);
      localStorage.setItem(key, serializedState);
    } catch (err) {
      // Handle write errors
      console.error("Could not save state", err);
    }
  };