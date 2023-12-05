const routes = {
  home: "/",
  organizationBase: (organization: string | null | undefined) =>
    `/${organization}`,
  dashboard: (organization: string | null | undefined) =>
    `/${organization}/dashboard`,
  employees: (organization: string | null | undefined) =>
    `/${organization}/employees`,
  jobs: (organization: string | null | undefined) => `/${organization}/jobs`,
  records: (organization: string | null | undefined) =>
    `/${organization}/records`,
  requests: (organization: string | null | undefined) =>
    `/${organization}/requests`,
  profile: (organization: string | null | undefined) =>
    `/${organization}/user-profile`,
  orgOptions: (organization: string | null | undefined) =>
    `/${organization}/organization-options`,
  login: "/api/auth/signin",
  signup: "/signup",
  about: "/about",
  logout: "/api/auth/signout?callbackUrl=/",
  redirectSignin: (callbackUrl: string) =>
    `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
};

export default routes;
