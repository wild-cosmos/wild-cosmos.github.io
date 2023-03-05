const generateId = ((id) => {
  let nextId = id;
  return () => {
    nextId += 1;
    return nextId;
  };
})(Date.now());

export default generateId;
