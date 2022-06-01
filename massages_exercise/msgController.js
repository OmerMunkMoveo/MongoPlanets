let massages = [];

const addMassage = (msg) => {
  massages.push(msg);
};

const getMassages = () => {
  return JSON.stringify(massages);
};

module.exports = { getMassages, addMassage };
