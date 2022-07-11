export const userQuery =  (userId) =>{
    const sanity_query = `*[_type == "user" && _id == ${userId}]`;
    return sanity_query
}