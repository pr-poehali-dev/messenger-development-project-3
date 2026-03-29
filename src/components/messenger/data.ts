export interface Message {
  id: number;
  text: string;
  senderId: string;
  time: string;
  reactions?: { emoji: string; count: number }[];
  replyTo?: { id: number; text: string; sender: string };
  edited?: boolean;
  type?: "text" | "image" | "file";
  fileName?: string;
}

export interface Chat {
  id: number;
  type: "private" | "group";
  name: string;
  avatar: string;
  online?: boolean;
  lastMessage: string;
  lastTime: string;
  unread: number;
  members?: string[];
  messages: Message[];
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  username: string;
  bio?: string;
}

export const CONTACTS: Contact[] = [
  { id: "masha", name: "Мария Петрова", avatar: "МП", online: true, username: "@masha_p", bio: "Дизайнер · Люблю горы ⛰️" },
  { id: "dima", name: "Дмитрий Волков", avatar: "ДВ", online: false, username: "@dima_v", bio: "Разработчик · Coffee ☕" },
  { id: "katya", name: "Екатерина Смирнова", avatar: "ЕС", online: true, username: "@katya_s", bio: "Маркетолог · 📊" },
  { id: "ivan", name: "Иван Козлов", avatar: "ИК", online: false, username: "@ivan_k", bio: "Менеджер проектов" },
  { id: "anna", name: "Анна Белова", avatar: "АБ", online: true, username: "@anna_b", bio: "UX/UI · Путешественница ✈️" },
  { id: "sergey", name: "Сергей Новиков", avatar: "СН", online: false, username: "@sergey_n", bio: "Backend dev · Rust 🦀" },
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 1,
    type: "private",
    name: "Мария Петрова",
    avatar: "МП",
    online: true,
    lastMessage: "Хорошо, увидимся завтра! 👋",
    lastTime: "14:32",
    unread: 2,
    messages: [
      { id: 1, text: "Привет! Как дела?", senderId: "masha", time: "14:20" },
      { id: 2, text: "Отлично! Работаю над новым проектом 🚀", senderId: "me", time: "14:22", reactions: [{ emoji: "🔥", count: 1 }] },
      { id: 3, text: "О, расскажи подробнее! Это что-то связанное с дизайном?", senderId: "masha", time: "14:25" },
      { id: 4, text: "Да, мессенджер с крутым интерфейсом. Почти готово 😎", senderId: "me", time: "14:27" },
      { id: 5, text: "Звучит интересно! Когда покажешь?", senderId: "masha", time: "14:29", reactions: [{ emoji: "👀", count: 2 }] },
      { id: 6, text: "Скоро! Ещё немного доработать и покажу", senderId: "me", time: "14:31" },
      { id: 7, text: "Хорошо, увидимся завтра! 👋", senderId: "masha", time: "14:32" },
    ]
  },
  {
    id: 2,
    type: "group",
    name: "Команда Pulse",
    avatar: "КП",
    lastMessage: "Дима: билд задеплоен ✅",
    lastTime: "13:15",
    unread: 5,
    members: ["alex", "masha", "dima", "katya"],
    messages: [
      { id: 1, text: "Всем привет! Созвон в 15:00 🕒", senderId: "katya", time: "10:00" },
      { id: 2, text: "Буду!", senderId: "masha", time: "10:05" },
      { id: 3, text: "Ок, принял", senderId: "me", time: "10:07" },
      { id: 4, text: "Подготовил демо для встречи", senderId: "masha", time: "12:30", reactions: [{ emoji: "👍", count: 3 }] },
      { id: 5, text: "Отлично выглядит!", senderId: "katya", time: "12:45" },
      { id: 6, text: "билд задеплоен ✅", senderId: "dima", time: "13:15" },
    ]
  },
  {
    id: 3,
    type: "private",
    name: "Дмитрий Волков",
    avatar: "ДВ",
    online: false,
    lastMessage: "Смотри PR, оставил комментарии",
    lastTime: "вчера",
    unread: 0,
    messages: [
      { id: 1, text: "Привет! Посмотрел твой код", senderId: "dima", time: "вчера 18:00" },
      { id: 2, text: "Смотри PR, оставил комментарии", senderId: "dima", time: "вчера 18:05" },
      { id: 3, text: "Спасибо, исправлю сегодня вечером", senderId: "me", time: "вчера 18:20" },
    ]
  },
  {
    id: 4,
    type: "group",
    name: "Дизайн UI Kit",
    avatar: "🎨",
    lastMessage: "Новые компоненты загружены",
    lastTime: "вчера",
    unread: 0,
    members: ["masha", "anna", "me"],
    messages: [
      { id: 1, text: "Обновила цветовую палитру 🎨", senderId: "masha", time: "вчера 16:00" },
      { id: 2, text: "Выглядит здорово!", senderId: "anna", time: "вчера 16:10" },
      { id: 3, text: "Новые компоненты загружены", senderId: "masha", time: "вчера 16:30" },
    ]
  },
  {
    id: 5,
    type: "private",
    name: "Анна Белова",
    avatar: "АБ",
    online: true,
    lastMessage: "Отправила файлы на почту 📎",
    lastTime: "пн",
    unread: 1,
    messages: [
      { id: 1, text: "Можешь прислать материалы для презентации?", senderId: "me", time: "пн 11:00" },
      { id: 2, text: "Конечно! Одну секунду", senderId: "anna", time: "пн 11:05" },
      { id: 3, text: "Отправила файлы на почту 📎", senderId: "anna", time: "пн 11:08" },
    ]
  }
];
