'use client';

import { useRouter } from 'next/navigation';

export default function TutorLogoutButton() {
  const router = useRouter();
  async function handleLogout() {
    await fetch('/api/tutor/logout', { method: 'POST' });
    router.push('/tutor');
    router.refresh();
  }
  return (
    <button onClick={handleLogout} className="min-h-[40px] whitespace-nowrap px-2 text-sm text-ink-faint hover:text-ink">
      Log out
    </button>
  );
}
