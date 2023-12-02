import { useRouter } from "next/router";

const OrganizationDashboard = () => {
  const router = useRouter();
  const { organization } = router.query; // Access the dynamic segment

  // Use 'organization' to fetch data or render specific components
  return <div>Dashboard for Organization ID: {organization}</div>;
};

export default OrganizationDashboard;
