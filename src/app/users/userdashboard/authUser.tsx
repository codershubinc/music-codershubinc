import React from 'react'

function AuthUser({
    isAuthUser,
    user

}: {
    isAuthUser: boolean,
    user: any
}) {
    return (
        <div>
            {isAuthUser ?
                <p>{user.name}</p>
                :
                <></>}
        </div>
    )
}

export default AuthUser