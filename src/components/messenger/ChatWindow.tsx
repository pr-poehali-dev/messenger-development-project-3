import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Chat, Message } from "./data";

interface Props {
  chat: Chat;
  currentUserId: string;
  onUpdateChat: (chat: Chat) => void;
}

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

export default function ChatWindow({ chat, currentUserId, onUpdateChat }: Props) {
  const [inputText, setInputText] = useState("");
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [editingMsg, setEditingMsg] = useState<Message | null>(null);
  const [showReactions, setShowReactions] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  useEffect(() => {
    if (inputText.length > 0) {
      setIsTyping(true);
      const t = setTimeout(() => setIsTyping(false), 1500);
      return () => clearTimeout(t);
    }
    setIsTyping(false);
  }, [inputText]);

  const filteredMessages = searchQuery
    ? chat.messages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : chat.messages;

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;

    if (editingMsg) {
      const updated = chat.messages.map(m =>
        m.id === editingMsg.id ? { ...m, text, edited: true } : m
      );
      onUpdateChat({ ...chat, messages: updated });
      setEditingMsg(null);
    } else {
      const newMsg: Message = {
        id: Date.now(),
        text,
        senderId: currentUserId,
        time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
        replyTo: replyTo ? { id: replyTo.id, text: replyTo.text, sender: replyTo.senderId } : undefined,
      };
      onUpdateChat({
        ...chat,
        messages: [...chat.messages, newMsg],
        lastMessage: text,
        lastTime: newMsg.time,
        unread: 0,
      });
      setReplyTo(null);
    }
    setInputText("");
  };

  const deleteMessage = (msgId: number) => {
    const updated = chat.messages.filter(m => m.id !== msgId);
    onUpdateChat({ ...chat, messages: updated });
    setShowReactions(null);
  };

  const addReaction = (msgId: number, emoji: string) => {
    const updated = chat.messages.map(m => {
      if (m.id !== msgId) return m;
      const existing = m.reactions?.find(r => r.emoji === emoji);
      if (existing) {
        return { ...m, reactions: m.reactions?.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r) };
      }
      return { ...m, reactions: [...(m.reactions || []), { emoji, count: 1 }] };
    });
    onUpdateChat({ ...chat, messages: updated });
    setShowReactions(null);
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
              chat.type === "group" ? "bg-gradient-to-br from-purple-500 to-pink-500" : "btn-gradient"
            }`}>
              {chat.avatar.length <= 2 ? chat.avatar : "🎨"}
            </div>
            {chat.online && (
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card online-dot" />
            )}
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">{chat.name}</p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              {isTyping ? (
                <span className="text-primary animate-pulse">печатает...</span>
              ) : chat.online ? (
                <span className="text-green-400">в сети</span>
              ) : chat.type === "group" ? (
                `${chat.members?.length || 0} участников`
              ) : (
                "был(а) недавно"
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => { setSearchMode(!searchMode); setSearchQuery(""); }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              searchMode ? "bg-primary/20 text-primary" : "hover:bg-secondary text-muted-foreground"
            }`}
          >
            <Icon name="Search" size={14} />
          </button>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground transition-colors"
          >
            <Icon name="Info" size={14} />
          </button>
          <button className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground transition-colors">
            <Icon name="Phone" size={14} />
          </button>
          <button className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground transition-colors">
            <Icon name="Video" size={14} />
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchMode && (
        <div className="px-4 py-2 border-b border-border bg-card/50 animate-fade-in">
          <div className="relative">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              placeholder="Поиск по сообщениям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary border border-border rounded-xl pl-9 pr-4 py-2 text-sm outline-none"
            />
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1" onClick={() => setShowReactions(null)}>
        {filteredMessages.map((msg, i) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`msg-row flex ${isMe ? "justify-end" : "justify-start"} group animate-slide-in-up`}
              style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s`, animationFillMode: "both" }}
            >
              <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                {/* Reply */}
                {msg.replyTo && (
                  <div className={`mb-1 px-3 py-1.5 rounded-xl text-xs border-l-2 border-primary bg-primary/10 max-w-full ${isMe ? "self-end" : ""}`}>
                    <p className="text-primary font-medium mb-0.5">{msg.replyTo.sender === currentUserId ? "Вы" : msg.replyTo.sender}</p>
                    <p className="text-muted-foreground truncate">{msg.replyTo.text}</p>
                  </div>
                )}

                <div className="relative">
                  {/* Message bubble */}
                  <div
                    className={`px-4 py-2.5 text-sm leading-relaxed relative ${isMe ? "msg-out text-white" : "msg-in text-foreground"}`}
                    onDoubleClick={() => setShowReactions(msg.id)}
                  >
                    {!isMe && chat.type === "group" && (
                      <p className="text-[11px] font-semibold mb-1" style={{ color: "var(--pulse-cyan)" }}>
                        {msg.senderId}
                      </p>
                    )}
                    {msg.text}
                    {msg.edited && (
                      <span className={`text-[10px] ml-1.5 ${isMe ? "text-white/60" : "text-muted-foreground"}`}>изм.</span>
                    )}
                  </div>

                  {/* Context actions */}
                  <div className={`absolute top-0 ${isMe ? "right-full mr-1" : "left-full ml-1"} hidden group-hover:flex items-center gap-0.5`}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowReactions(showReactions === msg.id ? null : msg.id); }}
                      className="w-7 h-7 rounded-lg bg-secondary hover:bg-border flex items-center justify-center transition-colors"
                    >
                      <Icon name="Smile" size={13} className="text-muted-foreground" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setReplyTo(msg); inputRef.current?.focus(); }}
                      className="w-7 h-7 rounded-lg bg-secondary hover:bg-border flex items-center justify-center transition-colors"
                    >
                      <Icon name="Reply" size={13} className="text-muted-foreground" />
                    </button>
                    {isMe && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingMsg(msg); setInputText(msg.text); inputRef.current?.focus(); }}
                          className="w-7 h-7 rounded-lg bg-secondary hover:bg-border flex items-center justify-center transition-colors"
                        >
                          <Icon name="Pencil" size={13} className="text-muted-foreground" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}
                          className="w-7 h-7 rounded-lg bg-secondary hover:bg-destructive/20 flex items-center justify-center transition-colors"
                        >
                          <Icon name="Trash2" size={13} className="text-muted-foreground" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Reaction picker */}
                  {showReactions === msg.id && (
                    <div
                      className={`absolute z-20 ${isMe ? "right-0" : "left-0"} -top-10 flex gap-1 bg-card border border-border rounded-2xl p-1.5 shadow-xl animate-scale-in`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {REACTIONS.map(emoji => (
                        <button
                          key={emoji}
                          className="reaction w-8 h-8 rounded-xl hover:bg-secondary flex items-center justify-center text-base"
                          onClick={() => addReaction(msg.id, emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reactions */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className={`flex gap-1 mt-1 flex-wrap ${isMe ? "justify-end" : ""}`}>
                    {msg.reactions.map((r) => (
                      <button
                        key={r.emoji}
                        className="reaction flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary border border-border text-xs"
                        onClick={() => addReaction(msg.id, r.emoji)}
                      >
                        <span>{r.emoji}</span>
                        <span className="text-muted-foreground">{r.count}</span>
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-muted-foreground mt-1 px-1">{msg.time}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply/Edit bar */}
      {(replyTo || editingMsg) && (
        <div className="px-4 py-2 border-t border-primary/30 bg-primary/5 flex items-center gap-3 animate-fade-in">
          <div className="flex-1">
            <p className="text-xs font-semibold text-primary mb-0.5">
              {editingMsg ? "✏️ Редактирование" : `↩️ Ответ`}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {editingMsg?.text || replyTo?.text}
            </p>
          </div>
          <button
            onClick={() => { setReplyTo(null); setEditingMsg(null); setInputText(""); }}
            className="w-6 h-6 rounded-lg hover:bg-secondary flex items-center justify-center"
          >
            <Icon name="X" size={14} className="text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="px-3 py-2 border-t border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <button className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground transition-colors flex-shrink-0">
            <Icon name="Paperclip" size={15} />
          </button>
          <div className="flex-1 bg-secondary border border-border rounded-xl flex items-center px-3 py-2 gap-2 transition-all focus-within:border-primary/50">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
              placeholder="Написать сообщение..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
              <Icon name="Smile" size={15} />
            </button>
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputText.trim()}
            className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
              inputText.trim()
                ? "btn-gradient shadow-lg hover:scale-105 glow-purple"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            <Icon name="Send" size={14} className={inputText.trim() ? "text-white" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
}