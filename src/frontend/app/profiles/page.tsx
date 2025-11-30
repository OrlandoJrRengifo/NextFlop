'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type Profile = {
  id: string
  userId: string
  name: string
  iconUrl?: string
}

export default function ProfilesPage() {
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [iconUrl, setIconUrl] = useState('')
  const [creating, setCreating] = useState(false)

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

  const fetchProfiles = async () => {
    setLoading(true)
    try {
      const token = getToken()
      const res = await fetch('http://localhost:3001/profiles', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) {
        setProfiles([])
        return
      }
      const data = await res.json()
      setProfiles(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  const createProfile = async () => {
    if (!name) return alert('Ingresa un nombre para el perfil')
    setCreating(true)
    try {
      const token = getToken()
      const res = await fetch('http://localhost:3001/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name, iconUrl }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(err.message || 'Error creando perfil')
        return
      }
      setName('')
      setIconUrl('')
      await fetchProfiles()
    } finally {
      setCreating(false)
    }
  }

  const selectProfile = (profileId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeProfile', profileId)
    }
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-6 py-12 bg-background">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl">¿Quién está viendo?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 mb-6">
            {loading && <p>Cargando perfiles...</p>}
            {!loading && profiles.length === 0 && (
              <div className="col-span-3">
                <p>No hay perfiles. Crea uno para comenzar.</p>
              </div>
            )}

            {profiles.map((p) => (
              <div key={p.id} className="flex flex-col items-center">
                <button onClick={() => selectProfile(p.id)} className="w-36 h-36 rounded-lg bg-muted flex items-center justify-center text-xl font-semibold">
                  {p.iconUrl ? <img src={p.iconUrl} alt={p.name} className="w-full h-full object-cover rounded-lg"/> : <span>{p.name.charAt(0).toUpperCase()}</span>}
                </button>
                <p className="mt-2">{p.name}</p>
              </div>
            ))}

            {/* Create profile card */}
            <div className="col-span-1">
              <div className="p-4 border rounded-md">
                <h4 className="font-semibold mb-2">Crear nuevo perfil</h4>
                <Input placeholder="Nombre del perfil" value={name} onChange={(e) => setName(e.target.value)} className="mb-2" />
                <Input placeholder="URL del avatar (opcional)" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} className="mb-2" />
                <Button onClick={createProfile} disabled={creating}>{creating ? 'Creando...' : 'Crear perfil'}</Button>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={() => router.push('/settings')}>Configurar cuenta</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

