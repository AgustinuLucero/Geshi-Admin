const useAuth = ()=>{
    const token = localStorage.getItem('geshi-token');
    return !!token;
}

export default useAuth;