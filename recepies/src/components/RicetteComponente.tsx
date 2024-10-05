// src/app/components/RicetteComponente.tsx

'use client'; 

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/config/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Ricetta {
  Titolo: string
  Immagine_URL: string
  Tempo_preparazione_totale: number
  Presentazione: string
  Tipologia_dieta: string
  ID: string
  Difficolta: string
  Calorie_per_porzione: number
  Costo: string
  Cottura: string
  Dosi_per: number
}

export default function RicetteComponente() {
  const router = useRouter()
  const [ricette, setRicette] = useState<Ricetta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getRicette = async () => {
      try {
        const ricetteCollection = collection(db, 'ricette')
        const ricetteSnapshot = await getDocs(ricetteCollection)
        const ricetteList = ricetteSnapshot.docs.map(doc => ({
          ...doc.data(),
          ID: doc.id
        })) as Ricetta[]
        setRicette(ricetteList)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Errore sconosciuto')
      } finally {
        setLoading(false)
      }
    }

    getRicette()
  }, [])

  if (loading) {
    return <div>Caricamento ricette in corso...</div>
  }

  if (error) {
    return <div>Errore nel caricamento delle ricette: {error}</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {ricette.map(ricetta => (
        <Card key={ricetta.ID} className="flex flex-col justify-between">
          <CardHeader className="flex-row gap-4 items-center">
            <Avatar>
              <AvatarImage src={ricetta.Immagine_URL} alt={ricetta.Titolo} />
              <AvatarFallback>{ricetta.Titolo?.slice(0,2) || 'RC'}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{ricetta.Titolo}</CardTitle>
              <CardDescription>
                Tempo totale: {ricetta.Tempo_preparazione_totale} min | 
                Difficoltà: {ricetta.Difficolta}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3">{ricetta.Presentazione}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline">{ricetta.Tipologia_dieta}</Badge>
              <Badge variant="outline">{ricetta.Costo}</Badge>
              <Badge variant="outline">{ricetta.Calorie_per_porzione} cal/porzione</Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button onClick={() => router.push(`/ricette/${ricetta.ID}`)}>Vedi Ricetta</Button>
            <span className="text-sm text-gray-500">Per {ricetta.Dosi_per} persone</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
