import Dropdown from "@/components/Dropdown";
import { api } from "@/trpc/server";

export default async function Home() {
  // Populate dropdown with characters from server on load
  const characters = await api.ricknmorty.getCharacters.mutate({});

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted p-4">
      <Dropdown data={characters} />
    </main>
  );
}
