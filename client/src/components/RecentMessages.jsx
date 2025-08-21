import React, { useState, useEffect } from 'react';
import { dummyRecentMessagesData } from '../assets/assets';
import { Link } from 'react-router-dom';
import moment from 'moment';

const RecentMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages(dummyRecentMessagesData);
  }, []);

  return (
    <div className="bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800">
      <h3 className="font-semibold text-slate-800 mb-4">Recent Messages</h3>
      <div className="flex flex-col max-h-56 overflow-y-scroll no-scrollbar">
        {messages.map((message, index) => (
          <Link 
            to={`/messages/${message.from_user_id._id}`}
            key={index} 
            className="flex items-start gap-2 py-2 px-1 hover:bg-slate-100 rounded-md transition"
          >
            <img 
              src={message.from_user_id.profile_picture} 
              alt={message.from_user_id.full_name} 
              className="w-8 h-8 rounded-full object-cover" 
            />
            <div className="w-full">
              <div className="flex justify-between">
                <p className="font-medium truncate">{message.from_user_id.full_name}</p>
                <p className="text-[10px] text-slate-400">
                  {moment(message.createdAt).fromNow()}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500 truncate">
                  {message.text ? message.text : '📷 Media'}
                </p>
                {!message.seen && (
                  <span className="bg-indigo-500 text-white w-3 h-3 flex items-center justify-center rounded-full">{message.unreadCount}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentMessages;
