
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { SummaryLength, DeepInsight, AIConfig } from "../types";

// Always initialize GoogleGenAI with the apiKey from process.env.API_KEY directly.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fast tasks using Flash Lite
export const generateSummary = async (text: string, length: SummaryLength, config?: AIConfig): Promise<string> => {
    if (!text.trim()) return "সারসংক্ষেপ করার জন্য কোনো লেখা পাওয়া যায়নি।";
    const ai = getAI();
    const lengthMap = {
        [SummaryLength.Short]: "২-৩ বাক্যের মধ্যে",
        [SummaryLength.Medium]: "এক অনুচ্ছেদে",
        [SummaryLength.Detailed]: "বিস্তারিত একাধিক অনুচ্ছেদে"
    };

    try {
        const response = await ai.models.generateContent({
            model: config?.model || "gemini-3-flash-preview",
            contents: `এই লেখাটির একটি ${lengthMap[length]} সারসংক্ষেপ বাংলায় দিন:\n\n${text}`,
            config: {
                temperature: config?.temperature ?? 0.7,
                topP: config?.topP ?? 0.95
            }
        });
        return response.text || "সারসংক্ষেপ পাওয়া যায়নি।";
    } catch (error) {
        return "সারসংক্ষেপ তৈরিতে সমস্যা হয়েছে।";
    }
};

// Deep Research with Thinking and Search
export const deepResearch = async (content: string, query: string): Promise<DeepInsight> => {
    const ai = getAI();
    const prompt = `নোটের বিষয়বস্তু: "${content}"\n\nপ্রশ্ন: "${query}"\n\nদয়া করে গুগলে সার্চ করে এবং গভীরভাবে চিন্তা করে বিস্তারিত উত্তর বাংলায় দিন।`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 32768 },
                tools: [{ googleSearch: {} }]
            }
        });

        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
            ?.filter(chunk => chunk.web)
            .map(chunk => ({
                title: chunk.web?.title || "উৎস",
                uri: chunk.web?.uri || ""
            })) || [];

        return {
            text: response.text || "কোনো তথ্য পাওয়া যায়নি।",
            sources
        };
    } catch (error) {
        console.error(error);
        return { text: "গবেষণা করতে সমস্যা হয়েছে।", sources: [] };
    }
};

// Image Generation
export const generateImageFromPrompt = async (prompt: string): Promise<string | null> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: `${prompt} - cinematic, high quality, conceptual illustration` }]
            },
            config: {
                imageConfig: { aspectRatio: "1:1" }
            }
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Image Generation Error:", error);
        return null;
    }
};

// Image Analysis
export const analyzeImage = async (base64Image: string, prompt: string): Promise<string> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: {
                parts: [
                    { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
                    { text: `${prompt} (উত্তরটি অবশ্যই বাংলায় দিন এবং স্পষ্টভাবে বর্ণনা করুন)` }
                ]
            }
        });
        return response.text || "ছবিটি বিশ্লেষণ করা যায়নি।";
    } catch (error) {
        console.error("Image Analysis Error:", error);
        return "ছবি বিশ্লেষণে ত্রুটি।";
    }
};

// Text to Speech
export const generateSpeech = async (text: string): Promise<Uint8Array | null> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Say clearly in Bengali: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
                }
            }
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) return null;
        
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    } catch (error) {
        console.error("TTS Error:", error);
        return null;
    }
};

export const generateKeyphrases = async (text: string, config?: AIConfig): Promise<{ keyphrases: string[], actionItems: string[] }> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: config?.model || "gemini-3-flash-preview",
            contents: `Analyze this text and extract keyphrases and action items in Bengali JSON format: ${text}`,
            config: {
                temperature: config?.temperature ?? 0.5,
                topP: config?.topP ?? 0.95,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        keyphrases: { type: Type.ARRAY, items: { type: Type.STRING } },
                        actionItems: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["keyphrases", "actionItems"]
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        return { keyphrases: [], actionItems: [] };
    }
};

export const generateTags = async (text: string, config?: AIConfig): Promise<string[]> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: config?.model || "gemini-3-flash-preview",
            contents: `Provide 3-5 relevant Bengali tags for this text as a JSON array: ${text}`,
            config: {
                temperature: config?.temperature ?? 0.3,
                topP: config?.topP ?? 0.95,
                responseMimeType: "application/json",
                responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        });
        return JSON.parse(response.text || "[]");
    } catch (error) {
        return [];
    }
};

export const generateCodeSnippet = async (text: string): Promise<string> => {
    if (!text.trim()) return "";
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `নোটের এই বিষয়বস্তুর ওপর ভিত্তি করে একটি কার্যকরী প্রোগ্রামিং কোড স্নিপেট তৈরি করুন (যেমন Python, JavaScript বা C++)। নোটের লজিক বা সারমর্ম কোড হিসেবে প্রকাশ করুন। শুধুমাত্র কোড ব্লকটি দিন, কোনো অতিরিক্ত ব্যাখ্যা বা মার্কডাউন ছাড়াই।\n\nনোটের বিষয়বস্তু:\n${text}`,
        });
        
        let code = response.text || "// কোড জেনারেট করা যায়নি।";
        
        // Remove markdown code blocks if present to ensure clean copy
        code = code.replace(/^```[a-zA-Z]*\n?/g, '').replace(/```$/g, '').trim();
        
        return code;
    } catch (error) {
        console.error("Code Gen Error:", error);
        return "// কোড জেনারেট করতে সমস্যা হয়েছে।";
    }
};
