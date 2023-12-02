const routes = {
  home: "/",
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
    `/${organization}/temp-member`,
  login: "/api/auth/signin",
  signup: "/signup",
  about: "/about",
  logout: "/api/auth/signout?callbackUrl=/",
  redirectSignin: (callbackUrl: string) =>
    `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
};

export default routes;
