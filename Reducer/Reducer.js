export const initialState = null

export const reducer = (state, action) => {
    if (action.type === "User") {
        return action.payload
    }
    if (action.type === "Clear") {
        return null
    }
    if (action.type == "Update") {
        return {
            ...state,
            followers: action.payload.followers,
            following: action.payload.following
        }
    }
    if (action.type === "UpdatePhoto") {
        return {
            ...state,
            photo: action.payload
        }
    }
    return state
} 