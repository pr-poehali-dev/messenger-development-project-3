import { useState } from "react";
import Icon from "@/components/ui/icon";
import { CONTACTS, Contact } from "./data";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getRegistry } from "@/lib/usersRegistry";

const ALL_PEOPLE: Contact[] = [
  { id: "masha", name: "Мария Петрова", avatar: "МП", online: true, username: "masha_p", bio: "Дизайнер · Люблю горы ⛰️" },
  { id: "dima", name: "Дмитрий Волков", avatar: "ДВ", online: false, username: "dima_v", bio: "Разработчик · Coffee ☕" },
  { id: "katya", name: "Екатерина Смирнова", avatar: "ЕС", online: true, username: "katya_s", bio: "Маркетолог · 📊" },
  { id: "ivan", name: "Иван Козлов", avatar: "ИК", online: false, username: "ivan_k", bio: "Менеджер проектов" },
  { id: "anna", name: "Анна Белова", avatar: "АБ", online: true, username: "anna_b", bio: "UX/UI · Путешественница ✈️" },
  { id: "sergey", name: "Сергей Новиков", avatar: "СН", online: false, username: "sergey_n", bio: "Backend dev · Rust 🦀" },
  { id: "nikita", name: "Никита Орлов", avatar: "НО", online: true, username: "nikita_o", bio: "Фотограф · 📸" },
  { id: "olga", name: "Ольга Зайцева", avatar: "ОЗ", online: false, username: "olga_z", bio: "Бухгалтер · Люблю кошек 🐱" },
  { id: "pavel", name: "Павел Громов", avatar: "ПГ", online: true, username: "pavel_g", bio: "Продакт-менеджер" },
  { id: "elena", name: "Елена Соколова", avatar: "ЕС", online: false, username: "elena_s", bio: "Юрист · ⚖️" },
  { id: "roman", name: "Роман Федоров", avatar: "РФ", online: false, username: "roman_f", bio: "DevOps · ☁️" },
  { id: "tanya", name: "Татьяна Макарова", avatar: "ТМ", online: true, username: "tanya_m", bio: "SMM · Контент 📱" },
  { id: "alexb", name: "Алексей Борисов", avatar: "АБ", online: false, username: "alex_b", bio: "Архитектор · 🏗️" },
  { id: "ksenia", name: "Ксения Попова", avatar: "КП", online: true, username: "ksenia_p", bio: "HR · Люди и команды 👥" },
];

interface Props {
  onStartChat: (contactName: string, avatar: string) => void;
}

export default function ContactsPanel({ onStartChat }: Props) {
  const [myContacts, setMyContacts] = useLocalStorage<Contact[]>("chatda_contacts", CONTACTS);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"my" | "search">("my");
  const [added, setAdded] = useState<string | null>(null);
  const [showAddManual, setShowAddManual] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualUsername, setManualUsername] = useState("");

  // Объединяем статичных людей + всех кто зарегался в браузере
  const registryUsers = getRegistry();
  const allPeopleWithRegistry = [
    ...ALL_PEOPLE,
    ...registryUsers.filter(u => !ALL_PEOPLE.find(p => p.id === u.id)),
  ];

  const addContact = (person: Contact) => {
    if (!myContacts.find(c => c.id === person.id)) {
      setMyContacts(prev => [...prev, person]);
    }
    setAdded(person.id);
    setTimeout(() => setAdded(null), 1500);
  };

  const addManual = () => {
    if (!manualName.trim()) return;
    const id = "manual_" + Date.now();
    const initials = manualName.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const person: Contact = {
      id,
      name: manualName.trim(),
      avatar: initials,
      online: false,
      username: manualUsername.trim().replace("@", "") || id,
      bio: "",
    };
    setMyContacts(prev => [...prev, person]);
    setManualName("");
    setManualUsername("");
    setShowAddManual(false);
  };

  const removeContact = (id: string) => {
    setMyContacts(prev => prev.filter(c => c.id !== id));
  };

  // Нормализуем строку: убираем @, пробелы, в нижний регистр
  const normalize = (s: string) => s.toLowerCase().replace("@", "").trim();

  const q = normalize(search);

  const searchResults = q.length > 0
    ? allPeopleWithRegistry.filter(p =>
        normalize(p.name).includes(q) ||
        normalize(p.username).includes(q) ||
        (p.bio && normalize(p.bio).includes(q))
      )
    : allPeopleWithRegistry;

  const myFiltered = q.length > 0 && mode === "my"
    ? myContacts.filter(c =>
        normalize(c.name).includes(q) ||
        normalize(c.username).includes(q)
      )
    : myContacts;

  const online = myFiltered.filter(c => c.online);
  const offline = myFiltered.filter(c => !c.online);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold font-golos">Контакты</h2>
            <p className="text-xs text-muted-foreground">{myContacts.filter(c => c.online).length} в сети · {myContacts.length} всего</p>
          </div>
          <button
            onClick={() => setShowAddManual(!showAddManual)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              showAddManual ? "btn-gradient text-white" : "bg-secondary text-muted-foreground hover:bg-border"
            }`}
          >
            <Icon name={showAddManual ? "X" : "UserPlus"} size={15} />
          </button>
        </div>

        {/* Добавить вручную */}
        {showAddManual && (
          <div className="mb-3 p-3 rounded-xl bg-secondary border border-primary/20 animate-fade-in space-y-2">
            <p className="text-xs font-semibold text-primary">Добавить контакт вручную</p>
            <input
              type="text"
              placeholder="Имя Фамилия"
              value={manualName}
              onChange={e => setManualName(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
            <input
              type="text"
              placeholder="username (без @)"
              value={manualUsername}
              onChange={e => setManualUsername(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addManual()}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
            <button
              onClick={addManual}
              disabled={!manualName.trim()}
              className="w-full py-2 rounded-lg btn-gradient text-white text-xs font-semibold disabled:opacity-40"
            >
              Добавить
            </button>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-2">
          <Icon name="Search" size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Имя или username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary border border-border rounded-xl pl-8 pr-3 py-2 text-sm outline-none focus:border-primary/50 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <Icon name="X" size={12} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          <button
            onClick={() => setMode("my")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === "my" ? "btn-gradient text-white" : "bg-secondary text-muted-foreground"
            }`}
          >
            Мои контакты
          </button>
          <button
            onClick={() => setMode("search")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === "search" ? "btn-gradient text-white" : "bg-secondary text-muted-foreground"
            }`}
          >
            Найти людей
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">

        {/* === НАЙТИ ЛЮДЕЙ === */}
        {mode === "search" && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">
              {q ? `Найдено · ${searchResults.length}` : `Все · ${searchResults.length}`}
            </p>
            {searchResults.length === 0 && (
              <div className="text-center py-10 text-muted-foreground text-sm">Никого не найдено</div>
            )}
            {searchResults.map((person, i) => {
              const isAdded = !!myContacts.find(c => c.id === person.id);
              return (
                <div
                  key={person.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 hover:bg-secondary transition-all animate-slide-in-up"
                  style={{ animationDelay: `${i * 0.03}s`, animationFillMode: "both" }}
                >
                  <div className="relative flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white ${person.online ? "btn-gradient" : "bg-muted"}`}>
                      {person.avatar}
                    </div>
                    {person.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background online-dot" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-sm">{person.name}</p>
                      {registryUsers.find(u => u.id === person.id) && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold">В сети</span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">@{person.username}</p>
                  </div>
                  {isAdded ? (
                    <span className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-primary/10 text-primary">
                      <Icon name="Check" size={11} />
                      В контактах
                    </span>
                  ) : (
                    <button
                      onClick={() => addContact(person)}
                      className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                        added === person.id ? "bg-green-500/20 text-green-400" : "btn-gradient text-white hover:scale-105"
                      }`}
                    >
                      <Icon name={added === person.id ? "Check" : "UserPlus"} size={11} />
                      {added === person.id ? "Добавлен!" : "Добавить"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* === МОИ КОНТАКТЫ === */}
        {mode === "my" && (
          <>
            {myFiltered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">
                {q ? `Никого не найдено по «${search}»` : "Контакты пусты"}
              </div>
            )}

            {online.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">В сети · {online.length}</p>
                <div className="space-y-1">
                  {online.map((c, i) => (
                    <ContactRow key={c.id} contact={c} delay={i * 0.03} onChat={() => onStartChat(c.name, c.avatar)} onRemove={() => removeContact(c.id)} />
                  ))}
                </div>
              </div>
            )}

            {offline.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">Не в сети · {offline.length}</p>
                <div className="space-y-1">
                  {offline.map((c, i) => (
                    <ContactRow key={c.id} contact={c} delay={(online.length + i) * 0.03} onChat={() => onStartChat(c.name, c.avatar)} onRemove={() => removeContact(c.id)} />
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setMode("search")}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary text-sm"
            >
              <Icon name="UserPlus" size={15} />
              Найти и добавить контакт
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ContactRow({ contact, delay, onChat, onRemove }: {
  contact: Contact; delay: number; onChat: () => void; onRemove: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary transition-all duration-200 group cursor-pointer animate-slide-in-up relative"
      style={{ animationDelay: `${delay}s`, animationFillMode: "both" }}
    >
      <div className="relative flex-shrink-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white ${contact.online ? "btn-gradient" : "bg-muted text-muted-foreground"}`}>
          {contact.avatar}
        </div>
        {contact.online
          ? <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background online-dot" />
          : <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-muted rounded-full border-2 border-background" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${!contact.online ? "text-muted-foreground" : ""}`}>{contact.name}</p>
        <p className="text-[11px] text-muted-foreground">@{contact.username.replace("@", "")}</p>
      </div>
      <div className="hidden group-hover:flex gap-1 items-center">
        <button onClick={onChat} className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center transition-all hover:scale-110">
          <Icon name="MessageCircle" size={13} className="text-white" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="w-8 h-8 rounded-xl bg-secondary hover:bg-border flex items-center justify-center transition-colors"
        >
          <Icon name="MoreVertical" size={13} className="text-muted-foreground" />
        </button>
      </div>
      {showMenu && (
        <div className="absolute right-2 top-12 z-30 bg-card border border-border rounded-xl shadow-xl py-1 min-w-[140px] animate-scale-in" onClick={e => e.stopPropagation()}>
          <button onClick={() => { onChat(); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors">
            <Icon name="MessageCircle" size={14} className="text-primary" /> Написать
          </button>
          <button onClick={() => { onRemove(); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors text-destructive">
            <Icon name="UserMinus" size={14} /> Удалить контакт
          </button>
        </div>
      )}
    </div>
  );
}