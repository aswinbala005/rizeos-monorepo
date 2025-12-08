import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useApplications() {
  const { address } = useAccount();

  return useQuery({
    queryKey: ["applications", address],
    enabled: !!address, // Only run if wallet is connected
    queryFn: async () => {
      // 1. Get User ID
      const userRes = await fetch(`${API_URL}/users/${address}`);
      const userData = await userRes.json();
      if (!userData.exists) return [];

      // 2. Fetch Applications using User ID
      const res = await fetch(`${API_URL}/applications/${userData.user.id}`);
      if (!res.ok) throw new Error("Failed to fetch applications");
      
      const data = await res.json();
      
      // 3. Transform Data for UI
      return data.map((app: any) => ({
        id: app.id,
        role: app.job_title,
        company: "Nexus Tech", // Placeholder (DB join needed later)
        status: app.status, // SENT, VIEWED, etc.
        date: new Date(app.created_at).toLocaleDateString(),
        match: app.match_score
      }));
    },
  });
}