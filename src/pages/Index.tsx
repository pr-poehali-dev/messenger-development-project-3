import AuthScreen from "@/components/messenger/AuthScreen";
import MainLayout from "@/components/messenger/MainLayout";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface UserData {
  name: string;
  avatar: string;
  username: string;
  bio?: string;
}

export default function Index() {
  const [user, setUser, removeUser] = useLocalStorage<UserData | null>("chatda_user", null);

  if (!user) {
    return <AuthScreen onLogin={(u) => setUser(u)} />;
  }

  return (
    <MainLayout
      user={user}
      onLogout={() => removeUser()}
      onUpdateUser={(u) => setUser(u)}
    />
  );
}
