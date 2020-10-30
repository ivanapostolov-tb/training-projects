export const initialState = {
    basket: [],
    filters: [],
    user: null,
    baseUrl: "http://localhost:8000/"
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.user
            };
            break;
        case 'ADD_TO_BASKET':
            return {
                ...state,
                basket: [...state.basket, action.item]
            };
            break;
        case 'REMOVE_FROM_BASKET':
            let newBasket = [...state.basket]

            const index = state.basket.findIndex(basketItem => (
                basketItem.id === action.id && basketItem.variation === action.variation
            ));

            if (index >= 0) {
                newBasket.splice(index, 1)
            }

            return { ...state, basket: newBasket }
            break;
        case 'ADD_FILTER':
            return {
                ...state,
                filters: [...state.filters, action.filter]
            };
            break;
        case 'REMOVE_FILTER':
            return {
                ...state,
                filters: [...state.filters, action.filter]
            };
            break;
        default:
            return state;
    }
}

export default reducer;