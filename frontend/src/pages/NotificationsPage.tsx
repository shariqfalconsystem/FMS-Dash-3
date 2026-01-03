import React, { useState } from "react";
import { fleetNotifications as notificationsData, Notification } from "../data/notificationsData";
import { Link } from "react-router-dom";

// Badge colors
const getBadgeColor = (type: string) => {
  switch (type) {
    case "warning":
      return "bg-yellow-400";
    case "success":
      return "bg-green-500";
    case "info":
    default:
      return "bg-blue-500";
  }
};

// Badge text color for readability
const getBadgeTextColor = (type: string) => {
  switch (type) {
    case "warning":
      return "text-yellow-900";
    case "success":
      return "text-green-900";
    case "info":
    default:
      return "text-blue-900";
  }
};

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);
  const [unreadCount, setUnreadCount] = useState<number>(
    notificationsData.filter((n) => !n.read).length
  );
  const [filter, setFilter] = useState<string>("all");

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount(notifications.filter((n) => n.id !== id && !n.read).length);
  };

  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((n) => n.type === filter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Fleet Notifications
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            {unreadCount > 0 && (
              <span className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-full shadow-sm">
                {unreadCount} Unread
              </span>
            )}
            <button
              onClick={markAllAsRead}
              className="px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition"
            >
              Mark All as Read
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap mb-4">
          {["all", "info", "success", "warning"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-lg text-sm font-medium border transition ${
                filter === type
                  ? "bg-blue-500 text-white border-blue-500 dark:bg-blue-600 dark:border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <ul className="flex flex-col gap-4 max-h-[650px] overflow-y-auto custom-scrollbar">
          {filteredNotifications.length === 0 && (
            <li className="text-gray-500 dark:text-gray-400 text-center py-10">
              No notifications found.
            </li>
          )}

          {filteredNotifications.map((notif) => (
            <li
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`flex items-start gap-4 p-4 sm:p-5 rounded-xl border transition cursor-pointer shadow-sm hover:shadow-md ${
                notif.read
                  ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  : "border-blue-400 dark:border-blue-600 bg-blue-50/40 dark:bg-blue-900/30"
              }`}
            >
              {/* Avatar */}
              <div className="relative w-14 h-14 flex-shrink-0">
                <img
                  src={notif.avatar}
                  alt="Vehicle"
                  className="w-full h-full rounded-full object-cover"
                />
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-[1.5px] border-white ${getBadgeColor(
                    notif.type
                  )}`}
                ></span>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center">
                  <h3
                    className={`text-gray-800 dark:text-white font-medium text-sm sm:text-base ${
                      !notif.read ? "font-semibold" : "font-normal"
                    }`}
                  >
                    {notif.title}
                  </h3>
                  <span className="text-gray-400 dark:text-gray-400 text-xs sm:text-sm">
                    {notif.time}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-300 text-sm sm:text-base mt-1">
                  {notif.description}
                </p>

                {/* Type Badge */}
                <span
                  className={`inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded-full ${getBadgeColor(
                    notif.type
                  )} ${getBadgeTextColor(notif.type)}`}
                >
                  {notif.type.toUpperCase()}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
