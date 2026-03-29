import { useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import ContactsPanel from "./ContactsPanel";
import ProfilePanel from "./ProfilePanel";
import EmptyState from "./EmptyState";
import NewGroupModal from "./NewGroupModal";
import { Chat, INITIAL_CHATS, CONTACTS } from "./data";

type Tab = "chats" | "contacts" | "settings";

interface Props {
  user: { name: string; avatar: string; username: string };
  onLogout: () => void;
}

export default function MainLayout({ user, onLogout }: Props) {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewGroup, setShowNewGroup] = useState(false);

  const handleSelectChat = (chat: Chat) => {
    setActiveChat(chat);
    setActiveTab("chats");
    // Clear unread
    setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: 0 } : c));
  };

  const handleUpdateChat = (updated: Chat) => {
    setChats(prev => prev.map(c => c.id === updated.id ? updated : c));
    setActiveChat(updated);
  };

  const handleStartChat = (name: string, avatar: string) => {
    const existing = chats.find(c => c.name === name && c.type === "private");
    if (existing) {
      handleSelectChat(existing);
      setActiveTab("chats");
      return;
    }
    const contact = CONTACTS.find(c => c.name === name);
    const newChat: Chat = {
      id: Date.now(),
      type: "private",
      name,
      avatar,
      online: contact?.online || false,
      lastMessage: "Начните общение",
      lastTime: "",
      unread: 0,
      messages: [],
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat);
    setActiveTab("chats");
  };

  const handleCreateGroup = (name: string, memberIds: string[]) => {
    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const newGroup: Chat = {
      id: Date.now(),
      type: "group",
      name,
      avatar: initials,
      lastMessage: "Группа создана",
      lastTime: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      unread: 0,
      members: memberIds,
      messages: [{
        id: 1,
        text: `Группа «${name}» создана! Добро пожаловать 🎉`,
        senderId: "system",
        time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      }]
    };
    setChats(prev => [newGroup, ...prev]);
    setActiveChat(newGroup);
    setActiveTab("chats");
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background relative">
      {/* Global bg orbs */}
      <div className="bg-orb w-[500px] h-[500px] opacity-[0.04]" style={{ background: "var(--pulse-purple)", top: "-20%", right: "10%" }} />
      <div className="bg-orb w-[400px] h-[400px] opacity-[0.03]" style={{ background: "var(--pulse-cyan)", bottom: "-10%", left: "25%" }} />

      {/* Sidebar */}
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        user={user}
        onNewGroup={() => setShowNewGroup(true)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {activeTab === "chats" ? (
          activeChat ? (
            <ChatWindow
              chat={activeChat}
              currentUserId="me"
              onUpdateChat={handleUpdateChat}
            />
          ) : (
            <EmptyState />
          )
        ) : activeTab === "contacts" ? (
          <ContactsPanel onStartChat={handleStartChat} />
        ) : (
          <ProfilePanel user={user} onLogout={onLogout} />
        )}
      </div>

      {showNewGroup && (
        <NewGroupModal
          onClose={() => setShowNewGroup(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  );
}
