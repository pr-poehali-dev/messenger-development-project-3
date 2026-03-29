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
  // На мобиле: показываем чат поверх списка
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const handleSelectChat = (chat: Chat) => {
    setActiveChat(chat);
    setActiveTab("chats");
    setMobileShowChat(true);
    setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: 0 } : c));
  };

  const handleBackToList = () => {
    setMobileShowChat(false);
  };

  const handleUpdateChat = (updated: Chat) => {
    setChats(prev => prev.map(c => c.id === updated.id ? updated : c));
    setActiveChat(updated);
  };

  const handleStartChat = (name: string, avatar: string) => {
    const existing = chats.find(c => c.name === name && c.type === "private");
    if (existing) {
      handleSelectChat(existing);
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
    handleSelectChat(newChat);
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
    handleSelectChat(newGroup);
  };

  const mainContent = activeTab === "chats" ? (
    activeChat ? (
      <ChatWindow
        chat={activeChat}
        currentUserId="me"
        onUpdateChat={handleUpdateChat}
        onBack={handleBackToList}
      />
    ) : (
      <EmptyState />
    )
  ) : activeTab === "contacts" ? (
    <ContactsPanel onStartChat={handleStartChat} />
  ) : (
    <ProfilePanel user={user} onLogout={onLogout} />
  );

  return (
    <div className="h-screen flex overflow-hidden bg-background relative">
      {/* Global bg orbs */}
      <div className="bg-orb w-[500px] h-[500px] opacity-[0.04]" style={{ background: "var(--pulse-purple)", top: "-20%", right: "10%" }} />
      <div className="bg-orb w-[400px] h-[400px] opacity-[0.03]" style={{ background: "var(--pulse-cyan)", bottom: "-10%", left: "25%" }} />

      {/* Desktop layout */}
      <div className="hidden md:flex w-full h-full">
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
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          {mainContent}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden w-full h-full flex-col">
        {mobileShowChat && activeChat ? (
          <div className="flex-1 flex flex-col min-w-0 animate-slide-in-up">
            <ChatWindow
              chat={activeChat}
              currentUserId="me"
              onUpdateChat={handleUpdateChat}
              onBack={handleBackToList}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-w-0">
            {activeTab === "chats" ? (
              <MobileChatList
                chats={chats}
                activeChat={activeChat}
                onSelectChat={handleSelectChat}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                user={user}
                onNewGroup={() => setShowNewGroup(true)}
              />
            ) : activeTab === "contacts" ? (
              <ContactsPanel onStartChat={handleStartChat} />
            ) : (
              <ProfilePanel user={user} onLogout={onLogout} />
            )}
          </div>
        )}

        {/* Mobile bottom nav */}
        {!mobileShowChat && (
          <div className="flex border-t border-border bg-card px-2 py-1.5 safe-area-bottom">
            {([
              { id: "chats" as Tab, icon: "MessageCircle", label: "Чаты" },
              { id: "contacts" as Tab, icon: "Users", label: "Контакты" },
              { id: "settings" as Tab, icon: "Settings", label: "Профиль" },
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  activeTab === tab.id ? "bg-primary/20" : ""
                }`}>
                  <svg width="0" height="0" className="hidden" />
                  {/* icon */}
                  <span className={activeTab === tab.id ? "text-primary" : "text-muted-foreground"}>
                    {tab.icon === "MessageCircle" && <MessageCircleIcon active={activeTab === tab.id} chats={chats} />}
                    {tab.icon === "Users" && <UsersIcon active={activeTab === tab.id} />}
                    {tab.icon === "Settings" && <SettingsIcon active={activeTab === tab.id} />}
                  </span>
                </div>
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
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

// Mobile icons inline
function MessageCircleIcon({ active, chats }: { active: boolean; chats: Chat[] }) {
  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);
  return (
    <div className="relative">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      {totalUnread > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 px-0.5 btn-gradient rounded-full text-[8px] font-bold text-white flex items-center justify-center">
          {totalUnread}
        </span>
      )}
    </div>
  );
}
function UsersIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

// Mobile chat list (упрощённая версия сайдбара)
function MobileChatList({ chats, activeChat, onSelectChat, searchQuery, onSearchChange, user, onNewGroup }: {
  chats: Chat[]; activeChat: Chat | null; onSelectChat: (c: Chat) => void;
  searchQuery: string; onSearchChange: (q: string) => void;
  user: { name: string; avatar: string; username: string };
  onNewGroup: () => void;
}) {
  const filtered = chats.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span className="text-lg font-bold font-golos gradient-text">Pulse</span>
          </div>
          <button onClick={onNewGroup} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
        <div className="relative">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-secondary border border-border rounded-xl pl-8 pr-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-1">
        {filtered.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`chat-item w-full flex items-center gap-3 px-4 py-3 text-left ${activeChat?.id === chat.id ? "active" : ""}`}
          >
            <div className="relative flex-shrink-0">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                chat.type === "group" ? "bg-gradient-to-br from-purple-500 to-pink-500" : "btn-gradient"
              }`}>
                {chat.avatar.length <= 2 ? chat.avatar : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
              </div>
              {chat.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card online-dot" />}
              {chat.type === "group" && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-purple-500 rounded-full border-2 border-card flex items-center justify-center">
                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold text-sm truncate">{chat.name}</span>
                <span className="text-[11px] text-muted-foreground ml-2 flex-shrink-0">{chat.lastTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground truncate">{chat.lastMessage}</span>
                {chat.unread > 0 && (
                  <span className="ml-2 min-w-[18px] h-4 px-1 btn-gradient rounded-full text-[9px] font-bold text-white flex items-center justify-center flex-shrink-0">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
