// sanity config documents go in here
import sanityClient from '@sanity/client';
import { imageUrlBuilder } from '@sanity/image-url';

export const client = sanityClient({
    projectId: process.env.REACT_APP_SHAREME_SOCIAL_SANITY_ID,
    dataset:'production',
    apiVersion:'2022-07-10',
    useCdn: true,
    token: process.env.REACT_APP_SHAREME_TOKEN
})

const builder = imageUrlBuilder((client));
export const urlFor = (source) => builder.image(source)