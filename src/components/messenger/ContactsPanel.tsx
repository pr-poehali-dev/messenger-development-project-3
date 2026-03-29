import { useState } from "react";
import Icon from "@/components/ui/icon";
import { CONTACTS, Contact } from "./data";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// «База» всех возможных людей для поиска (включая дефолтные контакты + доп.)
const ALL_PEOPLE: Contact[] = [
  ...CONTACTS,
  { id: "nikita", name: "Никита Орлов", avatar: "НО", online: true, username: "@nikita_o", bio: "Фотограф · 📸" },
  { id: "olga", name: "Ольга Зайцева", avatar: "ОЗ", online: false, username: "@olga_z", bio: "Бухгалтер · Люблю кошек 🐱" },
  { id: "pavel", name: "Павел Громов", avatar: "ПГ", online: true, username: "@pavel_g", bio: "Продакт-менеджер" },
  { id: "elena", name: "Елена Соколова", avatar: "ЕС2", online: false, username: "@elena_s", bio: "Юрист · ⚖️" },
  { id: "roman", name: "Роман Федоров", avatar: "РФ", online: false, username: "@roman_f", bio: "DevOps · ☁️" },
  { id: "tanya", name: "Татьяна Макарова", avatar: "ТМ", online: true, username: "@tanya_m", bio: "SMM · Контент 📱" },
  { id: "alex2", name: "Алексей Борисов", avatar: "АБ2", online: false, username: "@alex_b", bio: "Архитектор · 🏗️" },
  { id: "ksenia", name: "Ксения Попова", avatar: "КП", online: true, username: "@ksenia_p", bio: "HR · Люди и команды 👥" },
];

interface Props {
  onStartChat: (contactName: string, avatar: string) => void;
}

export default function ContactsPanel({ onStartChat }: Props) {
  const [myContacts, setMyContacts] = useLocalStorage<Contact[]>(
    "chatda_contacts",
    CONTACTS
  );
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"my" | "search">("my");
  const [added, setAdded] = useState<string | null>(null);

  const addContact = (person: Contact) => {
    if (!myContacts.find(c => c.id === person.id)) {
      setMyContacts(prev => [...prev, person]);
    }
    setAdded(person.id);
    setTimeout(() => setAdded(null), 1500);
  };

  const removeContact = (id: string) => {
    setMyContacts(prev => prev.filter(c => c.id !== id));
  };

  // Поиск по всем людям (исключая уже добавленных)
  const searchResults = search.trim().length > 0
    ? ALL_PEOPLE.filter(p =>
        (p.name.toLowerCase().includes(search.toLowerCase()) ||
         p.username.toLowerCase().includes(search.toLowerCase())) &&
        !myContacts.find(c => c.id === p.id)
      )
    : [];

  const myFiltered = search.trim().length > 0 && mode === "my"
    ? myContacts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.username.toLowerCase().includes(search.toLowerCase())
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
            onClick={() => { setMode(mode === "search" ? "my" : "search"); setSearch(""); }}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              mode === "search" ? "btn-gradient text-white" : "bg-secondary text-muted-foreground hover:bg-border"
            }`}
          >
            <Icon name={mode === "search" ? "X" : "UserPlus"} size={15} />
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Icon name="Search" size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={mode === "search" ? "Найти человека по имени..." : "Поиск в контактах..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus={mode === "search"}
            className="w-full bg-secondary border border-border rounded-xl pl-8 pr-3 py-2 text-sm outline-none focus:border-primary/50 transition-all"
          />
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1 mt-2">
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

        {/* === РЕЖИМ ПОИСКА === */}
        {mode === "search" && (
          <>
            {search.trim().length === 0 ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 rounded-full btn-gradient mx-auto mb-3 flex items-center justify-center opacity-60">
                  <Icon name="Search" size={24} className="text-white" />
                </div>
                <p className="text-sm font-medium mb-1">Найдите людей</p>
                <p className="text-xs text-muted-foreground">Введите имя или @username</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">Никого не найдено по запросу</p>
                <p className="text-xs text-muted-foreground mt-1">«{search}»</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">
                  Результаты · {searchResults.length}
                </p>
                {searchResults.map((person, i) => (
                  <div
                    key={person.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 hover:bg-secondary transition-all animate-slide-in-up"
                    style={{ animationDelay: `${i * 0.04}s`, animationFillMode: "both" }}
                  >
                    <div className="relative flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white ${person.online ? "btn-gradient" : "bg-border"}`}>
                        {person.avatar.replace(/\d/g, "")}
                      </div>
                      {person.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background online-dot" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{person.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{person.bio || person.username}</p>
                    </div>
                    <button
                      onClick={() => addContact(person)}
                      className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        added === person.id
                          ? "bg-green-500/20 text-green-400"
                          : "btn-gradient text-white hover:scale-105"
                      }`}
                    >
                      <Icon name={added === person.id ? "Check" : "UserPlus"} size={12} />
                      {added === person.id ? "Добавлен!" : "Добавить"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* === МОИ КОНТАКТЫ === */}
        {mode === "my" && (
          <>
            {myFiltered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">
                {search ? "Не найдено по запросу" : "Контакты пусты"}
              </div>
            )}

            {online.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">В сети · {online.length}</p>
                <div className="space-y-1">
                  {online.map((c, i) => (
                    <ContactRow
                      key={c.id}
                      contact={c}
                      delay={i * 0.04}
                      onChat={() => { onStartChat(c.name, c.avatar); }}
                      onRemove={() => removeContact(c.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {offline.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">Не в сети · {offline.length}</p>
                <div className="space-y-1">
                  {offline.map((c, i) => (
                    <ContactRow
                      key={c.id}
                      contact={c}
                      delay={(online.length + i) * 0.04}
                      onChat={() => { onStartChat(c.name, c.avatar); }}
                      onRemove={() => removeContact(c.id)}
                    />
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
  contact: Contact;
  delay: number;
  onChat: () => void;
  onRemove: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary transition-all duration-200 group cursor-pointer animate-slide-in-up relative"
      style={{ animationDelay: `${delay}s`, animationFillMode: "both" }}
    >
      <div className="relative flex-shrink-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white ${contact.online ? "btn-gradient" : "bg-secondary border border-border text-muted-foreground"}`}>
          {contact.avatar.replace(/\d/g, "")}
        </div>
        {contact.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background online-dot" />}
        {!contact.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-muted rounded-full border-2 border-background" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${!contact.online ? "text-muted-foreground" : ""}`}>{contact.name}</p>
        <p className="text-[11px] text-muted-foreground truncate">{contact.bio || contact.username}</p>
      </div>
      <div className="hidden group-hover:flex gap-1 items-center">
        <button
          onClick={onChat}
          className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center transition-all hover:scale-110"
        >
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
        <div
          className="absolute right-2 top-12 z-30 bg-card border border-border rounded-xl shadow-xl py-1 min-w-[140px] animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => { onChat(); setShowMenu(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
          >
            <Icon name="MessageCircle" size={14} className="text-primary" />
            Написать
          </button>
          <button
            onClick={() => { onRemove(); setShowMenu(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors text-destructive"
          >
            <Icon name="UserMinus" size={14} />
            Удалить контакт
          </button>
        </div>
      )}
    </div>
  );
}
