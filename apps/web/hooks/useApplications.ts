import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useApplications() {
  const { address } = useAccount();

  return useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      // Get user identifier (email from login or wallet address)
      const userEmail = localStorage.getItem("user_email") || localStorage.getItem("seeker_email");
      const identifier = userEmail || address;

      console.log("🔍 useApplications Debug:", { userEmail, address, identifier });

      if (!identifier) {
        console.log("❌ No identifier found");
        return [];
      }

      // 1. Get User ID
      const userRes = await fetch(`${API_URL}/users/${identifier}`);
      const userData = await userRes.json();
      console.log("👤 User data:", userData);
      
      if (!userData.exists) {
        console.log("❌ User doesn't exist");
        return [];
      }

      // 2. Fetch Applications using User ID
      const res = await fetch(`${API_URL}/applications/${userData.user.id}`);
      console.log("📝 Applications fetch response:", res.status, res.ok);
      
      if (!res.ok) {
        console.error("❌ Failed to fetch applications:", res.status);
        throw new Error("Failed to fetch applications");
      }
      
      const data = await res.json();
      console.log("📋 Raw applications data:", data);
      
      // 3. Transform Data for UI with all job details
      const transformed = data.map((app: any) => ({
        id: app.id,
        role: app.job_title,
        company: app.company_name || "Company Name",
        status: app.status || "SENT",
        date: new Date(app.created_at).toLocaleDateString(),
        createdAt: app.created_at,
        match: app.match_score,
        location_city: app.location_city,
        location_type: app.location_type,
        salary_min: app.salary_min,
        salary_max: app.salary_max,
        currency: app.currency || "INR",
        is_unpaid: app.is_unpaid,
        description: app.job_description,
      }));
      
      console.log("✅ Transformed applications:", transformed);
      return transformed;
    },
  });
}