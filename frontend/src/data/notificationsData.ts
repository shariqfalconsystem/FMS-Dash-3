export interface Notification {
  [x: string]: any;
  id: number;
  avatar: string;
  title: string;
  description: string;
  type: "info" | "warning" | "success";
  time: string;
}

export const fleetNotifications: Notification[] = [
  {
    id: 1,
    avatar: "/images/vehicles/truck.png",
    title: "Vehicle Maintenance Due",
    description: "Truck #23 requires oil change.",
    type: "warning",
    time: "10 min ago",
  },
  {
    id: 2,
    avatar: "/images/vehicles/van-01.jpg",
    title: "New Trip Assigned",
    description: "Van #11 assigned to Route 5 today.",
    type: "info",
    time: "30 min ago",
  },
  {
    id: 3,
    avatar: "/images/vehicles/truck-02.jpg",
    title: "Fuel Alert",
    description: "Truck #19 fuel below 20%.",
    type: "warning",
    time: "1 hr ago",
  },
  {
    id: 4,
    avatar: "/images/vehicles/van-02.jpg",
    title: "Trip Completed",
    description: "Van #7 completed delivery successfully.",
    type: "success",
    time: "2 hr ago",
  },
  {
    id: 5,
    avatar: "/images/vehicles/truck-03.jpg",
    title: "Inspection Required",
    description: "Truck #15 scheduled for inspection tomorrow.",
    type: "info",
    time: "3 hr ago",
  },
];
