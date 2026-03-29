import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  user: { name: string; avatar: string; username: string };
  onLogout: () => void;
}

export default function ProfilePanel({ user, onLogout }: Props) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState("Разработчик · Создаю крутые продукты 🚀");
  const [notifs, setNotifs] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      {/* Header cover */}
      <div className="relative h-28 flex-shrink-0" style={{
        background: "linear-gradient(135deg, var(--pulse-purple), var(--pulse-pink), var(--pulse-cyan))"
      }}>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "30px 30px"
        }} />
      </div>

      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="flex items-end justify-between -mt-10 mb-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl btn-gradient flex items-center justify-center text-2xl font-bold text-white border-4 border-background glow-purple">
              {user.avatar}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-card border-2 border-background flex items-center justify-center hover:bg-secondary transition-colors">
              <Icon name="Camera" size={13} className="text-muted-foreground" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-10">
            <div className="w-2 h-2 rounded-full bg-green-400 online-dot" />
            <span className="text-sm text-green-400 font-medium">В сети</span>
          </div>
        </div>

        {/* Name & bio */}
        <div className="mb-6">
          <h2 className="text-xl font-bold font-golos">{name}</h2>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>

        {/* Edit form */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Редактировать профиль</h3>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Имя</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">О себе</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
              saved
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "btn-gradient text-white"
            }`}
          >
            {saved ? "✓ Сохранено!" : "Сохранить изменения"}
          </button>
        </div>

        {/* Settings */}
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Настройки</h3>

          {[
            { icon: "Bell", label: "Уведомления", value: notifs, toggle: () => setNotifs(!notifs) },
            { icon: "Volume2", label: "Звуки", value: sounds, toggle: () => setSounds(!sounds) },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl bg-secondary">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Icon name={item.icon} size={15} className="text-primary" fallback="Settings" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <button
                onClick={item.toggle}
                className={`w-11 h-6 rounded-full transition-all duration-200 relative ${
                  item.value ? "btn-gradient" : "bg-border"
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-200 ${
                  item.value ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>
          ))}

          {[
            { icon: "Shield", label: "Конфиденциальность" },
            { icon: "Lock", label: "Безопасность" },
            { icon: "Palette", label: "Внешний вид" },
          ].map(item => (
            <button key={item.label} className="w-full flex items-center justify-between p-4 rounded-2xl bg-secondary hover:bg-border transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Icon name={item.icon} size={15} className="text-primary" fallback="Settings" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Чатов", value: "5" },
            { label: "Контактов", value: "6" },
            { label: "Сообщений", value: "24" },
          ].map(s => (
            <div key={s.label} className="bg-secondary rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold font-golos gradient-text">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all text-sm font-semibold border border-destructive/20"
        >
          <Icon name="LogOut" size={16} />
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}
