import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useRecruiterJobs() {
  return useQuery({
    queryKey: ["recruiterJobs"],
    queryFn: async () => {
      const storedEmail = localStorage.getItem("recruiter_email");
      if (!storedEmail) return [];

      try {
        // 1. Get User ID
        const userRes = await fetch(`${API_URL}/users/${storedEmail}`);
        const userData = await userRes.json();
        if (!userData.exists) return [];

        // 2. Get Jobs
        const jobsRes = await fetch(`${API_URL}/jobs/recruiter/${userData.user.id}`);
        if (!jobsRes.ok) throw new Error("Failed to fetch jobs");
        
        const jobsData = await jobsRes.json();
        
        // Return the raw data so the UI can format it
        return jobsData || [];
      } catch (e) {
        console.error("Error fetching recruiter jobs:", e);
        return [];
      }
    },
  });
}