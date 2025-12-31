export const getAlertsStats = async () => {
  const res = await fetch("http://localhost:5000/api/v1/alerts/stats");
  return res.json(); 
  // { today: 12, yesterday: 18 }
};
