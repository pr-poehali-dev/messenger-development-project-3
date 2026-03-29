import { Contact } from "@/components/messenger/data";

const KEY = "chatda_users_registry";

export function getRegistry(): Contact[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function registerUser(user: { name: string; avatar: string; username: string }) {
  const registry = getRegistry();
  const id = "user_" + user.username;
  if (registry.find(u => u.id === id)) {
    // обновим онлайн-статус
    const updated = registry.map(u => u.id === id ? { ...u, online: true } : u);
    localStorage.setItem(KEY, JSON.stringify(updated));
    return;
  }
  const newUser: Contact = {
    id,
    name: user.name,
    avatar: user.avatar,
    username: user.username,
    online: true,
    bio: "",
  };
  localStorage.setItem(KEY, JSON.stringify([...registry, newUser]));
}

export function setUserOffline(username: string) {
  const registry = getRegistry();
  const updated = registry.map(u =>
    u.username === username ? { ...u, online: false } : u
  );
  localStorage.setItem(KEY, JSON.stringify(updated));
}
