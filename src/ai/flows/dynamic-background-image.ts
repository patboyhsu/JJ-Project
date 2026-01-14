// 'use server';

// /**
//  * @fileOverview Generates a dynamic background image URL based on weather, gender, and personality.
//  *
//  * - generateBackgroundImage - A function that generates a background image URL.
//  * - GenerateBackgroundImageInput - The input type for the generateBackgroundImage function.
//  * - GenerateBackgroundImageOutput - The return type for the generateBackgroundImage function.
//  */

// import {ai} from '@/ai/genkit';
// import {z} from 'genkit';

// const GenerateBackgroundImageInputSchema = z.object({
//   weatherMood: z.string().describe('The mood associated with the current weather (e.g., sunny, rainy).'),
//   gender: z.string().describe('The user selected gender (e.g., male, female, non-binary).'),
//   personality: z.string().describe('The user selected personality tags (e.g., optimistic, calm, passionate).'),
// });
// export type GenerateBackgroundImageInput = z.infer<typeof GenerateBackgroundImageInputSchema>;

// const GenerateBackgroundImageOutputSchema = z.object({
//   imageUrl: z.string().describe('A URL for the background image. It should be a base64 encoded data URI.'),
// });
// export type GenerateBackgroundImageOutput = z.infer<typeof GenerateBackgroundImageOutputSchema>;

// export async function generateBackgroundImage(input: GenerateBackgroundImageInput): Promise<GenerateBackgroundImageOutput> {
//   return generateBackgroundImageFlow(input);
// }

// const prompt = ai.definePrompt({
//   name: 'generateBackgroundImagePrompt',
//   input: {schema: GenerateBackgroundImageInputSchema},
//   output: {schema: GenerateBackgroundImageOutputSchema},
//   prompt: `You are an expert in generating search terms for background images based on user preferences and current weather conditions.  Your job is to create the best search terms to send to an image search engine, given the following constraints:

// Weather Mood: {{{weatherMood}}}
// Gender: {{{gender}}}
// Personality: {{{personality}}}

// Based on this information, generate a single search term which encapsulates all of the above to return a suitable background image. The search term should be as concise as possible. Consider that this search term will be used to find images that set the mood of the app.

// Respond using only the search term. Do not include any other text or formatting.`,
// });

// const generateBackgroundImageFlow = ai.defineFlow(
//   {
//     name: 'generateBackgroundImageFlow',
//     inputSchema: GenerateBackgroundImageInputSchema,
//     outputSchema: GenerateBackgroundImageOutputSchema,
//   },
//   async input => {
//     const {output} = await prompt(input);

//     // Call the image generation model to generate the image.
//     const { media } = await ai.generate({
//       model: 'googleai/imagen-4.0-fast-generate-001',
//       prompt: output?.imageUrl ?? 'A beautiful background image',
//     });

//     return { imageUrl: media.url! };
//   }
// );
