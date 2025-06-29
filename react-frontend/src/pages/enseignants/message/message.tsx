"use client";
import React from "react";
import MessageContainer from "../../../components/message/MessageContainer";

// Dans un cas réel, ce rôle viendrait de votre système d'authentification
const userRole = 'enseignant'; // Peut être 'eleve', 'parent', 'enseignant' ou 'admin'

const Message = () => {
  return (
    <MessageContainer userRole={userRole} />
  );
};

export default Message; 