"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AIContextType {
    aiModel: string;
    setAIModel: (model: string) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: React.ReactNode }) {
    const [aiModel, setAIModel] = useState("groq-llama");

    // Load AI model from localStorage on mount
    useEffect(() => {
        console.log('🔧 AIContext: Initializing...');

        const savedModel = localStorage.getItem("ai-model");

        console.log('📊 localStorage values:', { savedModel });

        if (savedModel) {
            setAIModel(savedModel);
        } else {
            localStorage.setItem("ai-model", "groq-llama");
        }

        console.log('✅ AIContext: Initialized - AI is always active');
    }, []);

    const handleSetAIModel = (model: string) => {
        setAIModel(model);
        localStorage.setItem("ai-model", model);
    };

    return (
        <AIContext.Provider
            value={{
                aiModel,
                setAIModel: handleSetAIModel,
            }}
        >
            {children}
        </AIContext.Provider>
    );
}

export function useAI() {
    const context = useContext(AIContext);
    if (context === undefined) {
        throw new Error("useAI must be used within an AIProvider");
    }
    return context;
}
