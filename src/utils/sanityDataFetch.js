export const userQuery =  (userId) =>{
    // Take in user id and return a query
    const sanity_query = `*[_type == "user" && _id == ${userId}]`;
    return sanity_query
}