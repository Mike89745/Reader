import {GET_BOOKS,
    GET_BOOKS_FROM_LIBRARY,
    GETTINGS_BOOKS,
    GET_BOOKS_ERROR,
    SEARCH_BOOKS,
    SEARCHING_BOOKS,
    SEARCH_BOOKS_ERROR,
} from "./APIActions"
export default Booker = (state = {Books: []},action) =>{
    switch (action.type) {
        case SEARCHING_BOOKS:
        return Object.assign({}, state, {
            gettingBooks : action.gettingBooks,
            res: action.res,
            CatalogBooks : action.CatalogBooks,
            gettingBooksError : action.gettingBooksError,
        })
        case GETTINGS_BOOKS:
            return Object.assign({}, state, {
                gettingBooks : action.gettingBooks,
                res: action.res,
                gettingBooksError : action.gettingBooksError,
        })
        case SEARCH_BOOKS:
            return Object.assign({}, state, {
                gettingBooks : action.gettingBooks,
                CatalogBooks : action.CatalogBooks,
                res: action.res,
                gettingBooksError : action.gettingBooksError,
        })
        case GET_BOOKS:
            return Object.assign({}, state, {
                gettingBooks : action.gettingBooks,
                CatalogBooks : [...action.CatalogBooks],
                res: action.res,
                gettingBooksError : action.gettingBooksError,
                CatalogPage : action.CatalogPage
        })
        case GET_BOOKS_FROM_LIBRARY: 
            return Object.assign({}, state, {
                gettingBooks : action.gettingBooks,
                CatalogBooks: action.CatalogBooks,
                res: action.res,
                gettingBooksError : action.gettingBooksError,
                CatalogPage : action.CatalogPage
        })
        case SEARCH_BOOKS_ERROR:
        case GET_BOOKS_ERROR:
            return Object.assign({}, state, {
                gettingBooks :  action.gettingBooks,
                res: action.res,
                gettingBooksError : action.gettingBooksError,
                errormsg: errormsg
        })
        
        default:
            return state
    }
}
