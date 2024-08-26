'use client'

import PageUi from "@/components/page/pageui";
import ViewAllPlayListsPage from "@/components/cust/playLists/viewAllPlayListsPage";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import YourPl from "@/components/cust/playLists/yourPL";
import { useAuth } from "@/context/AuthContext";
import musicPlayList from "@/config/dataBase/playListsDb/musicPlayList";
import musicPlayListByUser from "@/config/dataBase/playListsDb/musicPlayListByUser";
import LOCAL from "@/utils/func/localStorage";
import { RefreshCw } from "lucide-react";

export default function Home() {

  const [whichPlayLists, setWhichPlayLists] = useState<string>();
  const { currentUser } = useAuth()
  const [you, setYpu] = useState<any>()
  const [all, setAll] = useState<any>()
  const [fav, setFav] = useState<any>()
  const [loading, setLoading] = useState(true)


  const fetchPlayLists = async () => {
    console.log('fetching play list user === ', currentUser);
    setLoading(true)
    try {
      if (whichPlayLists === 'all') {
        LOCAL.set('whichPlayLists', 'all')
        if (all?.documents) return
        const allPlayLists = await musicPlayList.getMusicPlayListAllWoQuery()
        if (allPlayLists?.documents) {
          console.log('got playlist infos', allPlayLists);

          return setAll(allPlayLists)
        }
      }

      if (whichPlayLists === 'you') {
        LOCAL.set('whichPlayLists', 'you')
        if (you?.documents) return
        const youPlayLists = await musicPlayListByUser.getMusicPlayListsByUser(currentUser?.$id)
        if (youPlayLists?.documents) {
          console.log('got playlist infos', youPlayLists);

          return setYpu(youPlayLists)
        }
      }

      if (whichPlayLists === 'fav') {
        //  TODO : implement fav
        return
      }
    } catch (error: any) {
      console.log('ERROR AT HOME PAGE', error);
      setLoading(false)
    } finally {
      console.log('finally');
      setLoading(false)
    }
  }


  useEffect(() => {
    if (currentUser?.$id) {
      console.log('witchPlaylist', whichPlayLists);
      console.log('user ', currentUser);
      fetchPlayLists()
    } else {
      fetchPlayLists()
    }
  }, [whichPlayLists, currentUser])


  useEffect(() => {
    let atLocal = LOCAL.get('whichPlayLists')
    if (atLocal && currentUser) {
      console.log('at local ', atLocal);
      setWhichPlayLists(atLocal)
    } else {
      setWhichPlayLists('all')
    }
  }, [])

  const refreshCurrentPlaylists = () => {
    if (whichPlayLists === 'all') {
      setAll(null)
      return fetchPlayLists()
    }

    if (whichPlayLists === 'you') {
      setYpu(null)
      return fetchPlayLists()
    }

    if (whichPlayLists === 'fav') {
      return
    }
  }

  return (
    <PageUi>

      <RefreshCw
        onClick={() => refreshCurrentPlaylists()}
        className="text-blue-600  hover:rotate-180 duration-500 cursor-pointer fixed top-0 right-0 "
      />


      <div>
        <Button
          onClick={() => setWhichPlayLists('all')}
          className={`w-auto ${whichPlayLists === 'all' ? 'text-slate-700 bg-slate-500' : 'text-white'}`}
          variant={"ghost"}
        >
          All Playlists
        </Button>

        {currentUser?.labels?.includes('admin') &&
          <>
            <Button
              onClick={() => setWhichPlayLists('you')}
              className={`w-auto  ${whichPlayLists === 'you' ? 'text-slate-700 bg-slate-500 ' : 'text-white'}`}
              variant={"ghost"}
            >
              your playlists
            </Button>



            <Button
              onClick={() => setWhichPlayLists('fav')}
              className={`w-auto  ${whichPlayLists === 'fav' ? 'text-slate-700 bg-slate-500 ' : 'text-white'}`}
              variant={"ghost"}
            >
              favorite
            </Button>

          </>
        }
      </div>
      {
        loading ?
          <><p>Loading .....</p></>
          :
          (
            <>
              <div>
                {
                  all && whichPlayLists === 'all' && <ViewAllPlayListsPage allPlayLists={all} />
                }
                {
                  you && whichPlayLists === 'you' && <YourPl allPlayLists={you} />
                }
                {
                  whichPlayLists === 'fav' && <><p className="text-red-500 font-bold text-2xl " >We are adding it soon thank you </p></>
                }



              </div>
              <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1775178587078079"
                crossOrigin="anonymous"></script>


              {/* // ! <!-- custHorizontalAds --> */}
              <ins
                className="block adsbygoogle"
                data-ad-client="ca-pub-1775178587078079"
                data-ad-slot="2075762019"
                data-ad-format="auto"
                data-full-width-responsive="true">
              </ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({ })
              </script>
            </>
          )

      }
    </PageUi>

  );
}
