export const getUserId = () => {
    let user = localStorage.getItem("user")
    user = JSON.parse(user)
    if (!user) return ""
    return user["user_data"]?.id
}

export const getUserEmail = () => {
    let user = localStorage.getItem("user")
    user = JSON.parse(user)
    if (!user) return ""
    return user["user_data"]?.email
}

export const getUserAccessToken = () => {
    let user = localStorage.getItem("user")
    user = JSON.parse(user)
    if (!user) return ""
    return user?.access_token
}