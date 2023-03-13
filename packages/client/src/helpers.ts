export const debounce = <T extends (..._args:any[])=>any>(func:T, delay:number):(..._args:Parameters<T>)=>Promise<ReturnType<T>> => {
    let timer: NodeJS.Timeout | null = null
    return (...args: Parameters<T>) => {
        return new Promise<ReturnType<T>>((resolve)=>{
            if ( timer )
                clearTimeout(timer)

            timer = setTimeout(() => {
                const rv = func(...args)
                timer = null
                resolve(rv)
            }, delay)
        })
    }
}
