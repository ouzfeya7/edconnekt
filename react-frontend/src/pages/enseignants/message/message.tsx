"use client";
import React from "react";
import MessageContainer from "../../../components/message/MessageContainer";
import { NotificationProvider } from "../../../components/ui/NotificationManager";

// Dans un cas réel, ce rôle viendrait de votre système d'authentification
const userRole = 'enseignant'; // Peut être 'eleve', 'parent', 'enseignant' ou 'admin'

const Message = () => {
  return (
    <NotificationProvider>
      <MessageContainer userRole={userRole} />
    </NotificationProvider>
  );
};

export default Message; 