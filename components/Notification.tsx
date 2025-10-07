import React, { useEffect, useState } from 'react';
import { CheckIcon } from './Icons';

interface NotificationProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose, duration = 2800 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); 
    }, duration - 300);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-gray-900 dark:bg-gray-50 text-white dark:text-black py-2.5 px-5 rounded-full shadow-lg transition-all duration-300 ease-out z-50 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <CheckIcon className="h-5 w-5 text-green-400" />
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};

export default Notification;
