import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// define a service iser a base URL
const appApi = createApi({
    reducerPath: 'appApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000'
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
    }),
});


export const { useSignupUserMutation, useLoginUserMutation, useLogoutUserMutation } = appApi;

export default appApi;