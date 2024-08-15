'use client'

import PageUi from "@/components/page/pageui";
import ViewAllPlayListsPage from "@/components/cust/playLists/viewAllPlayListsPage";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import YourPl from "@/components/cust/playLists/yourPL";
import { useAuth } from "@/context/AuthContext";

export default function Home() {

  const [whichPlayLists, setWhichPlayLists] = useState<string>('all');
  const { currentUser } = useAuth()


  return (
    <PageUi>

      <div>
        <Button
          onClick={() => setWhichPlayLists('all')}
          className={`w-auto ${whichPlayLists === 'all' ? 'text-slate-700' : 'text-white'}`}
          variant={"ghost"}
        >
          All Playlists
        </Button>

        {currentUser?.labels?.includes('admin') &&
          <>
            <Button
              onClick={() => setWhichPlayLists('you')}
              className={`w-auto  ${whichPlayLists === 'you' ? 'text-slate-700' : 'text-white'}`}
              variant={"ghost"}
            >
              your playlists
            </Button>



            <Button
              onClick={() => setWhichPlayLists('fav')}
              className={`w-auto  ${whichPlayLists === 'fav' ? 'text-slate-700' : 'text-white'}`}
              variant={"ghost"}
            >
              favorite
            </Button>

          </>
        }
      </div>
      {
        whichPlayLists === 'all' && <ViewAllPlayListsPage />
      }
      {
        whichPlayLists === 'you' && <YourPl />
      }


    </PageUi>

  );
}
