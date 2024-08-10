export const loadState = (key) => {
    console.log(key)
    try {
      const serializedData = localStorage.getItem(key);

      console.log("PERSISTENCE: ", JSON.parse(serializedData));
      return serializedData ? {value: JSON.parse(serializedData)} : null;
    } catch (err) {
      return null;
    }
  };
  
  export const saveState = (key, state) => {
    try {
      const serializedState = JSON.stringify(state.value);
      console.log("SAVED: ", serializedState);
      localStorage.setItem(key, serializedState);
    } catch (err) {
      // Handle write errors
      console.error("Could not save state", err);
    }
  };