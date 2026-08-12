'use client';
import { useEffect, useState } from 'react';
import { activatePrompt, getPrompts } from '../_services/translationCentreApi';
export default function PromptsPage() { const [prompts, setPrompts] = useState([]); const load = () => getPrompts().then((r) => setPrompts(r.data.data)); useEffect(() => { const timer = setTimeout(() => load().catch(() => setPrompts([])), 0); return () => clearTimeout(timer); }, []); return <section className="space-y-4"><h1 className="text-2xl font-bold">Translation prompts</h1>{prompts.map((p) => <div key={p._id} className="flex gap-3 border p-3">{p.key} v{p.version} {p.isActive ? 'Active' : <button className="rounded border px-2" onClick={async () => { await activatePrompt(p._id); load(); }}>Activate</button>}</div>)}</section>; }
