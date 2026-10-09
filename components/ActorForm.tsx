'use client';
import Link from 'next/link';
import { useEffect, useState, FormEvent } from 'react';
import { Actor, request } from '@/lib/api';

const blank = { name: '', photo: '', nationality: '', birthDate: '', biography: '' };
export default function ActorForm({ actorId }: { actorId?: string }) {
  const [form, setForm] = useState(blank); const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const [loading, setLoading] = useState(Boolean(actorId));
  useEffect(() => { if (!actorId) return; request<Actor>(`/actors/${actorId}`).then(a => setForm({ name:a.name, photo:a.photo, nationality:a.nationality, birthDate:a.birthDate?.slice(0,10) || '', biography:a.biography })).catch(e => setError(e.message)).finally(() => setLoading(false)); }, [actorId]);
  function change(key: keyof typeof blank, value: string) { setForm(old => ({ ...old, [key]: value })); }
  async function submit(e: FormEvent) { e.preventDefault(); setBusy(true); setError(''); try { await request(actorId ? `/actors/${actorId}` : '/actors', { method: actorId ? 'PUT' : 'POST', body: JSON.stringify(form) }); window.location.assign('/actors'); } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo guardar.'); setBusy(false); } }
  if (loading) return <div className="loading">Cargando actor…</div>;
  return <div className="panel"><Link className="back" href="/actors">← Volver a actores</Link><div className="panel-header"><span className="eyebrow">REPARTO</span><h1>{actorId ? 'Editar actor' : 'Nuevo actor'}</h1><p className="subtle">Completa la información del perfil.</p></div>
    <form onSubmit={submit}><div className="form-grid"><Field label="Nombre completo" required value={form.name} onChange={v=>change('name',v)}/><Field label="Nacionalidad" required value={form.nationality} onChange={v=>change('nationality',v)}/><Field label="URL de fotografía" type="url" required value={form.photo} onChange={v=>change('photo',v)}/><Field label="Fecha de nacimiento" type="date" required value={form.birthDate} onChange={v=>change('birthDate',v)}/><div className="field full"><label>Biografía</label><textarea required value={form.biography} onChange={e=>change('biography',e.target.value)}/></div></div>{error&&<div className="error">{error}</div>}<div className="form-actions"><Link className="button button-light" href="/actors">Cancelar</Link><button className="button" disabled={busy}>{busy?'Guardando…':'Guardar actor'}</button></div></form></div>;
}
function Field({label,value,onChange,type='text',required=false}:{label:string;value:string;onChange:(v:string)=>void;type?:string;required?:boolean}) { return <div className="field"><label>{label}</label><input type={type} value={value} onChange={e=>onChange(e.target.value)} required={required}/></div>; }
