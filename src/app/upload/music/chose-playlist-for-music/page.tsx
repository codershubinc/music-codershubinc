'use client'
import React from 'react'
import AddMusicToPlayList from './addMusicToPlayList'
import PageUi from '@/components/page/pageui'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

function Page() {
  const navigate = useRouter()
  return (


    <PageUi>
      <AddMusicToPlayList />
      <Button
        onClick={() => window.history.back()}>
        Back
      </Button >
      <Button
        onClick={() => navigate.push('/upload/music/saavnCDN')}>
        saavnCDN
      </Button >



    </PageUi >



  )
}

export default Page