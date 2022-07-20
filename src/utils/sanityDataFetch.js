export const userQuery =  (userId) =>{
    // Take in user id and return a query
    const sanity_query = `*[_type == "user" && _id == ${userId}]`;
    return sanity_query
}

export const fetchCategories = ()=>{
    return `*[_type =="category"]`
}

export const getFeed = ()=>{
    return `
    *[_type =="pin"] | order(_createdAt desc){
        image{
            asset->{url}
        },
        _id,
        postedBy->{
            _id,
            userName,
            userImgUrl
        },
        save[]{
            _key,
            postedBy->{
                _id,
                userName,
                userImgUrl,
            },
        },
        category->{
                categoryTitle,
                categoryImage,
            },
        }
    `;
}

export const getSearchQuery=(searchTerm)=>{
    return `
    *[_type =="pin" && title match '${searchTerm}*' || category->categoryTitle match'${searchTerm}*' || about match '${searchTerm}*'] | order(_createdAt desc){
        image{
            asset->{url}
        },
        _id,
        postedBy->{
            _id,
            userName,
            userImgUrl
        },
        save[]{
            _key,
            postedBy->{
                _id,
                userName,
                userImgUrl,
            },
        },
        category->{
                categoryTitle,
                categoryImage,
            },
        }
    `;
}