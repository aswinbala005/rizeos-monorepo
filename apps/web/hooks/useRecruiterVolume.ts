import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useRecruiterVolume() {
  return useQuery({
    queryKey: ["recruiterVolume"],
    queryFn: async () => {
      const storedEmail = localStorage.getItem("recruiter_email");
      if (!storedEmail) return [];

      try {
        // 1. Get User ID
        const userRes = await fetch(`${API_URL}/users/${storedEmail}`);
        const userData = await userRes.json();
        if (!userData.exists) return [];

        // 2. Get Volume Stats
        const volRes = await fetch(`${API_URL}/jobs/recruiter/${userData.user.id}/volume`);
        if (!volRes.ok) throw new Error("Failed to fetch volume");
        
        return await volRes.json();
      } catch (e) {
        console.error(e);
        return [];
      }
    },
  });
}
