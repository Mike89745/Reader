import {CREATED_REVIEW,CREATED_REVIEW_ERROR,GETTING_REVIEWS,GOT_REVIEWS,GOT_REVIEWS_ERROR
} from "./APIActions"
export default Reviews = (state = {},action) =>{
    switch (action.type) {
        case CREATED_REVIEW_ERROR:
            return Object.assign({}, state, {
                res: action.type,
                ReviewError: action.ReviewError,
                ReviewErrorMSG : action.ReviewErrorMSG,
            })
        case CREATED_REVIEW :
            return Object.assign({}, state, {
                res: action.type,
                ReviewError : action.ReviewError,
            })
        case GETTING_REVIEWS :
            return Object.assign({}, state, {
                res: action.type,
                gettingReviews : action.gettingReviews,
            })
        case GOT_REVIEWS :
            return Object.assign({}, state, {
                res: action.type,
                Reviews : action.Reviews,
                gettingReviews : action.gettingReviews,
            })
        case GOT_REVIEWS_ERROR :
            return Object.assign({}, state, {
                res: action.type,
                gettingReviews : action.gettingReviews,
                ReviewError: action.ReviewError,
                ReviewErrorMSG : action.ReviewErrorMSG,
            })
        default:
            return state
    }
}
