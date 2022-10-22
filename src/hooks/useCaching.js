import packageJson from '../../package.json';

export default function useCaching(){
    const version = localStorage.getItem('version');
    if(version !== packageJson.version){
        if("caches" in window){
            caches.keys().then((names)=>{
                names.forEach((name)=>{
                    caches.delete(name);
                });
            });
            //  Makes sure the page reload
            window.location.reload(true)
        }
        localStorage.clear()
        localStorage.setItem('version', packageJson.version);
    }


}