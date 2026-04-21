import { createContext, useContext, useState } from "react";

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
    const [examMode, setExamMode] = useState(false);

    return (
        <ExamContext.Provider value={{ examMode, setExamMode }}>
            {children}
        </ExamContext.Provider>
    );
};

export const useExam = () => useContext(ExamContext);