"use client";
import React from "react";
// import { Box } from "@mui/material";
// import { tokens } from "../../theme";
import MessageContainer from "../../../components/message/MessageContainer";

// Dans un cas réel, ce rôle viendrait de votre système d'authentification
const userRole = 'eleve'; // Peut être 'eleve', 'parent', 'enseignant' ou 'admin'

const Message = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <MessageContainer userRole={userRole} />
    </div>
  );
};

export default Message;
