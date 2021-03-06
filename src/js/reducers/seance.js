const initialState = null;

export default function seance(state = initialState, action) {
    switch (action.type) {
        case 'SEANCE_SELECTED':
            return action.data;
        case 'CLEAN_ORDER':
            return null;
        case 'LOGOUT':
            return initialState;
        default:
            return state;
    }
}