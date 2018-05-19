const initialState = null;

export default function order(state = initialState, action) {
    switch (action.type) {
        case 'HALL_SEATS_LOADED':
            return {
                selectedSeats: []
            };
        case 'ADD_SEAT_TO_ORDER':
            return {
                ...state,
                selectedSeats: [
                    ...state.selectedSeats,
                    action.data
                ]
            };
        case 'REMOVE_SEAT_FROM_ORDER':
            return {
                ...state,
                selectedSeats: state.selectedSeats.filter(seat => seat.id !== action.data.id)
            };
        case 'CALCULATE_ORDER':
            return {
                ...state,
                calculatedOrder: action.data
            };
        default:
            return state;
    }
}