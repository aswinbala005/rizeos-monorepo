# Custom Hooks (Data Fetching)

This directory contains all the custom React hooks used for fetching data and managing server state in the GrindLink frontend. We use **TanStack Query (React Query)** as the core library for this purpose.

---

## 💡 Data Fetching Strategy

Our strategy is to encapsulate all server interactions within custom hooks. This provides several key benefits:

*   **Centralized Logic:** All the logic for fetching, caching, and transforming data for a specific resource (e.g., jobs) lives in one place.
*   **Declarative API:** Components can simply call `const { data, isLoading } = useJobs();` without needing to know about `fetch`, API endpoints, or data transformation.
*   **Automatic Caching:** TanStack Query automatically handles caching, reducing redundant network requests and improving performance.
*   **Background Updates:** Data is automatically re-fetched in the background on events like window refocus, ensuring the UI is always up-to-date.

---

## 🪝 Available Hooks

*   **`useJobs.ts`**: Fetches the list of available jobs for a seeker. It intelligently passes the candidate's ID to the backend so that the returned jobs are pre-sorted by their **match score**.
*   **`useApplications.ts`**: Fetches all job applications submitted by the currently logged-in seeker.
*   **`useRecruiterJobs.ts`**: Fetches all jobs posted by the currently logged-in recruiter.
*   **`useRecruiterStats.ts`**: Fetches aggregate statistics (like applicant counts per job) for the recruiter's analytics dashboard.
*   **`useRecruiterVolume.ts`**: Fetches time-series data on application volume for the recruiter's charts.

---

## ⚙️ Workflow

### Creating a New Data-Fetching Hook

1.  **Create a new file** in this directory, e.g., `useMyNewData.ts`.
2.  **Define the hook** using `useQuery` from TanStack Query.
3.  **Set a unique `queryKey`**. This key is used by TanStack Query to manage caching. It should be an array, typically starting with a string identifier and including any dependencies.
4.  **Write the `queryFn`**. This is an `async` function that performs the actual data fetching. It should handle retrieving necessary identifiers (like user ID from `localStorage`), making the `fetch` call, and transforming the response data into a clean format for the UI.

**Example Template:**
```typescript
import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useMyNewData(someId: string) {
  return useQuery({
    // The queryKey uniquely identifies this data
    queryKey: ["myData", someId],

    // The queryFn performs the fetch
    queryFn: async () => {
      if (!someId) return null; // Don't fetch if the ID is missing

      const response = await fetch(`${API_URL}/my-endpoint/${someId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch new data");
      }
      const data = await response.json();
      
      // Optional: Transform the data before returning it
      return data.map(item => ({ ...item, processed: true }));
    },

    // Only run the query if someId is available
    enabled: !!someId,
  });
}
