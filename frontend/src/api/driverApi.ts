export const getDriverStats = async () => {
  const res = await fetch("http://localhost:5000/api/v1/devices");
  return res.json(); 
  // { today: 9, yesterday: 7 }
};
