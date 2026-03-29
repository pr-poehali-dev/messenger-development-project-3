import { useState } from "react";
import AuthScreen from "@/components/messenger/AuthScreen";
import MainLayout from "@/components/messenger/MainLayout";

interface UserData {
  name: string;
  avatar: string;
  username: string;
}

export default function Index() {
  const [user, setUser] = useState<UserData | null>(null);

  if (!user) {
    return <AuthScreen onLogin={(u) => setUser(u)} />;
  }

  return <MainLayout user={user} onLogout={() => setUser(null)} />;
}
