'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending music playlists based on weather, gender, and personality.
 *
 * - recommendMusicPlaylists - A function that recommends music playlists.
 * - RecommendMusicPlaylistsInput - The input type for the recommendMusicPlaylists function.
 * - RecommendMusicPlaylistsOutput - The return type for the recommendMusicPlaylists function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendMusicPlaylistsInputSchema = z.object({
  weather: z.string().describe('The current weather conditions (e.g., sunny, rainy, cloudy).'),
  gender: z.enum(['male', 'female', 'non-binary']).describe('The user\u2019s gender.'),
  personality: z.array(z.string()).describe('An array of personality traits (e.g., optimistic, calm, passionate).'),
});
export type RecommendMusicPlaylistsInput = z.infer<typeof RecommendMusicPlaylistsInputSchema>;

const RecommendMusicPlaylistsOutputSchema = z.object({
  playlist: z.array(z.string()).describe('A list of recommended music playlist URLs or IDs.'),
  imageKeyword: z.string().describe('Keyword for searching appropriate background image'),
});
export type RecommendMusicPlaylistsOutput = z.infer<typeof RecommendMusicPlaylistsOutputSchema>;

export async function recommendMusicPlaylists(input: RecommendMusicPlaylistsInput): Promise<RecommendMusicPlaylistsOutput> {
  return recommendMusicPlaylistsFlow(input);
}

const moodTunePrompt = ai.definePrompt({
  name: 'moodTunePrompt',
  input: {schema: RecommendMusicPlaylistsInputSchema},
  output: {schema: RecommendMusicPlaylistsOutputSchema},
  prompt: `Based on the current weather which is {{{weather}}}, the user's gender which is {{{gender}}}, and their personality traits which are {{{personality}}}, recommend a list of music playlists that would suit their mood and preferences. Also generate a keyword that describes this mood.

Consider these weather to mood mappings:
*   **晴天/多雲/微風：** 映射為 \"愉悅\", \"輕快\", \"放鬆\", \"陽光\"等情緒。
*   **陰天/小雨：** 映射為 \"慵懶\", \"沉靜\", \"憂鬱\", \"內省\"等情緒。
*   **大雨/雷雨：** 映射為 \"戲劇性\", \"激昂\", \"神秘\"等情緒。
*   **雪天：** 映射為 \"寧靜\", \"溫暖\", \"浪漫\"等情緒.

Output the music playlist as a list of URLs, and the image keyword as a string.
`,
});

const recommendMusicPlaylistsFlow = ai.defineFlow(
  {
    name: 'recommendMusicPlaylistsFlow',
    inputSchema: RecommendMusicPlaylistsInputSchema,
    outputSchema: RecommendMusicPlaylistsOutputSchema,
  },
  async input => {
    const {output} = await moodTunePrompt(input);
    return output!;
  }
);
