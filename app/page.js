'use client'

import NoteTaking from '../components/NoteTaking'
import { EditorProvider } from '../lib/EditorContext'

export default function Home() {
  return (
    <main className="min-h-screen">
      <EditorProvider>
        <NoteTaking />
      </EditorProvider>
    </main>
  )
}
