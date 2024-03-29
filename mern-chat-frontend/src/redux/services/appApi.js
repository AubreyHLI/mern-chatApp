import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SOCKET_URL } from '../../constant/server';

// define a service iser a base URL
const appApi = createApi({
    reducerPath: 'appApi',
    baseQuery: fetchBaseQuery({
        baseUrl: SOCKET_URL
        // baseUrl: 'http://localhost:5000'
        // baseUrl: 'https://mern-chatapp-server.onrender.com'
    }),
    endpoints: (builder) => ({
        signupUser: builder.mutation({
            query: (user) => ({
                url: '/users',
                method: 'POST',
                body: user
            })
        }),
        loginUser: builder.mutation({
            query: (user) => ({
                url: '/users/login',
                method: 'POST',
                body: user
            })
        }),
        logoutUser: builder.mutation({
            query: (user) => ({
                url: '/logout',
                method: 'DELETE',
                body: user
            })
        }),
        changePw: builder.mutation({
            query: (user) => ({
                url: '/users/changePw',
                method: 'POST',
                body: user
            })
        }),
    }),
});


export const { 
    useSignupUserMutation, 
    useLoginUserMutation, 
    useLogoutUserMutation,
    useChangePwMutation 
} = appApi;

export default appApi;