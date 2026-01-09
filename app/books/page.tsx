export default async function Page() {
  try {
    const response = await fetch('http://localhost:3000/api/books');
    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }
    const book = await response.json();
    return (
      <main>
        <code>{JSON.stringify(book, null, 1)}</code>
      </main>
    );
  } catch (error) {
    console.error(error);
    return <main>Error loading books: {error.message}</main>;
  }
}