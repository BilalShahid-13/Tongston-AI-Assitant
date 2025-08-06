
export const lessonPlanPrompt = `Create/produce the best and most comprehensive, relevant, engaging, efficient and effective SMART lesson plan with the best teaching and learning methods incorporating Multiple Intelligences and 21st Century skills, ensuring that term 1 lesson plans match Personal Development and Growth; Term 2 lesson plans match Professional Development and Growth; and Term 3 lesson plans match Public Development and Growth, according to the following parameters,
    ensuring that all of them are captured/achieved.`

export const assessmentPlanPrompt = `Create/produce the best and most comprehensive, relevant, engaging continuous assessment / end of term assessment methods incorporating Multiple Intelligences and 21st Century skills, ensuring that term 1 lesson plans match Personal Development and Growth; Term 2 lesson plans match Professional Development and Growth; and Term 3 lesson plans match Public Development and Growth, according to the following parameters, ensuring that all of them are captured/achieved.`


export const promptTemplate = (lessonPlanPrompt: string, docContext: string, message: string) => {
    return `
        role: "system",
        content: "${lessonPlanPrompt}
    -------
        START CONTEXT
${docContext}
  END CONTEXT
    -------
        QUESTION: ${message}"
    `;
};