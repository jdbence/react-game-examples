const KEY = "REACT_GAMES";

export const getLocalData = () => {
  const data = localStorage.getItem(KEY);
  if (data) {
    return JSON.parse(data);
  }
  return {
    isLoggedIn: false
  };
};

export const saveLocalData = (data: object) => {
  const old = getLocalData();
  localStorage.setItem(
    KEY,
    JSON.stringify({
      ...old,
      ...data
    })
  );
};

export const deleteLocalData = () => {
  localStorage.removeItem(KEY);
};
