import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminIncidentsPage from "@/components/shared/AuthUSer";

export default async function AdminPage() {
  const session = await auth();
  
  //console.log("Admin Page Session:", session?.user);
  if (!session) redirect("/");
  if (!session?.user.isAdmin) redirect("/");

 
  return (
    <>
    <AdminIncidentsPage />
    
    </>
  );
}

// Inside AdminIncidentsPage component
