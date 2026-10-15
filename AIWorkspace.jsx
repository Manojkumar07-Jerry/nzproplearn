import { useEffect, useState } from 'react';
import NexusAiDashboard from './components/NexusAiDashboard';
import NexusAiModal from './components/NexusAiModal';
import { useAuth } from './context/AuthContext';

export default function AIWorkspace() {
  const { currentUser, userProfile } = useAuth();
  const [assistantOpen, setAssistantOpen] = useState(false);
  useEffect(() => {
    document.title = 'Nexus AI Workspace | Nexus GenZ';
  }, []);

  const studentProfile = userProfile || {
    name: currentUser?.displayName || 'Student',
    degree: 'B.Tech'
  };

  return (
    <main className="min-h-screen bg-[#070A14] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 border-b border-cyan-500/20 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">Nexus GenZ</p>
          <h1 className="mt-1 text-2xl font-bold">AI Learning Workspace</h1>
        </header>
        <NexusAiDashboard
          studentProfile={studentProfile}
          onOpenAiModal={() => setAssistantOpen(true)}
        />
      </div>
      <NexusAiModal
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />
    </main>
  );
}