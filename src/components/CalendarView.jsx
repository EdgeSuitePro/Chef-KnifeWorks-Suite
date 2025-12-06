import React from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, addDays } from 'date-fns';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiChevronLeft, FiChevronRight, FiPackage, FiCheckCircle } = FiIcons;

const CalendarView = ({ reservations, onOpenClientDetails, onDateChange, currentDate = new Date() }) => {
  const [activeDate, setActiveDate] = React.useState(currentDate);

  const monthStart = startOfMonth(activeDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  const nextMonth = () => setActiveDate(addDays(monthEnd, 1));
  const prevMonth = () => setActiveDate(addDays(monthStart, -1));

  // Generate calendar grid
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      
      const dayReservations = reservations.filter(res => {
        if (res.selectedDate) {
          return isSameDay(new Date(res.selectedDate.replace(/-/g, '/')), cloneDay);
        }
        return false;
      });

      days.push(
        <div
          className={`min-h-[100px] border border-gray-200 p-1 relative ${
            !isSameMonth(day, monthStart)
              ? "bg-gray-50 text-gray-400"
              : "bg-white text-gray-900"
          } ${isSameDay(day, new Date()) ? "bg-blue-50" : ""}`}
          key={day}
        >
          <span className="text-sm font-semibold p-1 block text-gray-700">{formattedDate}</span>
          <div className="space-y-1 overflow-y-auto max-h-[80px]">
            {dayReservations.map(res => (
              <div
                key={res.id}
                onClick={() => onOpenClientDetails(res)}
                className={`text-[10px] px-1 py-0.5 rounded cursor-pointer truncate border ${
                  res.status === 'booked' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                  res.status === 'received' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                  res.status === 'ready' ? 'bg-green-50 text-green-700 border-green-100' :
                  'bg-gray-50 text-gray-700 border-gray-100'
                }`}
              >
                {format(new Date(), 'h:mm') && res.drop_off_time.split('~')[0]} - {res.customer_name}
              </div>
            ))}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day}>
        {days}
      </div>
    );
    days = [];
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
    <div key={d} className="text-center font-bold text-gray-500 py-2 border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider">
      {d}
    </div>
  ));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-gray-900">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="font-serif font-bold text-xl text-gray-900">
          {format(activeDate, "MMMM yyyy")}
        </h2>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors border border-gray-200">
            <SafeIcon icon={FiChevronLeft} />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors border border-gray-200">
            <SafeIcon icon={FiChevronRight} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {weekDays}
      </div>
      <div className="bg-gray-200 gap-px grid grid-cols-7 border-l border-t border-gray-200">
        {/* The gap-px and grid-cols-7 allows borders between cells if using bg-gray-200 for container */}
        {/* However, the rows generation above creates its own grid rows. Let's just use the rows directly. */}
      </div>
      <div>
        {rows}
      </div>
    </div>
  );
};

export default CalendarView;