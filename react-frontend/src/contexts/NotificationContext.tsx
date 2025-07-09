import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Notification {
    id: string;
    type: 'devoir' | 'note' | 'info';
    message: string;
    date: string;
    read: boolean;
}

const mockNotifications: Notification[] = [
    { id: '1', type: 'devoir', message: "Nouveau devoir de Maths ajouté.", date: '2024-05-20', read: false },
    { id: '2', type: 'note', message: "Votre note en Français est disponible.", date: '2024-05-19', read: false },
    { id: '3', type: 'info', message: "La réunion parents-professeurs est demain.", date: '2024-05-18', read: true },
];

interface NotificationContextType {
    notifications: Notification[];
    markAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

    const markAsRead = (id: string) => {
        setNotifications(currentNotifications =>
            currentNotifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            )
        );
    };

    return (
        <NotificationContext.Provider value={{ notifications, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}; 