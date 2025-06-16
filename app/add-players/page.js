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
    <div className="pt-10 pb-32">
      <div className="container">
        <h1 className="mb-4">Add Players</h1>
        <form onSubmit={handleSubmit} className="flex gap-4 items-center">
        <input name="name" placeholder="Name" required  className=" h-10 px-4 border border-black border-solid rounded-md"/>

        <button type="submit" className="button button--primary">Submit</button>
      </form>
      </div>
    </div>

  );
}