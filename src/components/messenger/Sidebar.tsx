import Icon from "@/components/ui/icon";
import { Chat } from "./data";

type Tab = "chats" | "contacts" | "settings";

interface Props {
  chats: Chat[];
  activeChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  user: { name: string; avatar: string; username: string };
  onNewGroup: () => void;
}

export default function Sidebar({
  chats, activeChat, onSelectChat, activeTab, onTabChange, searchQuery, onSearchChange, user, onNewGroup
}: Props) {
  const filteredChats = chats.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-72 flex flex-col border-r border-border bg-card h-full">
      {/* Header */}
      <div className="px-3 pt-3 pb-2 border-b border-border">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg btn-gradient flex items-center justify-center">
              <Icon name="Zap" size={14} className="text-white" />
            </div>
            <span className="text-base font-bold font-golos gradient-text">Pulse</span>
          </div>
          {activeTab === "chats" && (
            <button
              onClick={onNewGroup}
              className="w-7 h-7 rounded-lg bg-secondary hover:bg-primary/20 transition-colors flex items-center justify-center"
              title="Новый чат"
            >
              <Icon name="Plus" size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Icon name="Search" size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-secondary border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all"
          />
        </div>
      </div>

      {/* Chat list */}
      {activeTab === "chats" && (
        <div className="flex-1 overflow-y-auto py-2">
          {filteredChats.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <Icon name="MessageCircle" size={32} className="mx-auto mb-2 opacity-30" />
              Чаты не найдены
            </div>
          ) : (
            filteredChats.map((chat, i) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={`chat-item w-full flex items-center gap-2.5 px-3 py-2 text-left ${
                  activeChat?.id === chat.id ? "active" : ""
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    chat.type === "group" ? "bg-gradient-to-br from-purple-500 to-pink-500" : "btn-gradient"
                  }`}>
                    {chat.avatar.length <= 2 ? chat.avatar : <Icon name="Users" size={16} className="text-white" />}
                  </div>
                  {chat.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card online-dot" />
                  )}
                  {chat.type === "group" && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-purple-500 rounded-full border-2 border-card flex items-center justify-center">
                      <Icon name="Users" size={7} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-xs text-foreground truncate">{chat.name}</span>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-1">{chat.lastTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground truncate">{chat.lastMessage}</span>
                    {chat.unread > 0 && (
                      <span className="ml-1.5 min-w-[18px] h-4 px-1 btn-gradient rounded-full text-[9px] font-bold text-white flex items-center justify-center flex-shrink-0">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Bottom nav */}
      <div className="px-2 py-2 border-t border-border">
        {/* User */}
        <button
          onClick={() => onTabChange("settings")}
          className="flex items-center gap-2 w-full px-2 py-1.5 rounded-xl hover:bg-secondary transition-colors mb-1.5"
        >
          <div className="w-7 h-7 rounded-full btn-gradient flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-medium truncate">{user.name}</p>
            <p className="text-[10px] text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              В сети
            </p>
          </div>
        </button>

        <div className="flex gap-1">
          {([
            { id: "chats" as Tab, icon: "MessageCircle", label: "Чаты" },
            { id: "contacts" as Tab, icon: "Users", label: "Контакты" },
            { id: "settings" as Tab, icon: "Settings", label: "Профиль" },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon name={tab.icon} size={16} fallback="Circle" />
              <span className="text-[9px]">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}