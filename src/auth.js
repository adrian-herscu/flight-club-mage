import { defineUserSignupFields } from 'wasp/server/auth'

export const userSignupFields = defineUserSignupFields({
  // 'data.profile' contains the raw Google profile info
  profilePic: (data) => data.profile.photos?.[0]?.value,
  username: (data) => data.profile.displayName,
})

export const configFn = () => {
  return {
    scopes: ['profile', 'email'], // Ensure 'profile' is included
  }
}