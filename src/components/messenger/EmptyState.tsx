import Icon from "@/components/ui/icon";

export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
      {/* BG orbs */}
      <div className="bg-orb w-72 h-72 opacity-10 animate-float" style={{ background: "var(--pulse-purple)", position: "absolute", top: "20%", left: "20%" }} />
      <div className="bg-orb w-48 h-48 opacity-8 animate-float" style={{ background: "var(--pulse-pink)", position: "absolute", bottom: "20%", right: "15%", animationDelay: "2s" }} />

      <div className="relative z-10 text-center px-8">
        <div className="w-20 h-20 rounded-3xl btn-gradient mx-auto mb-6 flex items-center justify-center animate-float glow-purple">
          <Icon name="MessageCircle" size={36} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold font-golos mb-2">
          <span className="gradient-text">Выберите чат</span>
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
          Начните общение, выбрав чат из списка, или создайте новый разговор
        </p>

        <div className="mt-8 flex items-center justify-center gap-6">
          {[
            { icon: "Shield", text: "E2E шифрование" },
            { icon: "Zap", text: "Мгновенно" },
            { icon: "Globe", text: "Везде" },
          ].map(f => (
            <div key={f.text} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center">
                <Icon name={f.icon} size={18} className="text-primary" fallback="Circle" />
              </div>
              <span className="text-xs text-muted-foreground">{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
