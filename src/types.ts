export interface AnswerWithImages {
    is_appropriate: boolean;
    items: {
        keywords: string;
        text: string;
        image: string;
    }[];
}