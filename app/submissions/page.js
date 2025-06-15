// app/submissions/page.js (or wherever)
export default async function SubmissionsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/get-data`, {
    cache: 'no-store',
  });
  const { users } = await res.json();

  return (
    <div>
      <h2>Submissions</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}