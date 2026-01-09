export const getFuelStats = async () => {
  const res = await fetch("http://localhost:5000/api/v1/devices");
  return res.json(); 
  // { todayAvg: 7.4, yesterdayAvg: 6.9 }
};
