import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useJobs() {
  // We still use useAccount to know if the user is connected, but not for the ID
  const { address } = useAccount();

  return useQuery({
    queryKey: ["jobs", address], // Keep address in key to refetch on account switch
    queryFn: async () => {
      let url = `${API_URL}/jobs`;

      // --- THE FIX: Use Email as the Source of Truth ---
      // 1. Get the LOGGED IN user's email from LocalStorage
      const storedEmail = localStorage.getItem("user_email");
      
      if (storedEmail) {
        try {
            // 2. Fetch the user by their unique email
            const userRes = await fetch(`${API_URL}/users/${storedEmail}`);
            const userData = await userRes.json();
            
            if (userData.exists) {
                // 3. Pass the correct User ID to the jobs endpoint
                url += `?candidate_id=${userData.user.id}`;
            }
        } catch (e) {
            console.error("Error fetching user for matching:", e);
        }
      }

      // 4. Fetch Jobs (Backend will now use the correct user for scoring)
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      
      const data = await res.json();
      if (!data) return [];

      // 5. Transform Data
      return data.map((item: any) => {
        const job = item.ListJobsRow || item; 
        const matchScore = item.match_score || 0;

        let salaryDisplay = "Not Disclosed";
        if (job.is_unpaid) {
            salaryDisplay = "Unpaid / Internship";
        } else if (job.salary_min && job.salary_max) {
            const formatVal = (val: number) => val >= 100000 ? `${val/100000}L` : `${val/1000}k`;
            salaryDisplay = `₹${formatVal(job.salary_min)} - ₹${formatVal(job.salary_max)}`;
        }

        const skillsArray = job.skills_requirements 
            ? job.skills_requirements.split(',').map((s: string) => s.trim()) 
            : [];

        return {
            id: job.id,
            role: job.title,
            company: job.organization_name || "Confidential Company",
            logo: job.title ? job.title[0].toUpperCase() : "G",
            salaryDisplay: salaryDisplay,
            location: `${job.location_city || "India"} (${job.location_type})`,
            stack: skillsArray,
            match: matchScore, 
            date: new Date(job.created_at).toISOString().split('T')[0],
            mission: job.job_summary || "No mission statement provided.",
            description: job.description,
            education: job.education_requirements || "Not specified",
            keySkills: skillsArray,
            isUnpaid: job.is_unpaid
        };
      });
    },
  });
}