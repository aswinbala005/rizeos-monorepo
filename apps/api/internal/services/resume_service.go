package services

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/ledongthuc/pdf"
)

// --- THE FIX IS HERE ---
// Define the Project struct
type Project struct {
	Title   string `json:"title"`
	Summary string `json:"summary"`
}

// Update the main struct to expect an array of Projects
type ResumeData struct {
	FullName   string    `json:"full_name"`
	Email      string    `json:"email"`
	JobRole    string    `json:"job_role"`
	Bio        string    `json:"bio"`
	Skills     string    `json:"skills"`
	Experience string    `json:"experience"`
	Education  string    `json:"education"`
	Projects   []Project `json:"projects"` // <-- Changed to a slice of Project
}
// --- END OF FIX ---

// 1. Extract Text from a PDF file located at a URL
func ExtractTextFromPDF(pdfUrl string) (string, error) {
	resp, err := http.Get(pdfUrl)
	if err != nil {
		return "", fmt.Errorf("failed to download pdf: %v", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read pdf body: %v", err)
	}

	r, err := pdf.NewReader(bytes.NewReader(bodyBytes), int64(len(bodyBytes)))
	if err != nil {
		return "", fmt.Errorf("failed to create pdf reader: %v", err)
	}

	var textBuilder strings.Builder
	totalPage := r.NumPage()
	for pageIndex := 1; pageIndex <= totalPage; pageIndex++ {
		p := r.Page(pageIndex)
		if p.V.IsNull() {
			continue
		}
		text, err := p.GetPlainText(nil)
		if err != nil {
			fmt.Printf("Warning: could not extract text from page %d: %v\n", pageIndex, err)
			continue
		}
		textBuilder.WriteString(text)
	}
	return textBuilder.String(), nil
}

// 2. Call Cerebras AI to Parse Text to JSON
func ParseResumeWithAI(text string) (*ResumeData, error) {
	apiKey := os.Getenv("CEREBRAS_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("CEREBRAS_API_KEY not set")
	}
	
	url := "https://api.cerebras.ai/v1/chat/completions"

	if len(text) > 7000 {
		text = text[:7000]
	}

prompt := `
    You are an expert Career Analyst and Resume Parser. Your task is to extract and synthesize information from the provided resume text into a clean JSON object.
    Your response must be ONLY a single, valid JSON object. Do not add any markdown formatting.

    **Extraction & Generation Rules:**
    - **full_name:** The candidate's full name. (Extract)
    - **email:** The candidate's primary email address. (Extract)
    - **job_role:** Analyze the entire resume (experience, projects, skills) and GENERATE a concise, professional job title that best represents this person's expertise. For example, if they have ML projects and Python skills, "Machine Learning Engineer" is a good title, even if their last role was "Intern".
    - **bio:** A professional summary or objective (max 3 sentences). If no summary exists, GENERATE one based on the content.
    - **skills:** A comma-separated string of all technical skills. (Extract)
    - **experience:** A short summary of total experience (e.g., "5 Years" or "Intern"). (Extract)
    - **education:** A summary of their degree and university. (Extract)
    - **projects:** An array of JSON objects. For each project found, create an object with:
    - "title": The exact project title.
    - "summary": A detailed summary of the project's description and achievements (3-3.5 sentences).

    Resume Text:
    ---
    ` + text + `
    ---
    JSON Output:`

	requestBody, _ := json.Marshal(map[string]interface{}{
		"model": "llama-3.3-70b",
		"messages": []map[string]string{
			{"role": "user", "content": prompt},
		},
		"temperature": 0.1,
	})

	req, _ := http.NewRequestWithContext(context.Background(), "POST", url, bytes.NewBuffer(requestBody))
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request to cerebras: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("cerebras API returned non-200 status: %d, body: %s", resp.StatusCode, string(bodyBytes))
	}

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("failed to decode cerebras response: %w", err)
	}

	choices, ok := result["choices"].([]interface{})
	if !ok || len(choices) == 0 {
		return nil, fmt.Errorf("no choices found in AI response")
	}
	
	message, ok := choices[0].(map[string]interface{})["message"].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("invalid message format in AI response")
	}

	content, ok := message["content"].(string)
	if !ok {
		return nil, fmt.Errorf("no content found in AI message")
	}

	var data ResumeData
	if err := json.Unmarshal([]byte(content), &data); err != nil {
		return nil, fmt.Errorf("failed to parse AI JSON: %w. Raw content: %s", err, content)
	}

	return &data, nil
}