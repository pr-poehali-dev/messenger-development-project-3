import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Chat } from "./data";

interface UserData {
  name: string;
  avatar: string;
  username: string;
  bio?: string;
}

interface Settings {
  notifs: boolean;
  sounds: boolean;
  theme: "dark" | "light";
  fontSize: "small" | "medium" | "large";
  showOnline: boolean;
  showReadReceipts: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  notifs: true,
  sounds: true,
  theme: "dark",
  fontSize: "medium",
  showOnline: true,
  showReadReceipts: true,
};

interface Props {
  user: UserData;
  onLogout: () => void;
  onUpdateUser: (u: UserData) => void;
  chats: Chat[];
}

export default function ProfilePanel({ user, onLogout, onUpdateUser, chats }: Props) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useLocalStorage<Settings>("chatda_settings", DEFAULT_SETTINGS);
  const [activeSection, setActiveSection] = useState<"profile" | "notifications" | "privacy" | "appearance">("profile");

  const totalMessages = chats.reduce((s, c) => s + c.messages.length, 0);

  const handleSave = () => {
    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    onUpdateUser({ ...user, name, avatar: initials, bio });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-all duration-200 relative flex-shrink-0 ${value ? "btn-gradient" : "bg-border"}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-200 ${value ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      {/* Cover */}
      <div className="relative h-24 flex-shrink-0" style={{
        background: "linear-gradient(135deg, var(--pulse-purple), var(--pulse-pink), var(--pulse-cyan))"
      }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 30% 50%, white 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }} />
      </div>

      <div className="px-4 pb-6">
        {/* Avatar + status */}
        <div className="flex items-end justify-between -mt-8 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full btn-gradient flex items-center justify-center text-xl font-bold text-white border-4 border-background glow-purple">
              {user.avatar}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background online-dot" />
          </div>
          <div className="flex items-center gap-1.5 mt-8">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 online-dot" />
            <span className="text-xs text-green-400 font-medium">В сети</span>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-bold font-golos">{user.name}</h2>
          <p className="text-xs text-muted-foreground">@{user.username}</p>
          {user.bio && <p className="text-xs text-muted-foreground mt-1">{user.bio}</p>}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: "Чатов", value: String(chats.length) },
            { label: "Контактов", value: "6" },
            { label: "Сообщений", value: String(totalMessages) },
          ].map(s => (
            <div key={s.label} className="bg-secondary rounded-xl p-2.5 text-center">
              <p className="text-lg font-bold font-golos gradient-text">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 mb-4 bg-secondary rounded-xl p-1">
          {([
            { id: "profile", label: "Профиль" },
            { id: "notifications", label: "Звуки" },
            { id: "privacy", label: "Приватность" },
            { id: "appearance", label: "Вид" },
          ] as const).map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                activeSection === s.id ? "btn-gradient text-white shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Profile section */}
        {activeSection === "profile" && (
          <div className="space-y-3 animate-fade-in">
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Имя</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">О себе</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Расскажите о себе..."
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/50 transition-all resize-none"
              />
            </div>
            <button
              onClick={handleSave}
              className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                saved ? "bg-green-500/20 text-green-400 border border-green-500/30" : "btn-gradient text-white"
              }`}
            >
              {saved ? "✓ Сохранено!" : "Сохранить"}
            </button>
          </div>
        )}

        {/* Notifications section */}
        {activeSection === "notifications" && (
          <div className="space-y-2 animate-fade-in">
            {[
              { label: "Push-уведомления", desc: "Получать уведомления о новых сообщениях", key: "notifs" as const },
              { label: "Звуки сообщений", desc: "Звуковой сигнал при получении сообщения", key: "sounds" as const },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-2xl bg-secondary">
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                </div>
                <Toggle value={settings[item.key]} onChange={() => updateSetting(item.key, !settings[item.key])} />
              </div>
            ))}
          </div>
        )}

        {/* Privacy section */}
        {activeSection === "privacy" && (
          <div className="space-y-2 animate-fade-in">
            {[
              { label: "Показывать «В сети»", desc: "Другие видят ваш статус активности", key: "showOnline" as const },
              { label: "Подтверждение прочтения", desc: "Отправлять галочки о прочтении", key: "showReadReceipts" as const },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-2xl bg-secondary">
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                </div>
                <Toggle value={settings[item.key]} onChange={() => updateSetting(item.key, !settings[item.key])} />
              </div>
            ))}
            <div className="p-3 rounded-2xl bg-secondary">
              <p className="text-sm font-medium mb-2">Кто может писать мне</p>
              <div className="flex gap-2">
                {["Все", "Контакты", "Никто"].map(opt => (
                  <button key={opt} className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-border hover:bg-primary/20 hover:text-primary transition-all">
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Appearance section */}
        {activeSection === "appearance" && (
          <div className="space-y-3 animate-fade-in">
            <div className="p-3 rounded-2xl bg-secondary">
              <p className="text-sm font-medium mb-2">Размер шрифта</p>
              <div className="flex gap-2">
                {([
                  { id: "small", label: "Мелкий" },
                  { id: "medium", label: "Средний" },
                  { id: "large", label: "Крупный" },
                ] as const).map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => updateSetting("fontSize", opt.id)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      settings.fontSize === opt.id ? "btn-gradient text-white" : "bg-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-secondary">
              <p className="text-sm font-medium mb-1">Предпросмотр</p>
              <div className={`p-3 rounded-xl bg-background ${
                settings.fontSize === "small" ? "text-xs" : settings.fontSize === "large" ? "text-base" : "text-sm"
              }`}>
                <div className="msg-out inline-block px-3 py-1.5 text-white">Привет! Как дела? 👋</div>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full mt-5 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all text-sm font-semibold border border-destructive/20"
        >
          <Icon name="LogOut" size={15} />
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}
