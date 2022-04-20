import React, { useContext, useMemo, useReducer, useState } from "react"
const initial = {
    filter: 'none'
}
const color_context_state = React.createContext<any>(initial)
const color_context_dispatch = React.createContext<any>(undefined)

const red = (state: typeof initial, action: any) => {
    switch(action.type) {
        case "SET_FILTER": return {...state,filter: action.payload}
        default: return state
    }
}

function ColorProvider({children}: any) {
    const [state, dispatch] = useReducer(red, initial);
    
    return <color_context_dispatch.Provider value={dispatch}>
    <color_context_state.Provider value={state}>
    {children}
    </color_context_state.Provider>
    </color_context_dispatch.Provider>
}
function useColorProvider() {
    const ctx = useContext(color_context_state);
    const ctx2 = useContext(color_context_dispatch);
    return [ctx, ctx2];
}
export {ColorProvider, useColorProvider}