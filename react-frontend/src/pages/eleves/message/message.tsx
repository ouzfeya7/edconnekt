"use client";
import React from "react";
// import { Box } from "@mui/material";
// import { tokens } from "../../theme";
import MessageContainer from "../../../components/message/MessageContainer";
import { NotificationProvider } from "../../../components/ui/NotificationManager";

// Dans un cas réel, ce rôle viendrait de votre système d'authentification
const userRole = 'eleve'; // Peut être 'eleve', 'parent', 'enseignant' ou 'admin'

const Message = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

  return (
    <NotificationProvider>
    <MessageContainer userRole={userRole} />
    </NotificationProvider>
  );
};

export default Message;
