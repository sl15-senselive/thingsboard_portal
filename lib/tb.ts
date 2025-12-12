export async function getTbToken() {
  const res = await fetch("https://dashboard.senselive.io/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: process.env.SENSELIVE_API_USER,
      password: process.env.SENSELIVE_API_PASSWORD,
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to authenticate with ThingsBoard");
  }

  return json.token; 
}
