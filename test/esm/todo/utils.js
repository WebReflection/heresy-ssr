const db = Object.create(null);
const storage = name => (db[name] || set(name));

export const data = name => {
  // const info = storage(name);
  // if (!info.id) {
  //   info.id = 0;
  //   info.items = {};
  // }
  return {
    id: 0,
    items: {};
  }
};

// function handleEvent() {
//   const {name} = this;
//   localStorage.setItem(name, JSON.stringify(db[name]));
// }

// function set(name) {
//   addEventListener('beforeunload', {name, handleEvent}, false);
//   return (db[name] = JSON.parse(localStorage.getItem(name) || '{}'));
// }
