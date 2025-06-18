"use client";
import React from "react";
import MessageContainer from "../../../components/message/MessageContainer";

const Message = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <MessageContainer userRole="enseignant" />
    </div>
  );
};

export default Message; 