import { LinearClient } from '@linear/sdk';

const apiKey = import.meta.env.VITE_LINEAR_API_KEY;

let linearClient: LinearClient | null = null;

if (apiKey) {
    linearClient = new LinearClient({
        apiKey,
    });
}

export const isLinearConfigured = () => !!linearClient;

export const createLinearIssue = async (title: string, description: string) => {
    if (!linearClient) {
        throw new Error("Linear API key is not configured. Please add VITE_LINEAR_API_KEY to your .env file.");
    }

    try {
        // First, we need to find a team to assign the issue to.
        // For simplicity, we'll pick the first team the user has access to.
        const me = await linearClient.viewer;
        const teams = await me.teams();

        if (teams.nodes.length === 0) {
            throw new Error("No teams found in Linear. Please create a team first.");
        }

        const team = teams.nodes[0];

        const issue = await linearClient.createIssue({
            teamId: team.id,
            title,
            description,
        });

        const issueData = await issue.issue;
        if (!issueData) {
            throw new Error("Failed to retrieve created issue data.");
        }
        return issueData;
    } catch (error) {
        console.error("Failed to create Linear issue:", error);
        throw error;
    }
};
