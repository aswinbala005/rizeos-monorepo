import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/jobs`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      
      const data = await res.json();
      
      // Handle empty state
      if (!data) return [];

      // Transform DB data to UI format
      // We mock the missing fields (Salary, Location, AI Summary) for now
      return data.map((job: any) => ({
        id: job.id,
        role: job.title,
        company: "Nexus Tech", // Placeholder until we link User table
        logo: job.title[0].toUpperCase(),
        salary: 1500000, 
        salaryDisplay: "₹12L - ₹18L",
        equity: "0.5%",
        location: "Bangalore (Hybrid)",
        stack: ["Go", "Postgres", "System Design"],
        match: 95, // Placeholder until AI matching is live
        date: new Date(job.created_at).toISOString().split('T')[0],
        summary: {
          pay: "Competitive salary + Equity",
          tech: "Modern Tech Stack",
          mission: "Build the future of hiring."
        },
        description: job.description,
        education: {
            ug: "Any Graduate",
            pg: "Any Postgraduate",
            doc: "Not Required"
        },
        keySkills: ["Development", "Engineering", "Go"]
      }));
    },
  });
}