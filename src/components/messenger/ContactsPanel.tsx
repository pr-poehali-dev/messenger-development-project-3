import Icon from "@/components/ui/icon";
import { CONTACTS } from "./data";

interface Props {
  onStartChat: (contactName: string, avatar: string) => void;
}

export default function ContactsPanel({ onStartChat }: Props) {
  const online = CONTACTS.filter(c => c.online);
  const offline = CONTACTS.filter(c => !c.online);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-lg font-bold font-golos">Контакты</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{online.length} в сети · {CONTACTS.length} всего</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Online */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">В сети</p>
          <div className="space-y-1">
            {online.map((c, i) => (
              <div
                key={c.id}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary transition-all duration-200 group cursor-pointer animate-slide-in-up"
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "both" }}
              >
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl btn-gradient flex items-center justify-center text-sm font-bold text-white">
                    {c.avatar}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background online-dot" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.bio || c.username}</p>
                </div>
                <div className="hidden group-hover:flex gap-1">
                  <button
                    onClick={() => onStartChat(c.name, c.avatar)}
                    className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center transition-all hover:scale-110"
                  >
                    <Icon name="MessageCircle" size={14} className="text-white" />
                  </button>
                  <button className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-border transition-colors">
                    <Icon name="Phone" size={14} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offline */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">Не в сети</p>
          <div className="space-y-1">
            {offline.map((c, i) => (
              <div
                key={c.id}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary transition-all duration-200 group cursor-pointer animate-slide-in-up"
                style={{ animationDelay: `${(online.length + i) * 0.05}s`, animationFillMode: "both" }}
              >
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center text-sm font-bold text-muted-foreground">
                    {c.avatar}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-muted rounded-full border-2 border-background" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-muted-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground/70 truncate">{c.bio || c.username}</p>
                </div>
                <div className="hidden group-hover:flex gap-1">
                  <button
                    onClick={() => onStartChat(c.name, c.avatar)}
                    className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-border transition-colors"
                  >
                    <Icon name="MessageCircle" size={14} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add contact */}
        <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary text-sm">
          <Icon name="UserPlus" size={16} />
          Добавить контакт
        </button>
      </div>
    </div>
  );
}
