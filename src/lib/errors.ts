export class HtmlToTextConversionError extends Error {
    constructor(message: string, public context?: any) {
        super(message); 
        this.name = 'HtmlToTextConversionError'; 
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HtmlToTextConversionError);
        }
    }
}