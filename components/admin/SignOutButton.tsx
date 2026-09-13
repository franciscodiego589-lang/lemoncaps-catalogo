import { signOut } from "@/lib/actions/auth";

// <form action={serverFunction}> funciona sem "use client" - é o próprio
// mecanismo nativo de Server Function do React 19 / Next 16.
export function SignOutButton() {
  return (
    <form action={signOut}>
      <button type="submit" className="lc-admin-nav-signout">
        Sair
      </button>
    </form>
  );
}
