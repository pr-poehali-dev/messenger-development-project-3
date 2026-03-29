import { useState } from "react";
import Icon from "@/components/ui/icon";
import { CONTACTS } from "./data";

interface Props {
  onClose: () => void;
  onCreate: (name: string, members: string[]) => void;
}

export default function NewGroupModal({ onClose, onCreate }: Props) {
  const [groupName, setGroupName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm mx-4 bg-card rounded-3xl p-6 border border-border shadow-2xl animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold font-golos">Новая группа</h2>
            <p className="text-xs text-muted-foreground">Выберите участников</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-secondary hover:bg-border flex items-center justify-center transition-colors">
            <Icon name="X" size={16} className="text-muted-foreground" />
          </button>
        </div>

        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-1.5 block">Название группы</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Например: Команда проекта"
            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all"
          />
        </div>

        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Контакты ({selected.length} выбрано)</p>
          <div className="space-y-1 max-h-52 overflow-y-auto">
            {CONTACTS.map(c => (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                  selected.includes(c.id) ? "bg-primary/20 border border-primary/30" : "hover:bg-secondary"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white ${
                  selected.includes(c.id) ? "btn-gradient" : "bg-secondary border border-border text-muted-foreground"
                }`}>
                  {c.avatar}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.username}</p>
                </div>
                {selected.includes(c.id) && (
                  <div className="w-5 h-5 rounded-full btn-gradient flex items-center justify-center">
                    <Icon name="Check" size={11} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            if (groupName && selected.length > 0) {
              onCreate(groupName, selected);
              onClose();
            }
          }}
          disabled={!groupName || selected.length === 0}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
            groupName && selected.length > 0
              ? "btn-gradient text-white"
              : "bg-secondary text-muted-foreground cursor-not-allowed"
          }`}
        >
          Создать группу {selected.length > 0 ? `(${selected.length})` : ""}
        </button>
      </div>
    </div>
  );
}
