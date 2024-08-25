class ra {

    async getAvatar() {
        const result = await fetch('https://api-codershubinc.vercel.app/v0.1/random_image')
        const data = await result.json()
        return data?.data?.imageUrl
    }

}

const RA = new ra()
export default RA