import { redirect } from 'next/navigation';

// Legacy route — FD content now lives at /fds
export default function FDRedirect() {
  redirect('/fds');
}
