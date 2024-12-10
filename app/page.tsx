// /app/page.tsx (Redirect root to /home)
import { redirect } from 'next/navigation';
// https://mui.com/material-ui/react-select/
export default function Home() {
  console.log("home =>>>>>>")
  redirect('/dashboard');  // Redirect to /home (Custom default route)
  return null;  // This is never rendered due to the redirect
}
