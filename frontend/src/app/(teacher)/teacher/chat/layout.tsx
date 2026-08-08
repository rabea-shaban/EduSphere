// This layout file intentionally has no wrapper.
// TeacherLayout (parent) now handles the chat route
// via useSelectedLayoutSegment() — rendering full-screen
// without padding/max-width when on the "chat" segment.
export default function TeacherChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
