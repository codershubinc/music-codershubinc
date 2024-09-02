class lOCAL {

    set(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value))
    }

    get(key: string) {
        return JSON?.parse(localStorage.getItem(key) as string)
    }
}
const LOCAL = new lOCAL()

export default LOCAL