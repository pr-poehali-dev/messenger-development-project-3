import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  onLogin: (user: { name: string; avatar: string; username: string }) => void;
}

const DEMO_USERS = [
  { name: "Алексей Морозов", username: "alex_m", avatar: "AM" },
  { name: "Мария Петрова", username: "masha_p", avatar: "МП" },
  { name: "Дмитрий Волков", username: "dima_v", avatar: "ДВ" },
];

export default function AuthScreen({ onLogin }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = name || "Александр Новый";
    const initials = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    onLogin({ name: displayName, avatar: initials, username: displayName.toLowerCase().replace(" ", "_") });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background orbs */}
      <div className="bg-orb w-96 h-96 opacity-20" style={{ background: "var(--pulse-purple)", top: "-10%", left: "-10%" }} />
      <div className="bg-orb w-80 h-80 opacity-15" style={{ background: "var(--pulse-pink)", bottom: "5%", right: "-5%" }} />
      <div className="bg-orb w-64 h-64 opacity-10" style={{ background: "var(--pulse-cyan)", top: "40%", right: "15%" }} />

      <div className="w-full max-w-md px-6 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 btn-gradient glow-purple">
            <Icon name="Zap" size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold font-golos gradient-text">Pulse</h1>
          <p className="text-muted-foreground mt-2 text-sm">Мессенджер нового поколения</p>
        </div>

        {/* Card */}
        <div className="gradient-border animate-scale-in" style={{ animationDelay: "0.1s" }}>
          <div className="bg-card rounded-2xl p-8">
            {/* Tabs */}
            <div className="flex bg-secondary rounded-xl p-1 mb-6">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    mode === m ? "btn-gradient shadow-lg" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "login" ? "Войти" : "Регистрация"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Имя</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя"
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all"
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Пароль</label>
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl btn-gradient font-semibold text-white text-sm mt-2"
              >
                {mode === "login" ? "Войти в Pulse" : "Создать аккаунт"}
              </button>
            </form>

            {/* Quick demo */}
            <div className="mt-6">
              <p className="text-xs text-muted-foreground text-center mb-3">или войдите как</p>
              <div className="flex gap-2">
                {DEMO_USERS.map((u) => (
                  <button
                    key={u.username}
                    onClick={() => onLogin(u)}
                    className="flex-1 flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-secondary hover:bg-border transition-all duration-200 group"
                  >
                    <div className="w-9 h-9 rounded-full btn-gradient flex items-center justify-center text-xs font-bold text-white group-hover:scale-110 transition-transform">
                      {u.avatar}
                    </div>
                    <span className="text-[10px] text-muted-foreground truncate w-full text-center">{u.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Защищённое шифрование · Без рекламы · Pulse 2.0
        </p>
      </div>
    </div>
  );
}
