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
import MyPage from "@/components/cust/amp/ampPage";
import authService from "@/config/auth/auth";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/cust/loading";

export default function Home() {

  const [whichPlayLists, setWhichPlayLists] = useState<string>();
  const { currentUser, setCurrentUser, setIsUserLogin } = useAuth()
  const [you, setYou] = useState<any>()
  const [all, setAll] = useState<any>()
  const [loading, setLoading] = useState(true)
  const navigate = useRouter()


  const fetchPlayLists = async () => {
    console.log('fetching play list user === ', currentUser);
    setLoading(true)
    try {
      if (whichPlayLists === 'all') {
        console.log('fetching all', all);

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

          return setYou(youPlayLists)
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
      console.log('current user from localStorage if ', currentUser);
    } else {
      console.log('current user from localStorage else ', currentUser);
      setWhichPlayLists('all')
    }
  }, [currentUser])

  const refreshCurrentPlaylists = () => {
    if (whichPlayLists === 'all') {
      setAll({});
      return fetchPlayLists();  // Fetch new playlists
    }

    if (whichPlayLists === 'you') {
      setYou({});
      return fetchPlayLists();  // Fetch new playlists
    }

    if (whichPlayLists === 'fav') {
      // TODO: Add functionality to refresh favorite playlists once implemented
      console.log("Refreshing favorite playlists not implemented yet.");
      return;
    }
  };


  const controlLog = async () => {
    if (currentUser && currentUser?.$id) {
      const logout = await authService.logout();
      console.log("user logged out", logout);
      setCurrentUser(null)
      setIsUserLogin(false)
      navigate.push('/users/login')

    }
    navigate.push('/users/login')
  }


  return (
    <PageUi>
      <script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"></script>

      {/* <RefreshCw
        onClick={() => refreshCurrentPlaylists()}
        className="text-blue-600  hover:rotate-180 duration-500 cursor-pointer fixed top-0 right-0 "
      /> */}


      <div
        className="flex justify-between "
      >
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
        <div>
          <Button
            onClick={controlLog}
            className=""
            variant={"outline"}
          >
            {currentUser && currentUser?.$id ? "LogOut" : "LogIn"}
          </Button>

        </div>
      </div>
      {
        loading ?
          <LoadingScreen />
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
              <MyPage />
            </>
          )
      }
    </PageUi>

  );
}
