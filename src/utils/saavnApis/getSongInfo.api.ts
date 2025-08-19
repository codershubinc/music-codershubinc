const inf = async (url: string) => {
    try {

        const responce = await fetch(`https://openapihub.vercel.app/v1.0/saavnCDN?link=${url}`)
        const data = await responce.json()
        return data
    } catch (error: any) {
        console.error('saavn api error ::', error);

    }


}


export {
    inf
}