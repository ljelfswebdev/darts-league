'use client';

export default function HomePage() {
  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/submit-form', {
      method: 'POST',
      body: JSON.stringify({
        name: e.target.name.value,

      }),
    });
    const result = await res.json();
    console.log('Server response:', result);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />

      <button type="submit">Submit</button>
    </form>
  );
}