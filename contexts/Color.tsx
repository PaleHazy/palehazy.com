import React, { useContext, useMemo, useState } from "react"

const color_context = React.createContext<any[]>([])
function ColorProvider({children}: any) {
    const [context, setContext] = useState(null);
    const state = useMemo(() => [context, setContext], [context]);
    return <color_context.Provider value={state}>
    {children}
    </color_context.Provider>
}
function useColorProvider() {
    const ctx = useContext(color_context);
    return ctx;
}
export {ColorProvider}